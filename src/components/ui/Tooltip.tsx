import { type ReactNode, useState, useEffect, useRef, useCallback } from 'react'

interface TooltipProps {
  text: string | undefined
  children: ReactNode
}

/**
 * Tooltip that works on both desktop (hover) and mobile/tablet (tap-to-toggle).
 * Tapping outside or on another tooltip dismisses the current one.
 * If text is undefined/empty, renders children without tooltip.
 */
export function Tooltip({ text, children }: TooltipProps) {
  const [active, setActive] = useState(false)
  const wrapperRef = useRef<HTMLSpanElement>(null)

  const close = useCallback(() => setActive(false), [])

  // Close on click outside
  useEffect(() => {
    if (!active) return
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setActive(false)
      }
    }
    document.addEventListener('pointerdown', handleOutside)
    return () => document.removeEventListener('pointerdown', handleOutside)
  }, [active])

  // Close on Escape key
  useEffect(() => {
    if (!active) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [active, close])

  if (!text) return <>{children}</>

  return (
    <span
      ref={wrapperRef}
      className={`tooltip-wrapper${active ? ' tooltip-active' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        setActive(prev => !prev)
      }}
    >
      {children}
      <span className="tooltip-popup">{text}</span>
    </span>
  )
}
