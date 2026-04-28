import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: { email: true, name: true, plan: true, emailEnabled: true, createdAt: true },
  })

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  return NextResponse.json(profile)
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { emailEnabled } = body

  const updated = await prisma.userProfile.update({
    where: { clerkId: userId },
    data: {
      ...(typeof emailEnabled === 'boolean' && { emailEnabled }),
    },
  })

  return NextResponse.json({ success: true, profile: updated })
}
