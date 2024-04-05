import { Box, Typography, Stack, Select, MenuItem, CircularProgress } from '@mui/material'

import { useCalendar, useTheme } from './hooks'

export default function Toolbar ({
  isFetching
}: {
  isFetching?: boolean
}) {
  const { state: { minuteUnit }, helpers: { setMinuteUnit } } = useCalendar()
  const { toolbarHeight, zIndex } = useTheme()
  return (
    <Box
      position="sticky"
      top="0" left="0"
      height={toolbarHeight}
      bgcolor="background.default"
      px={2}
      display="flex"
      alignItems="center"
      zIndex={zIndex.toolbar}
      borderBottom={'1px solid divider'}
      sx={{
        borderBottomColor: 'divider',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1
      }}>
      <Stack direction="row" alignItems="center" gap={2}>
        <Typography variant="h6">プロトタイプ</Typography>
        <Typography variant="caption">20240402</Typography>
        <Select size="small" value={minuteUnit} onChange={(event) => setMinuteUnit(+event.target.value)}>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </Select>
        {isFetching && (
          <CircularProgress />
        )}
      </Stack>
    </Box>
  )
}
