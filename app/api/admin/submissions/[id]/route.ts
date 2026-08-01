import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminSession()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params

  const submission = await prisma.paymentSubmission.findUnique({
    where: { id },
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
  })

  if (!submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
  }

  return NextResponse.json({ submission })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminSession()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const action = body.action as 'approve' | 'reject'

  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const submission = await prisma.paymentSubmission.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
  }

  if (submission.status !== 'PENDING') {
    return NextResponse.json(
      { error: 'ALREADY_REVIEWED', message: 'This submission has already been reviewed.' },
      { status: 409 },
    )
  }

  const now = new Date()

  if (action === 'approve') {
    const [updatedSubmission] = await prisma.$transaction([
      prisma.paymentSubmission.update({
        where: { id },
        data: { status: 'APPROVED', reviewedAt: now },
        include: {
          user: {
            select: { id: true, email: true, name: true, plan: true },
          },
        },
      }),
      prisma.userProfile.update({
        where: { id: submission.userId },
        data: { plan: 'PRO' },
      }),
      prisma.subscription.upsert({
        where: { userId: submission.userId },
        create: {
          userId: submission.userId,
          plan: 'PRO',
          startedAt: now,
        },
        update: {
          plan: 'PRO',
          startedAt: now,
          expiresAt: null,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: `${submission.user.email} upgraded to Pro.`,
      submission: updatedSubmission,
    })
  }

  const updatedSubmission = await prisma.paymentSubmission.update({
    where: { id },
    data: { status: 'REJECTED', reviewedAt: now },
    include: {
      user: {
        select: { id: true, email: true, name: true, plan: true },
      },
    },
  })

  return NextResponse.json({
    success: true,
    message: 'Payment proof rejected.',
    submission: updatedSubmission,
  })
}
