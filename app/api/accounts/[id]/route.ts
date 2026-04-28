import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// PUT /api/accounts/[id] — update account
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const profile = await prisma.userProfile.findUnique({ where: { clerkId: userId } })
  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const account = await prisma.utilityAccount.findFirst({
    where: { id, userId: profile.id },
  })
  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const updated = await prisma.utilityAccount.update({
    where: { id },
    data: {
      emailOverride: body.emailOverride ?? null,
      active: body.active ?? account.active,
    },
  })

  return NextResponse.json({ success: true, account: updated })
}

// DELETE /api/accounts/[id] — delete account
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const profile = await prisma.userProfile.findUnique({ where: { clerkId: userId } })
  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const account = await prisma.utilityAccount.findFirst({
    where: { id, userId: profile.id },
  })
  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.utilityAccount.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
