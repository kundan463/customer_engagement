import { BigCta, Footer, Nav, PromoBar, StickyCta } from './components/Chrome'
import { Hero, TrustBar } from './components/Hero'
import { Economics, Features, HowItWorks, Pricing } from './components/Sections'
import { Conversation } from './components/Conversation'
import { Faq } from './components/Faq'

export default function App() {
  return (
    <>
      <PromoBar />
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <HowItWorks />
        <Features />
        <Conversation />
        <Economics />
        <Pricing />
        <Faq />
        <BigCta />
      </main>
      <Footer />
      <StickyCta />
    </>
  )
}
