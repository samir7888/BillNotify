import { auth, currentUser } from '@clerk/nextjs/server'

export const ADMIN_EMAIL = 'basnetsameer78@gmail.com'

export async function getAdminSession() {
  const { userId } = await auth()
  if (!userId) return null

  const user = await currentUser()
  if (!user) return null

  const email =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ??
    user.emailAddresses[0]?.emailAddress

  if (!email || email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) return null

  return { userId, email }
}

export async function requireAdmin() {
  const session = await getAdminSession()
  if (!session) {
    throw new Error('FORBIDDEN')
  }
  return session
}
