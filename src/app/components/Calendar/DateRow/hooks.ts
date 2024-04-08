import { format } from 'date-fns'
import { useCallback, MouseEvent, useMemo } from 'react'

import { CalendarDate, CalendarEvent, UpdateEventInput } from '@/types'

import { useCalendar, useTheme } from '../hooks'

import { appendEventToEvents, createDroppedEvent, getRowCount, removeEventFromEvents } from './utilities'

export function useDisplayCalendarDate (date: CalendarDate) {
  const {
    state: {
      drag: dragState,
    }
  } = useCalendar()

  return useMemo(() => {
    const dragging = !!dragState
    const rowToDrop = dragState?.toDrop?.row ?? null
    const timeToDrop = dragState?.toDrop?.time ?? null
    if (!dragging || rowToDrop === null || timeToDrop === null) {
      return {
        displayEvents: date.events,
        rowCount     : getRowCount(date.events)
      }
    }

    const toBeDrop = dragState?.toDrop?.area === date.id
    const eventToDrop = dragState.event

    const notDraggingEvents = removeEventFromEvents(date.events, eventToDrop)
    if (!toBeDrop) {
      return {
        displayEvents: notDraggingEvents,
        rowCount     : getRowCount(notDraggingEvents)
      }
    }

    const dateToDrop = date.date
    const appendedEvent = createDroppedEvent(eventToDrop, dateToDrop, timeToDrop, rowToDrop)
    const appendedDraggingEvents = appendEventToEvents(notDraggingEvents, appendedEvent)

    return {
      displayEvents: appendedDraggingEvents,
      rowCount     : Math.max(getRowCount(notDraggingEvents) + 1, getRowCount(appendedDraggingEvents))
    }
  }, [date.date, date.events, date.id, dragState])
}

export function useHandleDrag (date: CalendarDate) {
  const {
    minuteWidth,
    eventHeight,
  } = useTheme()
  const {
    state: {
      drag: dragState,
      minuteUnit,
    },
    helpers: {
      drag,
    }
  } = useCalendar()

  return useCallback((e: MouseEvent) => {
    if (!dragState) return

    const duration = dragState.event.endDateTime.getTime() - dragState.event.startDateTime.getTime()
    const durationAsMuinutes = duration / (1000 * 60)
    const maxMinutes = 24 * 60 - durationAsMuinutes

    const area = date.id
    const row = Math.floor(e.nativeEvent.offsetY / eventHeight)
    const timeAsMinutes = Math.min(maxMinutes, Math.floor((
      e.nativeEvent.offsetX
      - (dragState.ui?.offsetX ?? 0)
    ) / minuteWidth))
    const roundedTimeAsMinutes = Math.floor(timeAsMinutes / minuteUnit) * minuteUnit

    const hours = Math.floor(roundedTimeAsMinutes / 60)
    const minutes = roundedTimeAsMinutes % 60
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    drag({ area, row, time })
  }, [date.id, drag, dragState, eventHeight, minuteUnit, minuteWidth])
}

export function useHandleDrop (date: CalendarDate, displayEvents: CalendarEvent[]) {
  const {
    state: {
      drag: dragState,
    },
    helpers: {
      bulkUpdate
    }
  } = useCalendar()

  return useCallback(() => {
    if (!dragState) return
    const rowToDrop = dragState.toDrop?.row ?? null
    const timeToDrop = dragState.toDrop?.time ?? null
    if (rowToDrop === null || timeToDrop === null) return

    const inputs: UpdateEventInput[] = []

    const currentEventById: Record<string, CalendarEvent> = {}
    for (const currentEvent of date.events) currentEventById[currentEvent.id] = currentEvent

    for (const nextEvent of displayEvents) {
      const id = nextEvent.id

      const currentEvent = currentEventById[id]
      const currentStart = currentEvent?.start
      const currentEnd = currentEvent?.end
      const currentRow = currentEvent?.displayRow

      const {
        start: nextStart,
        end: nextEnd,
        displayRow: nextRow
      } = nextEvent
      if (
        currentStart === nextStart
        && currentEnd === nextEnd
        && currentRow === nextRow
      ) continue

      inputs.push({
        id,
        start: nextStart,
        end  : nextEnd,
        row  : nextRow
      })
    }

    bulkUpdate(inputs)
  }, [bulkUpdate, date.events, displayEvents, dragState])
}

export function useDragStartHandlerById (
  date: CalendarDate,
  displayEvents: CalendarEvent[]
) {
  const {
    helpers: {
      dragStart,
    }
  } = useCalendar()

  return useMemo(() => {
    const dragStartHandlerById: Record<string, (event: MouseEvent) => any> = {}
    for (const event of displayEvents) {
      dragStartHandlerById[event.id] = function (e: MouseEvent) {
        const card = e.currentTarget
        const rect = card.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        const offsetY = e.clientY - rect.top

        dragStart({
          event,
          toDrop: {
            area: date.id,
            row : event.displayRow,
            time: format(event.start, 'HH:mm')
          },
          ui: {
            offsetX,
            offsetY,
          }
        })
      }
    }
    return dragStartHandlerById
  }, [date.id, displayEvents, dragStart])
}
