import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { checkNEABill } from '@/lib/providers/nea'
import { sendBillReadyEmail } from '@/lib/email'
import { shouldNotify } from '@/lib/utils'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // Get the account and verify ownership
  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
  })
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const account = await prisma.utilityAccount.findFirst({
    where: { id, userId: profile.id },
  })

  if (!account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 })
  }

  if (account.utilityType !== 'ELECTRICITY') {
    return NextResponse.json({
      success: false,
      error: 'Water billing checks are coming soon.',
    })
  }

  try {
    const result = await checkNEABill({
      neaLocationCode: account.neaLocationCode,
      scNo: account.scNo,
      consumerId: account.consumerId,
    })

    const updateData: Record<string, unknown> = {
      lastCheckedAt: new Date(),
    }

    if (result.success) {
      updateData.lastStatus = result.status ?? 'Checked'
      updateData.lastAmount = result.payableAmount ?? null
      updateData.lastBillMonth = result.dueBillOf ?? null
      if (result.customerName) updateData.customerName = result.customerName
    } else {
      updateData.lastStatus = `Error: ${result.error}`
    }

    const updated = await prisma.utilityAccount.update({
      where: { id: account.id },
      data: updateData,
    })

    // Send notification if warranted
    let notified = false
    if (
      result.success &&
      result.payableAmount &&
      result.payableAmount > 0 &&
      profile.emailEnabled
    ) {
      const newBillMonth = result.dueBillOf ?? 'Unknown'
      const needsNotification = shouldNotify(
        account.lastAmount,
        account.lastBillMonth,
        result.payableAmount,
        newBillMonth,
        account.lastNotifiedAt,
      )

      if (needsNotification) {
        const emailTo = account.emailOverride ?? profile.email

        try {
          await sendBillReadyEmail({
            to: emailTo,
            customerName: result.customerName ?? account.customerName ?? 'Customer',
            consumerId: account.consumerId,
            amount: result.payableAmount,
            billMonth: newBillMonth,
            status: result.status ?? 'Ready to Pay',
            providerName: account.providerName,
            utilityType: account.utilityType,
          })

          await prisma.notificationLog.create({
            data: {
              userId: profile.id,
              accountId: account.id,
              email: emailTo,
              amount: result.payableAmount,
              billMonth: newBillMonth,
              status: result.status ?? 'Ready to Pay',
            },
          })

          await prisma.utilityAccount.update({
            where: { id: account.id },
            data: {
              lastNotifiedAt: new Date(),
              lastAmount: result.payableAmount,
              lastBillMonth: newBillMonth,
            },
          })

          notified = true
        } catch (emailErr) {
          console.error('[CheckAccount] Email failed:', emailErr)
        }
      }
    }

    return NextResponse.json({
      success: true,
      result,
      account: updated,
      notified,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
