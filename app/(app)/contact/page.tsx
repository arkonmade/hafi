import { SimplePage } from '@/components/simple-page'

export const metadata = { title: 'Contact — HAFI' }

export default function ContactPage() {
  return (
    <SimplePage title="Contact Us" subtitle="We'd love to hear from you.">
      <p>
        For general inquiries, partnership requests, or venue listings, reach us at{' '}
        <a href="mailto:hello@hafi.rw">hello@hafi.rw</a>.
      </p>
      <p>
        For support with your account or the app, visit our{' '}
        <a href="/support">Support Center</a> instead — you'll get a faster response.
      </p>
      <h2>Based in</h2>
      <p>Kigali, Rwanda</p>
    </SimplePage>
  )
}
