import { PropsWithChildren } from 'react'

import { Box } from '@mui/material'

export default function DateRowContainer ({
  children
}: PropsWithChildren) {
  return (
    <Box display="flex" sx={{
      borderBottomColor: 'divider',
      borderBottomStyle: 'solid',
      borderBottomWidth: 1
    }}>
      {children}
    </Box>
  )
}
