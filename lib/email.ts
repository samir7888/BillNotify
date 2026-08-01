import { Resend } from 'resend'
import { BillReadyEmail } from '@/components/email-template'
import { ADMIN_EMAIL } from '@/lib/admin'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'BillNotify Nepal <onboarding@resend.dev>'
export { ADMIN_EMAIL }

export interface PaymentProofEmailPayload {
  userEmail: string
  userName: string | null
  userId: string
  submissionId: string
  proofImageBuffer: Buffer
  proofImageFilename: string
  proofImageContentType: string
}

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

export async function sendPaymentProofEmail(payload: PaymentProofEmailPayload) {
  const displayName = payload.userName ?? payload.userEmail
  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin`

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [ADMIN_EMAIL],
    subject: `💳 Pro upgrade payment proof — ${displayName}`,
    html: `
      <div style="font-family: Inter, system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #111827;">New Pro Upgrade Payment</h2>
        <p style="color: #374151; line-height: 1.6;">
          A user submitted payment proof for the <strong>NPR 49 lifetime Pro plan</strong>.
          Please review the attached screenshot and update their plan in the database if valid.
        </p>
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">User</td>
            <td style="padding: 8px 0; font-weight: 600;">${displayName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Email</td>
            <td style="padding: 8px 0; font-weight: 600;">${payload.userEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">User ID</td>
            <td style="padding: 8px 0; font-family: monospace; font-size: 13px;">${payload.userId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Submission ID</td>
            <td style="padding: 8px 0; font-family: monospace; font-size: 13px;">${payload.submissionId}</td>
          </tr>
        </table>
        <p style="color: #6b7280; font-size: 13px;">
          <a href="${adminUrl}" style="color: #4f46e5; font-weight: 600;">Open admin panel</a>
          to approve or reject this payment.
        </p>
      </div>
    `,
    attachments: [
      {
        filename: payload.proofImageFilename,
        content: payload.proofImageBuffer,
        contentType: payload.proofImageContentType,
      },
    ],
  })

  if (error) {
    console.error('[Email] Failed to send payment proof:', error)
    throw new Error(error.message)
  }

  return data
}
