import { SimplePage } from '@/components/simple-page'

export const metadata = { title: 'Help Center — HAFI' }

const faqs = [
  {
    q: 'How do I find where to watch a match?',
    a: "Open any match from Watch or Matches and check its \"Where to experience it\" section — it lists tickets, venues showing it, livestreams, and TV broadcast options.",
  },
  {
    q: 'How do I follow a venue?',
    a: 'Visit any venue page and tap Follow. Following a venue works just like following a team — you\'ll see its activity in your feed.',
  },
  {
    q: 'Can I use HAFI for sports other than football?',
    a: 'Yes — HAFI covers basketball, volleyball, and more, with football, rugby, athletics, cycling, tennis, motorsports, and esports all planned.',
  },
  {
    q: 'Is HAFI available outside Rwanda?',
    a: "HAFI launched Rwanda-first, with an architecture built to expand across East Africa.",
  },
]

export default function HelpPage() {
  return (
    <SimplePage title="Help Center" subtitle="Answers to common questions.">
      {faqs.map((faq) => (
        <div key={faq.q}>
          <h2>{faq.q}</h2>
          <p>{faq.a}</p>
        </div>
      ))}
      <p>
        Can't find what you're looking for?{' '}
        <a href="/support">Contact Support</a>.
      </p>
    </SimplePage>
  )
}
