import { format } from 'date-fns'

import { Box } from '@mui/material'

import DateRow from './DateRow'
import TimeRuler from './TimeRuler'
import { useCalendar, useTheme } from './hooks'

export default function Contents () {
  const { rowHeadWidth, minuteWidth, timeRulerHeight, toolbarHeight, zIndex, rowFootWidth } = useTheme()
  const { state: { pack } } = useCalendar()
  const width = rowHeadWidth + 24 * minuteWidth * 60 + rowFootWidth
  return (
    <Box width={width} sx={{ userSelect: 'none' }}>
      <TimeRuler
        top={toolbarHeight}
        zIndex={zIndex.timeRuler}
        headWidth={rowHeadWidth}
        height={timeRulerHeight}
        minuteWidth={minuteWidth}
        footWidth={rowFootWidth} />
      <Box>
        {pack.dates.map(date => (
          <DateRow key={format(date.date, 'yyyy-MM-dd')} date={date} />
        ))}
      </Box>
    </Box>
  )
}
