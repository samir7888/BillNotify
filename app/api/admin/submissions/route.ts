import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'

export async function GET(req: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const status = req.nextUrl.searchParams.get('status') ?? 'PENDING'
  const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const

  if (!validStatuses.includes(status as (typeof validStatuses)[number])) {
    return NextResponse.json({ error: 'Invalid status filter' }, { status: 400 })
  }

  const submissions = await prisma.paymentSubmission.findMany({
    where: status === 'ALL' ? undefined : { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
        },
      },
    },
    orderBy: { submittedAt: 'desc' },
  })

  return NextResponse.json({
    submissions: submissions.map(({ proofImage: _proofImage, ...rest }) => ({
      ...rest,
      hasProofImage: true,
    })),
  })
}
