import { SimplePage } from '@/components/simple-page'

export const metadata = { title: 'Terms of Service — HAFI' }

export default function TermsPage() {
  return (
    <SimplePage title="Terms of Service" subtitle="Placeholder — pending legal review.">
      <p>
        This page is a structural placeholder. HAFI's actual Terms of Service will be published
        here following legal review, and will cover account eligibility, acceptable use, venue
        and content listings, and limitation of liability.
      </p>
      <p>Questions in the meantime: <a href="/contact">contact us</a>.</p>
    </SimplePage>
  )
}
