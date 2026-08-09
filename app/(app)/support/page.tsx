import { SimplePage } from '@/components/simple-page'

export const metadata = { title: 'Support — HAFI' }

export default function SupportPage() {
  return (
    <SimplePage title="Support Center" subtitle="Get help with your HAFI account.">
      <p>
        Reach our support team at <a href="mailto:support@hafi.rw">support@hafi.rw</a> and we'll
        get back to you as soon as we can.
      </p>
      <h2>Common topics</h2>
      <p>Account access, venue listings, match information corrections, and reporting an issue with the app.</p>
      <p>
        For general questions, check the <a href="/help">Help Center</a> first — most answers are there.
      </p>
    </SimplePage>
  )
}
