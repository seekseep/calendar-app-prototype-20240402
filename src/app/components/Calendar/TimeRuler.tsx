import { memo } from 'react'
import { Box, Typography } from '@mui/material'

function TimeRuler ({
  minuteWidth,
  headWidth,
  height,
  footWidth,
  top,
  zIndex,
}: {
  top: number
  zIndex: number
  minuteWidth: number
  headWidth: number
  height: number
  footWidth: number
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const bodyWidth = minuteWidth * 60 * 24
  const width = headWidth + bodyWidth + footWidth

  return (
    <Box
      position="sticky"
      top={top}
      zIndex={zIndex}
      width={width}
      display="flex"
      height={height}
      bgcolor="background.default">
      <Box
        width={headWidth}
        flexShrink={0}
        sx={{
          borderRightColor: 'divider',
          borderRightStyle: 'solid',
          borderRightWidth: 1,
          borderBottomColor: 'divider',
          borderBottomStyle: 'solid',
          borderBottomWidth: 1
        }} />
      {hours.map(hour => (
        <Box
          key={hour}
          flexShrink="0"
          px={0.25}
          sx={{
            borderRightColor: 'divider',
            borderRightStyle: 'solid',
            borderRightWidth: 1,
            borderBottomColor: 'divider',
            borderBottomStyle: 'solid',
            borderBottomWidth: 1
          }}
          width={60 * minuteWidth}>
            <Typography variant="caption">
              {`${hour.toString().padStart(2, '0')}:00`}
            </Typography>
        </Box>
      ))}
      <Box width={footWidth} />
    </Box>
  )
}

export default  memo(TimeRuler)
