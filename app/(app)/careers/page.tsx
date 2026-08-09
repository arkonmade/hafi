import { SimplePage } from '@/components/simple-page'

export const metadata = { title: 'Careers — HAFI' }

export default function CareersPage() {
  return (
    <SimplePage title="Careers at HAFI" subtitle="Help build Africa's most connected sports community.">
      <p>
        We're not currently running an open hiring process, but we're always glad to hear from
        people who care about sport, community, and building products people genuinely enjoy
        using. If that's you, reach out via our{' '}
        <a href="/contact">contact page</a>.
      </p>
      <h2>What we look for</h2>
      <p>
        People who sweat the details, who understand Rwandan and East African sports culture
        firsthand, and who'd rather ship something excellent later than something mediocre now.
      </p>
    </SimplePage>
  )
}
