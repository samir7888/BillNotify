import type { Metadata } from 'next'
import { PricingContent } from '@/components/pricing/pricing-content'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Choose the BillNotify Nepal plan that fits your needs.',
}

export default function PricingPage() {
  return <PricingContent />
}
