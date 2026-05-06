import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { checkNEABill } from '@/lib/providers/nea'
import { FREE_ACCOUNT_LIMIT } from '@/lib/utils'

// GET /api/accounts — list user's accounts
export async function GET() {
  const { userId } = await auth();
  console.log('userid', userId)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    include: {
      accounts: {
        orderBy: { createdAt: 'desc' },
        include: {
          notifications: {
            orderBy: { sentAt: 'desc' },
            take: 1,
          },
        },
      },
    },
  })

  if (!profile) return NextResponse.json({ accounts: [], plan: 'FREE' })

  return NextResponse.json({
    accounts: profile.accounts,
    plan: profile.plan,
    totalCount: profile.accounts.length,
  })
}

// POST /api/accounts — create a new account
export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { utilityType, neaLocationCode, scNo, consumerId, emailOverride } = body

  if (!neaLocationCode || !scNo || !consumerId) {
    return NextResponse.json(
      { error: 'Location code, SC No, and Consumer ID are required.' },
      { status: 400 }
    )
  }

  // Get or create profile
  const profile = await prisma.userProfile.findUnique({ where: { clerkId: userId } })
  if (!profile) {
    return NextResponse.json({ error: 'User profile not found. Please reload.' }, { status: 404 })
  }

  // Check plan limits
  if (profile.plan === 'FREE') {
    const count = await prisma.utilityAccount.count({ where: { userId: profile.id } })
    if (count >= FREE_ACCOUNT_LIMIT()) {
      return NextResponse.json(
        { error: 'FREE_LIMIT_REACHED', message: `Free plan allows up to ${FREE_ACCOUNT_LIMIT()} accounts. Upgrade to Pro for unlimited accounts.` },
        { status: 403 }
      )
    }
  }

  // Check for duplicate
  const existing = await prisma.utilityAccount.findFirst({
    where: {
      userId: profile.id,
      neaLocationCode,
      scNo,
      consumerId,
    },
  })

  if (existing) {
    return NextResponse.json(
      { error: 'This account is already saved.' },
      { status: 409 }
    )
  }

  // Live validation via NEA for electricity accounts
  let customerName: string | undefined
  if (!utilityType || utilityType === 'ELECTRICITY') {
    const result = await checkNEABill({ neaLocationCode, scNo, consumerId })
    console.log(result,'result')

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error ?? 'Could not verify this account with NEA. Please check the details.',
          neaError: true,
        },
        { status: 422 }
      )
    }

    customerName = result.customerName
  }

  const account = await prisma.utilityAccount.create({
    data: {
      userId: profile.id,
      utilityType: utilityType ?? 'ELECTRICITY',
      providerName: utilityType === 'WATER' ? 'KUKL' : 'NEA',
      customerName,
      neaLocationCode,
      scNo,
      consumerId,
      emailOverride: emailOverride || null,
    },
  })

  return NextResponse.json({ success: true, account }, { status: 201 })
}
