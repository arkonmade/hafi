import { SimplePage } from '@/components/simple-page'

export const metadata = { title: 'Privacy Policy — HAFI' }

export default function PrivacyPage() {
  return (
    <SimplePage title="Privacy Policy" subtitle="Placeholder — pending legal review.">
      <p>
        This page is a structural placeholder. HAFI's actual Privacy Policy will be published
        here following legal review, and will explain what data we collect (account info,
        check-ins, activity), how it's used, and how you can control or delete it.
      </p>
      <p>Questions in the meantime: <a href="/contact">contact us</a>.</p>
    </SimplePage>
  )
}
