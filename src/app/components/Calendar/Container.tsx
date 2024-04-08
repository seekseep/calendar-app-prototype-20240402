import { PropsWithChildren, useEffect, useRef, useState } from 'react'

import { Box } from '@mui/material'

import { useCalendar, useTheme } from './hooks'

const duration = 50
const scrollUnit = 10

export default function Container ({ children }: PropsWithChildren) {
  const {
    state: {
      drag: dragState,
    }
  } = useCalendar()
  const {
    scrollHelperSize
  } = useTheme()

  const [scroll, setScroll] = useState<{ x: number, y: number} | null>(null)

  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scroll) return

    let timer:number = 0

    function step () {
      const inner = innerRef.current
      if (!scroll) return
      if (inner == null) return
      if (scroll.x !== 0) inner.scrollLeft += scroll.x
      if (scroll.y !== 0) inner.scrollTop += scroll.y
      timer = window.setTimeout(step, duration)
    }

    timer = window.setTimeout(step, duration)

    return () => window.clearTimeout(timer)
  }, [scroll])

  return (
    <Box position="relative" width="100%" height="100%">
      <Box
        ref={innerRef}
        position="absolute"
        width="100%"
        height="100%"
        overflow="auto"
        onMouseMove={(event) => {
          if (!dragState) return

          const inner = event.currentTarget
          const rect = inner.getBoundingClientRect()
          const width = rect.width
          const height = rect.height
          const offsetX = event.clientX - rect.left
          const offsetY = event.clientY - rect.top

          const scrollX = offsetX < scrollHelperSize ? -1 : offsetX > width - scrollHelperSize ? 1 : 0
          const scrollY = offsetY < scrollHelperSize ? -1 : offsetY > height - scrollHelperSize ? 1 : 0

          setScroll({
            x: scrollX * scrollUnit,
            y: scrollY * scrollUnit,
          })
        }}>
        {children}
      </Box>
    </Box>
  )
}
