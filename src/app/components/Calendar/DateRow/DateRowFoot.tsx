import Box from '@mui/material/Box'

import { useTheme } from '../hooks'

export default function DateRowFoot () {
  const {
    rowFootWidth
  } = useTheme()

  return (
    <Box width={rowFootWidth} />
  )
}
