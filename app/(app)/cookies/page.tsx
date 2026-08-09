import { SimplePage } from '@/components/simple-page'

export const metadata = { title: 'Cookie Policy — HAFI' }

export default function CookiesPage() {
  return (
    <SimplePage title="Cookie Policy" subtitle="Placeholder — pending legal review.">
      <p>
        This page is a structural placeholder. HAFI's actual Cookie Policy will be published here
        following legal review, and will explain which cookies we use (session, preferences,
        analytics) and how to manage them.
      </p>
      <p>Questions in the meantime: <a href="/contact">contact us</a>.</p>
    </SimplePage>
  )
}
