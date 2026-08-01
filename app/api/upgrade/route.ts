import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateProfile } from '@/lib/auth'
import { sendPaymentProofEmail } from '@/lib/email'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized', message: 'Please sign in to upgrade.' }, { status: 401 })
  }

  const profile = await getOrCreateProfile()
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  if (profile.plan === 'PRO') {
    return NextResponse.json(
      { error: 'ALREADY_PRO', message: 'You already have Pro access.' },
      { status: 400 },
    )
  }

  const pendingSubmission = await prisma.paymentSubmission.findFirst({
    where: { userId: profile.id, status: 'PENDING' },
  })

  if (pendingSubmission) {
    return NextResponse.json(
      {
        error: 'PENDING_SUBMISSION',
        message: 'You already have a payment under review. Please wait for verification.',
      },
      { status: 409 },
    )
  }

  const formData = await req.formData()
  const proof = formData.get('proof')

  if (!(proof instanceof File)) {
    return NextResponse.json(
      { error: 'MISSING_PROOF', message: 'Please upload a payment screenshot.' },
      { status: 400 },
    )
  }

  if (!ACCEPTED_TYPES.includes(proof.type)) {
    return NextResponse.json(
      { error: 'INVALID_TYPE', message: 'Please upload a JPG, PNG, or WebP image.' },
      { status: 400 },
    )
  }

  if (proof.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: 'FILE_TOO_LARGE', message: 'Image must be smaller than 5 MB.' },
      { status: 400 },
    )
  }

  const buffer = Buffer.from(await proof.arrayBuffer())
  const base64 = buffer.toString('base64')
  const proofImage = `data:${proof.type};base64,${base64}`

  const ext = proof.type === 'image/png' ? 'png' : proof.type === 'image/webp' ? 'webp' : 'jpg'

  const submission = await prisma.paymentSubmission.create({
    data: {
      userId: profile.id,
      proofImage,
      status: 'PENDING',
    },
  })

  try {
    await sendPaymentProofEmail({
      userEmail: profile.email,
      userName: profile.name,
      userId: profile.id,
      submissionId: submission.id,
      proofImageBuffer: buffer,
      proofImageFilename: `payment-proof-${submission.id}.${ext}`,
      proofImageContentType: proof.type,
    })
  } catch (err) {
    console.error('[Upgrade] Email failed, rolling back submission:', err)
    await prisma.paymentSubmission.delete({ where: { id: submission.id } })
    return NextResponse.json(
      { error: 'EMAIL_FAILED', message: 'Could not submit payment proof. Please try again.' },
      { status: 500 },
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Payment proof submitted. Please wait while we verify your payment.',
    submissionId: submission.id,
  })
}
