import { RefObject, useEffect, useState } from "react"

export function Spotlight({
  targetRef,
  padding = 8,
}: {
  targetRef: RefObject<HTMLElement | null>
  padding?: number
}) {
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (!targetRef.current) return
    setRect(targetRef.current.getBoundingClientRect())
  }, [targetRef])

  if (!rect) return null

  const { top, left, width, height } = rect

  const clipPath = `
    polygon(
      0% 0%,
      100% 0%,
      100% 100%,
      0% 100%,
      0% ${top - padding}px,
      ${left - padding}px ${top - padding}px,
      ${left - padding}px ${top + height + padding}px,
      ${left + width + padding}px ${top + height + padding}px,
      ${left + width + padding}px ${top - padding}px,
      0% ${top - padding}px
    )
  `

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 pointer-events-none"
      style={{ clipPath }}
    />
  )
}
