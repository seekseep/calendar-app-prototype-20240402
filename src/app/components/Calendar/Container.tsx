import { Box } from "@mui/material"
import { PropsWithChildren } from "react"
import ScrollHelper from "./ScrollHelper"
import { useCalendar } from "./hooks"

export default function Container ({ children }: PropsWithChildren) {
  const { refs: { inner: innerRef } } = useCalendar()
  return (
    <Box position="relative" width="100%" height="100%">
      <Box position="absolute" width="100%" height="100%" overflow="auto" ref={innerRef}>
        {children}
      </Box>
      <ScrollHelper />
    </Box>
  )
}
