import { Architecture, Launch } from './components/Build'
import { Footer, Nav, StickyCta } from './components/Chrome'
import { DemoGen } from './components/DemoGen'
import { FinalCta } from './components/FinalCta'
import { Hero, TrustBar } from './components/Hero'
import { CallProvider } from './components/LiveAgent'
import { Journey } from './components/Journey'
import { LiveCall } from './components/LiveCall'
import { BusinessOutcomes, Integrations, Security } from './components/Outcomes'
import { Agents, Platform } from './components/Platform'

export default function App() {
  return (
    <CallProvider>
      <Nav />
      <main>
        <Hero />              {/* 1  · hero + journey rail            */}
        <TrustBar />
        {/* "How businesses use it" leads, directly under the hero: the first
            question a visitor has is what using this actually looks like. It
            answers that in five self-playing steps before the page asks them
            to read anything longer. */}
        <Launch />            {/* 2  · how businesses use it          */}
        <Journey />           {/* 3  · the ten-step journey           */}
        <LiveCall />          {/* 4  · live conversation simulator    */}
        <Platform />          {/* 5  · platform capabilities          */}
        <Agents />            {/* 6  · agent types                    */}
        <Architecture />      {/* 7  · automation architecture        */}
        <BusinessOutcomes />  {/* 9  · business outcomes              */}
        <Integrations />      {/* 10 · integrations                   */}
        <Security />          {/* 11 · security                       */}
        <DemoGen />           {/* 13 · demo generator                 */}
        <FinalCta />          {/* 14 · final CTA                      */}
      </main>
      <Footer />
      <StickyCta />
    </CallProvider>
  )
}
