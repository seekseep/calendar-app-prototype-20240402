import { memo } from "react"
import { Box } from "@mui/material"

function TimeGuide ({
  zIndex,
  minuteWidth,
  height,
  minuteUnit
}: {
  zIndex: number
  minuteWidth: number
  height: number
  minuteUnit: number
}) {
  const sections = Array.from({ length: 24 * 60 / minuteUnit }, (_, i) => i)
  const width = minuteWidth * 60 * 24

  return (
    <Box
      zIndex={zIndex}
      position="absolute"
      width={width}
      height="100%"
      display="flex"
      flexShrink={0}>
      {sections.map(section => (
        <Box
          key={section}
          flexShrink={0}
          sx={{
            borderRightColor: 'divider',
            borderRightStyle: 'solid',
            borderRightWidth: 1
          }}
          width={minuteWidth * minuteUnit}
          height={height} />
      ))}
    </Box>
  )
}

export default memo(TimeGuide)
