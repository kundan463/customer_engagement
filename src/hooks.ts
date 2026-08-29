import { useCallback, useEffect, useRef, useState } from 'react'

/** True once the element has scrolled into view (fires once). */
export function useInView<T extends Element>(threshold = 0.12) {
  const ref = useRef<T | null>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect() }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    )
    io.observe(el)

    // Belt and braces: if the observer never fires (element already past the
    // viewport, or a browser that throttles it), reveal anyway.
    const fallback = window.setTimeout(() => setSeen(true), 1200)
    return () => { io.disconnect(); window.clearTimeout(fallback) }
  }, [threshold, seen])

  return [ref, seen] as const
}

/** Pairs with the `.reveal` / `.reveal.is-visible` CSS. */
export function useReveal<T extends Element>(threshold = 0.12) {
  const [ref, seen] = useInView<T>(threshold)
  return { ref, className: seen ? 'reveal is-visible' : 'reveal' }
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/** setInterval as an effect; pass `null` to pause. */
export function useInterval(fn: () => void, ms: number | null) {
  const saved = useRef(fn)
  useEffect(() => { saved.current = fn }, [fn])
  useEffect(() => {
    if (ms === null) return
    const id = window.setInterval(() => saved.current(), ms)
    return () => window.clearInterval(id)
  }, [ms])
}

/** Counts 0 → target once visible. */
export function useCountUp<T extends Element>(target: number, ms = 1400) {
  const [ref, seen] = useInView<T>(0.35)
  const [val, setVal] = useState(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!seen) return
    if (reduced) { setVal(target); return }

    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms)
      setVal(target * (1 - Math.pow(1 - p, 3))) // easeOutCubic
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // If rAF never runs (hidden tab), don't leave the number sitting at zero.
    const fallback = window.setTimeout(() => setVal((v) => (v === 0 ? target : v)), ms + 400)
    return () => { cancelAnimationFrame(raf); window.clearTimeout(fallback) }
  }, [seen, target, ms, reduced])

  return [ref, val] as const
}

/** Fire-and-forget status message. */
export function useToast() {
  const [msg, setMsg] = useState('')
  const timer = useRef<number | undefined>(undefined)
  const show = useCallback((text: string) => {
    setMsg(text)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMsg(''), 3600)
  }, [])
  useEffect(() => () => window.clearTimeout(timer.current), [])
  return { msg, show }
}
