import { set } from 'date-fns'

import {
  EventsByRow,
  appendEventToEventsByRow,
  compareWithUpdatedAtAndId,
  createCalendarEvents
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

export function appendEventToEvents(
  currentEvents: CalendarEvent[],
  appendedEvent: CalendarEvent,
) {
  const events = [...currentEvents, appendedEvent]
  const sorted = events.sort(compareWithUpdatedAtAndId)
  let eventsByRow: EventsByRow<CalendarEvent> = {}
  for (const event of sorted) eventsByRow = appendEventToEventsByRow(eventsByRow, event)
  const appendedEvents = createCalendarEvents(eventsByRow)
  return appendedEvents
}
