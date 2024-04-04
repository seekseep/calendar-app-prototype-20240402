import { add, set } from 'date-fns'

import { shiftEventToEvents } from '@/model/calendarPack'
import { CalendarEvent } from '@/types'

export function getRowCount <T extends { row: number }> (events: T[]) {
  return events.reduce((max, event) => Math.max(max, event.row), 0) + 1
}

export function appendEventToEvents (
  events: CalendarEvent[],
  event: CalendarEvent,
  date: Date,
  time: string,
  row: number
) {
  const [startHours, startMinutes] = time.split(':').map(Number)
  const start = set(date, { hours: startHours, minutes: startMinutes })

  const duration = event.end.getTime() - event.start.getTime()
  const durationAsMinutes = duration / (1000 * 60)
  const end = add(start, { minutes: durationAsMinutes })

  const newEvent = {
    ...event,
    start,
    end,
    row
  }

  return shiftEventToEvents(events, newEvent)
}
