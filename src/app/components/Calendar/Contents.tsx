import { Box } from "@mui/material";
import TimeRuler from "./TimeRuler";
import { useCalendar, useTheme } from "./hooks";
import DateRow from "./DateRow";
import { format } from "date-fns";

export default function Contents () {
  const { rowHeadWidth, minuteWidth, timeRulerHeight, toolbarHeight, zIndex } = useTheme()
  const { state: { pack } } = useCalendar()
  const width = rowHeadWidth + 24 * minuteWidth * 60
  return (
    <Box width={width} sx={{ userSelect: 'none' }}>
      <TimeRuler
        top={toolbarHeight}
        zIndex={zIndex.timeRuler}
        headWidth={rowHeadWidth}
        height={timeRulerHeight}
        minuteWidth={minuteWidth}
        footWidth={0} />
      <Box>
        {pack.dates.map(date => (
          <DateRow key={format(date.date, 'yyyy-MM-dd')} date={date} />
        ))}
      </Box>
    </Box>
  )
}
