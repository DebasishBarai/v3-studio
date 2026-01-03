'use client'

import { useAnimation, useScroll, useMotionValueEvent, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"

export function useScrollDownAnimationHook() {
  const ref = useRef(null)
  const controls = useAnimation()
  const { scrollY } = useScroll()
  const isInView = useInView(ref, { amount: 0 })
  const [lastScrollY, setLastScrollY] = useState(0)
  const [lastTriggered, setLastTriggered] = useState(false)

  useEffect(() => {
    setLastScrollY(window.scrollY)
  }, [])

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!ref.current) return

    const rect = (ref.current as HTMLElement).getBoundingClientRect()
    const elementTop = rect.top
    const viewportHeight = window.innerHeight

    const isScrollingDown = latest > lastScrollY
    const isElementBelowViewport = elementTop > viewportHeight

    setLastScrollY(latest)

    // Animate when scrolling down and in view
    if (isScrollingDown && isInView && !lastTriggered) {
      controls.start("visible")
      setLastTriggered(true)
    }

    // Reset to hidden when scrolling up, out of view, AND element is below viewport
    if (!isScrollingDown && !isInView && lastTriggered && isElementBelowViewport) {
      controls.start("hidden")
      setLastTriggered(false)
    }
  })

  return { ref, controls }
}
