
import { Box } from "@mui/material";
import { useCalendar, useTheme } from "./hooks";
import { useEffect, useState } from "react";

const SCROLL_SIZE = 10

export default function ScrollHelper () {
  const { scrollHelperSize, zIndex } = useTheme()
  const { state: { drag }, refs: { inner: innerRef } } = useCalendar()

  const [vector, setVector] = useState<{ x: number, y: number } | null>(null)

  useEffect(() => {
    if (!drag) return
    if (!innerRef?.current) return
    if (vector == null) return

    let timer: NodeJS.Timeout | null = null
    function step () {
      const inner = innerRef?.current
      if (!inner) return
      if (vector == null) return
      inner.scrollLeft += vector.x
      inner.scrollTop += vector.y
      timer = setTimeout(step, 50)
    }

    timer = setTimeout(step, 50)

    return () => {
      timer && clearTimeout(timer)
    }
  }, [drag, innerRef, vector])



  if (!drag) return null

  return (
    <>
      <Box
        position="absolute"
        zIndex={zIndex.scrollHelper}
        top="0"
        left="0"
        right="0"
        height={scrollHelperSize}
        onMouseOver={() => { setVector({ x: 0, y: -SCROLL_SIZE }) }}
        onMouseOut={() => { setVector(null) }}
        sx={{ opacity: 0.2 }}
      />
      <Box
        position="absolute"
        zIndex={zIndex.scrollHelper}
        left="0"
        right="0"
        bottom="0"
        height={scrollHelperSize}
        onMouseOver={() => { setVector({ x: 0, y: SCROLL_SIZE }) }}
        onMouseOut={() => { setVector(null) }}
        sx={{ opacity: 0.2 }}
      />
      <Box
        position="absolute"
        zIndex={zIndex.scrollHelper}
        width={scrollHelperSize}
        top={scrollHelperSize}
        bottom={scrollHelperSize}
        right="0"
        onMouseOver={() => { setVector({ x: SCROLL_SIZE, y: 0 }) }}
        onMouseOut={() => { setVector(null) }}
        sx={{ opacity: 0.2 }}
      />
      <Box
        position="absolute"
        zIndex={zIndex.scrollHelper}
        top={scrollHelperSize}
        width={scrollHelperSize}
        bottom={scrollHelperSize}
        left="0"
        onMouseOver={() => { setVector({ x: -SCROLL_SIZE, y: 0 }) }}
        onMouseOut={() => { setVector(null) }}
        sx={{ opacity: 0.2 }}
      />
    </>
  )
}
