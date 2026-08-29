import { Architecture, Launch } from './components/Build'
import { Footer, Nav, StickyCta } from './components/Chrome'
import { DemoGen } from './components/DemoGen'
import { FinalCta } from './components/FinalCta'
import { Hero, TrustBar } from './components/Hero'
import { Journey } from './components/Journey'
import { LiveCall } from './components/LiveCall'
import { BusinessOutcomes, Integrations, Security } from './components/Outcomes'
import { Agents, Platform } from './components/Platform'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />              {/* 1  · hero + journey rail            */}
        <TrustBar />
        <Journey />           {/* 2  · the ten-step journey           */}
        <LiveCall />          {/* 3  · live conversation simulator    */}
        <Platform />          {/* 4  · platform capabilities          */}
        <Agents />            {/* 5  · agent types                    */}
        <Launch />            {/* 6  · how businesses launch          */}
        <Architecture />      {/* 7  · automation architecture        */}
        <BusinessOutcomes />  {/* 9  · business outcomes              */}
        <Integrations />      {/* 10 · integrations                   */}
        <Security />          {/* 11 · security                       */}
        <DemoGen />           {/* 13 · demo generator                 */}
        <FinalCta />          {/* 14 · final CTA                      */}
      </main>
      <Footer />
      <StickyCta />
    </>
  )
}
