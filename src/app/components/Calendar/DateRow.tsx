import { CalendarDate, CalendarEvent, UpdateEventInput } from "@/types";

import { Box, Typography } from "@mui/material";
import { format } from "date-fns";
import { useCalendar, useTheme } from "./hooks";
import TimeGuide from "./TimeGuide";
import EventCard from "./EventCard";
import { useMemo, useState } from "react";
import { createEventCardProps } from "./EventCard/utilities";
import { appendEventToEvents, getRowCount } from "./utilities";

export default function DateRow ({
  date
}: {
  date: CalendarDate
}) {
  const { minuteWidth, rowHeadWidth, eventHeight, zIndex } = useTheme()
  const {
    state: {
      drag: dragState,
      minuteUnit,
    },
    helpers: {
      dragStart,
      drag,
      bulkUpdate
    }
  } = useCalendar()

  const bodyWidth = minuteWidth * 60 * 24

  const {
    displayEvents,
    rowCount,
  } = useMemo(() => {
    const dragging = !!dragState
    if (!dragging) {
      return {
        displayEvents: date.events,
        rowCount: getRowCount(date.events)
      }
    }

    const toBeDrop = dragState?.toDrop?.area === date.id
    const eventToDrop = dragState.event
    const rowToDrop = dragState.toDrop?.row ?? null
    const timeToDrop = dragState.toDrop?.time ?? null
    const notDraggingEvents = date.events.filter(event => event.id !== dragState.event.id)
    if (!toBeDrop || rowToDrop === null || timeToDrop === null) {
      return {
        displayEvents: notDraggingEvents,
        rowCount: getRowCount(notDraggingEvents)
      }
    }

    const dateToDrop = date.date
    const appendedDraggingEvent = appendEventToEvents(
      notDraggingEvents,
      eventToDrop,
      dateToDrop,
      timeToDrop,
      rowToDrop,
    )

    return {
      displayEvents: appendedDraggingEvent,
      rowCount: Math.max(getRowCount(notDraggingEvents) + 1, getRowCount(appendedDraggingEvent))
    }
  }, [date.date, date.events, date.id, dragState])

  const height = eventHeight * rowCount

  return (
    <Box display="flex" sx={{
      borderBottomColor: 'divider',
      borderBottomStyle: 'solid',
      borderBottomWidth: 1
    }}>
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
          {format(date.date, 'MM-dd')}
        </Typography>
      </Box>
      <Box
        width={bodyWidth}
        position="relative"
        height={height}
        flexShrink={0}>
        <TimeGuide
          minuteUnit={minuteUnit}
          zIndex={zIndex.timeGuide}
          minuteWidth={minuteWidth}
          height={height} />
        <Box>
          {displayEvents.map(event => {
            const props = createEventCardProps(event, { eventHeight, minuteWidth, zIndex: zIndex.eventCard })
            return (
              <EventCard
                key={event.id}
                onMouseDown={(e) => dragStart({
                  event,
                  toDrop: {
                    area: date.id,
                    row: event.row,
                    time: format(event.start, 'HH:mm')
                  },
                  ui: {
                    offsetX: e.nativeEvent.offsetX,
                    offsetY: e.nativeEvent.offsetY
                  }
                })}
                {...props} />
            )
          })}
        {dragState && (
          <Box
            position="absolute"
            width="100%"
            height="100%"
            zIndex={zIndex.dropArea}
            sx={{
              opacity: 0.1
            }}
            onMouseMove={(event) => {
              const area = date.id
              const row = Math.floor(event.nativeEvent.offsetY / eventHeight)
              const timeAsMinutes = Math.floor((
                event.nativeEvent.offsetX
                - (dragState.ui?.offsetX ?? 0)
              ) / minuteWidth)
              const roundedTimeAsMinutes = Math.floor(timeAsMinutes / minuteUnit) * minuteUnit
              const hours = Math.floor(roundedTimeAsMinutes / 60)
              const minutes = roundedTimeAsMinutes % 60
              const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
              drag({ area, row, time })
            }}
            onMouseUp={() => {
              const updateInputs: UpdateEventInput[] = []

              const nextEventById: Record<string, CalendarEvent> = {}

              const currentEventById: Record<string, CalendarEvent> = {}
              for (const event of date.events) {
                currentEventById[event.id] = event
              }

              for (const event of displayEvents) {
                const id = event.id
                const current = currentEventById[id]

                const currentStart = current ? current.start.toISOString() : null
                const currentEnd = current ? current.end.toISOString() : null
                const currentRow = current ? current.row : null
                const nextStart = event.start.toISOString()
                const nextEnd = event.end.toISOString()
                const nextRow = event.row

                if (
                  currentStart === nextStart
                  && currentEnd === nextEnd
                  && currentRow === nextRow
                ) continue

                updateInputs.push({
                  id,
                  start: nextStart,
                  end: nextEnd,
                  row: nextRow
                })

                nextEventById[event.id] = event
              }

              bulkUpdate(updateInputs)
            }} />
        )}
        </Box>
      </Box>
    </Box>
  )
}
