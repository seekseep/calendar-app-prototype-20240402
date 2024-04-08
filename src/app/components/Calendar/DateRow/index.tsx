import { format } from 'date-fns'

import { Box } from '@mui/material'

import { CalendarDate } from '@/types'

import EventCard from '../EventCard'
import { createEventCardProps } from '../EventCard/utilities'
import TimeGuide from '../TimeGuide'
import { useCalendar, useTheme } from '../hooks'

import DateRowBody from './DateRowBody'
import DateRowContainer from './DateRowContainer'
import DateRowFoot from './DateRowFoot'
import DateRowHead from './DateRowHead'
import { useDisplayCalendarDate, useDragStartHandlerById, useHandleDrag, useHandleDrop } from './hooks'

export default function DateRow ({
  date
}: {
  date: CalendarDate
}) {
  const {
    minuteWidth,
    eventHeight,
    rowFootWidth,
    zIndex,
  } = useTheme()
  const {
    state: {
      drag: dragState,
      minuteUnit,
    }
  } = useCalendar()

  const { displayEvents, rowCount } = useDisplayCalendarDate(date)
  const handleDrag = useHandleDrag(date)
  const dragStartHandlerById = useDragStartHandlerById(date, displayEvents)
  const handleDrop = useHandleDrop(date)

  return (
    <DateRowContainer>
      <DateRowHead label={format(date.date, 'MM月dd日')} />
      <DateRowBody rowCount={rowCount}>
        <TimeGuide
          minuteUnit={minuteUnit}
          zIndex={zIndex.timeGuide}
          minuteWidth={minuteWidth} />
        {displayEvents.map(event => (
          <EventCard
            key={event.id}
            dragging={dragState?.event.id === event.id}
            onMouseDown={dragStartHandlerById[event.id]}
            {...createEventCardProps(event, {
              eventHeight,
              minuteWidth,
              zIndex: zIndex.eventCard
            })} />
        ))}
        {dragState && (
          <Box
            position="absolute"
            width="100%"
            height="100%"
            zIndex={zIndex.dropArea}
            onMouseMove={handleDrag}
            onMouseUp={handleDrop} />
        )}
      </DateRowBody>
      <DateRowFoot />
    </DateRowContainer>
  )
}
