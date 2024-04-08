import { ReactNode } from 'react'

import { Typography } from '@mui/material'
import Box from '@mui/material/Box'

import { useTheme } from '../hooks'

export default function DateRowHead ({
  label
}: {
  label: ReactNode
}) {
  const {
    zIndex,
    rowHeadWidth
  } = useTheme()

  return (
    <Box
      position="sticky"
      left={0}
      bgcolor={'background.default'}
      width={rowHeadWidth}
      zIndex={zIndex.rowHead}
      flexShrink={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        borderRightColor: 'divider',
        borderRightStyle: 'solid',
        borderRightWidth: 1
      }}>
      <Typography variant="body2">
        {label}
      </Typography>
    </Box>
  )
}
