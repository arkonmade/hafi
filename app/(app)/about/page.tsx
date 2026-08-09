import { SimplePage } from '@/components/simple-page'

export const metadata = { title: 'About — HAFI' }

export default function AboutPage() {
  return (
    <SimplePage title="About HAFI" subtitle="Sports are better together.">
      <p>
        HAFI is a Rwandan sports platform built around one belief: sport means more when it's
        shared. We help fans discover what's happening across football, basketball, volleyball,
        and beyond — not just the score, but where to watch it, who's going, and where the
        atmosphere is best.
      </p>
      <p>
        We started in Kigali because Rwanda's matchday culture — from Amahoro Stadium to the
        sports bars of Kimihurura — deserved a home online. Our goal is to build Africa's most
        connected sports community, one match, one venue, and one community at a time.
      </p>
      <h2>What we believe</h2>
      <p>
        Community before statistics. Scores matter, but the people you share them with matter
        more. Every feature we build is judged against one question: does this bring people
        closer to the game, and to each other?
      </p>
    </SimplePage>
  )
}
