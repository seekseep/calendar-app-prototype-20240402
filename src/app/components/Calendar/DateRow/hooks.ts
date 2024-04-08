import { format } from 'date-fns'
import { useCallback, MouseEvent, useMemo } from 'react'

import { CalendarDate, CalendarEvent } from '@/types'

import { useCalendar, useTheme } from '../hooks'

import { appendEventToEvents, createDroppedEvent, getRowCount } from './utilities'

export function useDisplayCalendarDate (date: CalendarDate) {
  const {
    state: {
      drag: dragState,
    }
  } = useCalendar()

  return useMemo(() => {
    const dragging = !!dragState
    if (!dragging) {
      return {
        displayEvents: date.events,
        rowCount     : getRowCount(date.events)
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

export function useHandleDrop (date: CalendarDate) {
  const {
    state: {
      drag: dragState,
    },
    helpers: {
      update,
    }
  } = useCalendar()

  return useCallback(() => {
    if (!dragState) return
    const dateToDrop = date.date
    const eventToDrop = dragState.event
    const rowToDrop = dragState.toDrop?.row ?? null
    const timeToDrop = dragState.toDrop?.time ?? null
    if (rowToDrop === null || timeToDrop === null) return
    const { id, start, end, row } = createDroppedEvent(eventToDrop, dateToDrop, timeToDrop, rowToDrop)
    update({ id, start, end, row })
  }, [date.date, dragState, update])
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
        dragStart({
          event,
          toDrop: {
            area: date.id,
            row : event.displayRow,
            time: format(event.start, 'HH:mm')
          },
          ui: {
            offsetX: e.nativeEvent.offsetX,
            offsetY: e.nativeEvent.offsetY
          }
        })
      }
    }
    return dragStartHandlerById
  }, [date.id, displayEvents, dragStart])
}
