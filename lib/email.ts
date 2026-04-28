import { Resend } from 'resend'
import { BillReadyEmail } from '@/components/email-template'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'BillNotify Nepal <onboarding@resend.dev>'

export interface BillEmailPayload {
  to: string
  customerName: string
  consumerId: string
  amount: number
  billMonth: string
  status: string
  providerName: string
  utilityType: string
}

export async function sendBillReadyEmail(payload: BillEmailPayload) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [payload.to],
    subject: `⚡ Your ${payload.providerName} bill is ready to pay — NPR ${payload.amount.toLocaleString()}`,
    react: BillReadyEmail(payload),
  })

  if (error) {
    console.error('[Email] Failed to send:', error)
    throw new Error(error.message)
  }

  return data
}
