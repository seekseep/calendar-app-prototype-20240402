import { set } from 'date-fns'

import {
  EventsByRow,
  appendEventToEventsByRow,
  compareWithUpdatedAtAndId,
  createCalendarEvents,
  isOverlapping
} from '@/model/calendarPack'
import { CalendarEvent } from '@/types'

export function getRowCount (events: CalendarEvent[]) {
  const maxRow = events.reduce((max, event) => Math.max(max, event.displayRow), 0)
  return maxRow + 1
}

export function createDroppedEvent (baseEvent: CalendarEvent, date: Date, time: string, row: number) {
  const now = new Date()
  const [startHours, startMinutes] = time.split(':').map(Number)
  const start = set(new Date(date), { hours: startHours, minutes: startMinutes })
  if (Number.isNaN(start.getTime())) throw new Error('Invalid time')
  const newEventDuratrion = baseEvent.endDateTime.getTime() - baseEvent.startDateTime.getTime()
  const end = new Date(start.getTime() + newEventDuratrion)

  const newEvent: CalendarEvent = {
    ...baseEvent,
    startDateTime: start,
    start        : start.toISOString(),
    endDateTime  : end,
    end          : end.toISOString(),
    updatedAt    : now.toISOString(),
    row,
  }

  return newEvent
}

export function removeEventFromEvents (
  currentEvents: CalendarEvent[],
  removeEvent:  CalendarEvent,
) {
  const groupKey = removeEvent.groupKey
  const groupEvents: CalendarEvent[] = []
  const nextEvents: CalendarEvent[] = []
  const nextEventsByDisplayRow: EventsByRow<CalendarEvent> = {}
  for (const event of currentEvents) {
    if (event.id === removeEvent.id) continue
    if (event.groupKey === groupKey) {
      groupEvents.push(event)
      continue
    }

    nextEventsByDisplayRow[event.displayRow] = nextEventsByDisplayRow[event.displayRow] || []

    nextEvents.push(event)
    nextEventsByDisplayRow[event.displayRow].push(event)
  }

  const sortedGroupEvents = groupEvents.sort((a, b) => {
    if (a.displayRow != b.displayRow) return a.displayRow - b.displayRow
    return compareWithUpdatedAtAndId(a, b)
  })

  for (const event of sortedGroupEvents) {
    if (event.displayRow === event.baseRow) {
      nextEvents.push(event)
      nextEventsByDisplayRow[event.displayRow] = nextEventsByDisplayRow[event.displayRow] || []
      nextEventsByDisplayRow[event.displayRow].push(event)
      continue
    }

    let displayRow = event.baseRow
    while (true) {
      const events = nextEventsByDisplayRow[displayRow] || []

      const conflict = events.some(existed => isOverlapping(event, existed))

      if (!conflict) {
        nextEvents.push({
          ...event,
          row: displayRow,
          displayRow,
        })
        nextEventsByDisplayRow[displayRow] = nextEventsByDisplayRow[displayRow] || []
        nextEventsByDisplayRow[displayRow].push(event)
        break
      }

      displayRow++
    }
  }

  return nextEvents
}

export function appendEventToEvents(
  currentEvents: CalendarEvent[],
  appendedEvent: CalendarEvent,
) {
  const sortedCurrentEvents = currentEvents.sort((a, b) => {
    if (a.displayRow != b.displayRow) return a.displayRow - b.displayRow
    return compareWithUpdatedAtAndId(a, b)
  })
  const sorted = [appendedEvent, ...sortedCurrentEvents]
  let eventsByRow: EventsByRow<CalendarEvent> = {}
  for (const event of sorted) eventsByRow = appendEventToEventsByRow(eventsByRow, event)
  const nextEvents = createCalendarEvents(eventsByRow)
  return nextEvents
}
