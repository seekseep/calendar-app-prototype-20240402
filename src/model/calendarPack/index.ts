import { format } from 'date-fns'

import { v4 as uuid } from 'uuid'

import { CalendarDate, CalendarEvent, Event } from '@/types'

export type EventsByRow <T> = Record<number, T[]>

function getMinutesFromDate (date: Date): number {
  return date.getHours() * 60 + date.getMinutes()
}

export function compareWithUpdatedAtAndId <T extends { updatedAt: string, id: string }> (a: T, b: T) {
  if (a.updatedAt !== b.updatedAt) return a.updatedAt > b.updatedAt ? -1 : 1
  return a.id.localeCompare(b.id)
}

function createIndexByStartDate <T extends { start: string }> (array: T[]): Record<string, T[]> {
  const index: Record<string, T[]> = {}
  for (const item of array) {
    const key = format(item.start, 'yyyy-MM-dd')
    const date = index[key] || []
    date.push(item)
    index[key] = date
  }
  return index
}

export function isOverlapping <
  T1 extends { start: string, end: string },
  T2 extends { start: string, end: string }
> (event1: T1, event2: T2): boolean {
  const event1Start = getMinutesFromDate(new Date(event1.start))
  const event1End = getMinutesFromDate(new Date(event1.end))
  const event2Start = getMinutesFromDate(new Date(event2.start))
  const event2End = getMinutesFromDate(new Date(event2.end))
  if (event1Start >= event2End || event1End <= event2Start) return false
  return true
}

export function appendEventToEventsByRow <
  T extends {
    row: number
    start: string, end: string
  }
> (
  eventsByRow: EventsByRow<T>, toBeAppended: T
) {
  const next = { ...eventsByRow }
  let row = toBeAppended.row
  while (true) {
    const events = eventsByRow[row] || []
    const conflict = events.some(existed => isOverlapping(existed, toBeAppended))
    if (!conflict) {
      events.push(toBeAppended)
      next[row] = events
      break
    }
    row++
  }
  return next
}

export function createCalendarEvents <T extends Event> (eventsByRow: EventsByRow<T>) {
  const events: CalendarEvent[] = []
  const calendarEventsByRow: Record<number, CalendarEvent[]> = {}

  const getNewGroupKey = (() => {
    let count = 0
    return function getNewGroupKey () {
      return `g${++count}`
    }
  })()

  const eventsByGroupKey: Record<string, CalendarEvent[]> = {}

  for (const rowKey in eventsByRow) {
    const displayRow = Number(rowKey)

    const aboveRowEvents = calendarEventsByRow[displayRow - 1] || []
    const displayRowEvents = eventsByRow[displayRow]
    const calendarEvents:CalendarEvent[] = []

    for (const event of displayRowEvents) {
      let baseRow = displayRow
      let groupKey = getNewGroupKey()

      const adjacentEventById: Record<string, CalendarEvent> = {}
      for (const aboveEvent of aboveRowEvents) {
        const conflict = isOverlapping(event, aboveEvent)
        if (!conflict) continue
        adjacentEventById[aboveEvent.id] = aboveEvent
        for (const groupEvent of eventsByGroupKey[aboveEvent.groupKey]) {
          adjacentEventById[groupEvent.id] = groupEvent
        }

        baseRow = aboveEvent.baseRow
        groupKey = aboveEvent.groupKey
      }
      const adjacentEvents = Object.values(adjacentEventById)
      for (const adjacentEvent of adjacentEvents) {
        if (adjacentEvent.groupKey === groupKey) continue
        delete eventsByGroupKey[adjacentEvent.groupKey]
        adjacentEvent.groupKey = groupKey
      }

      const calendarEvent: CalendarEvent = {
        ...event,
        startDateTime: new Date(event.start),
        endDateTime  : new Date(event.end),
        displayRow,
        baseRow,
        groupKey
      }

      eventsByGroupKey[groupKey] = eventsByGroupKey[groupKey] ?? []
      eventsByGroupKey[groupKey].push(calendarEvent)
      calendarEvents.push(calendarEvent)
    }
    calendarEventsByRow[displayRow] = calendarEvents
    events.push(...calendarEvents)
  }
  return events
}

export function createCalendarPack (events: Event[]) {
  const dates: CalendarDate[] = []

  const sortedEvents = events.sort(compareWithUpdatedAtAndId)
  const dateByEvents = createIndexByStartDate(sortedEvents)
  const sortedKeys = Object.keys(dateByEvents).sort()

  for (const key of sortedKeys) {
    const dateRawEvents = dateByEvents[key] ?? []

    let eventsByRow: EventsByRow<Event> = {}
    for (const rawEvent of dateRawEvents) eventsByRow = appendEventToEventsByRow(eventsByRow, rawEvent)
    const calendareEvents = createCalendarEvents(eventsByRow)

    dates.push({
      id    : uuid(),
      date  : new Date(key),
      events: calendareEvents
    })
  }

  return { dates, createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:SS') }
}
