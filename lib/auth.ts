import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

export async function getAuthUser() {
  const { userId } = await auth()
  return userId
}

export async function requireAuth() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

/**
 * Gets or creates a UserProfile synced from Clerk.
 * Call this on every dashboard load to ensure profile exists.
 */
export async function getOrCreateProfile() {
  const { userId } = await auth()
  if (!userId) return null

  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const email =
    clerkUser.emailAddresses[0]?.emailAddress ?? ''
  const name =
    `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || null

  const profile = await prisma.userProfile.upsert({
    where: { clerkId: userId },
    update: { email, name },
    create: {
      clerkId: userId,
      email,
      name,
      plan: 'FREE',
    },
  })

  return profile
}
