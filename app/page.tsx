import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { Benefits } from '../components/Benefits'
import { JobBoard } from '../components/JobBoard'
import { Testimonial } from '../components/Testimonial'
import { Footer } from '../components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Benefits />
      <JobBoard />
      <Testimonial />
      <Footer />
    </main>
  )
}
