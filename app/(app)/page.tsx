import type { Metadata } from 'next'
import HomePage from './home'

export const metadata: Metadata = {
  title: 'HAFI - Sports, Together',
  description: 'Discover matches, find the best places to watch, and connect with the sports community across Rwanda.',
}

export default function Page() {
  return <HomePage />
}
