import { PropsWithChildren } from 'react'

import { Box } from '@mui/material'

import { useTheme } from '../hooks'

export default function DateRowBody ({
  children,
  rowCount
}: PropsWithChildren<{
  rowCount: number
}>) {
  const {
    minuteWidth,
    eventHeight,
  } = useTheme()

  const bodyWidth = minuteWidth * 60 * 24
  const height = eventHeight * rowCount

  return (
    <Box
      width={bodyWidth}
      position="relative"
      height={height}
      flexShrink={0}>
      {children}
    </Box>
  )
}
