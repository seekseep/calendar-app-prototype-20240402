import { format } from 'date-fns'

import { v4 as uuid } from 'uuid'

import { CalendarDate, CalendarEvent, Event } from '@/types'

type EventsByRow <T> = Record<number, T[]>

export function getMinutesFromDate (date: Date): number {
  return date.getHours() * 60 + date.getMinutes()
}

export function createCalendarEvents (eventsByRow: EventsByRow<Event>) {
  const events: CalendarEvent[] = []
  for (const rowKey in eventsByRow) {
    const row = Number(rowKey)
    const rowEvents = eventsByRow[rowKey]
    for (const event of rowEvents) {
      events.push({
        ...event,
        start: new Date(event.start),
        end  : new Date(event.end),
        row  : row
      })
    }
  }
  return events
}

function isOverlapping <T extends { start: Date, end: Date } | { start: string, end: string }> (event1: T, event2: T): boolean {
  const event1Start = getMinutesFromDate(typeof event1.start === 'string' ? new Date(event1.start) : event1.start)
  const event1End = getMinutesFromDate(typeof event1.end === 'string' ? new Date(event1.end) : event1.end)
  const event2Start = getMinutesFromDate(typeof event2.start === 'string' ? new Date(event2.start) : event2.start)
  const event2End = getMinutesFromDate(typeof event2.end === 'string' ? new Date(event2.end) : event2.end)
  if (event1Start >= event2End || event1End <= event2Start) return false
  return true
}

export function appendEventToEventsByRow (eventsByRow: EventsByRow<Event>, toBeAppended: Event) {
  let row = toBeAppended.row
  while (true) {
    const events = eventsByRow[row] || []
    const conflict = events.some(existed => isOverlapping(existed, toBeAppended))
    if (!conflict) {
      events.push(toBeAppended)
      eventsByRow[row] = events
      break
    }
    row++
  }
  return eventsByRow
}

function shiftEventToEventsByRow (eventsByRow: EventsByRow<CalendarEvent>, toBeShiftEvent: CalendarEvent) {
  const conflictEvents: CalendarEvent[] = []
  let toInsertRowEvents = [...(eventsByRow[toBeShiftEvent.row] ?? [])]

  const conflictedById: Record<string, CalendarEvent> = {}
  for (const event of toInsertRowEvents) {
    if (!isOverlapping(event, toBeShiftEvent)) continue
    conflictedById[event.id] = event
    conflictEvents.push(event)
  }
  toInsertRowEvents = toInsertRowEvents.filter(event => !conflictedById[event.id])
  toInsertRowEvents.push(toBeShiftEvent)
  eventsByRow[toBeShiftEvent.row] = toInsertRowEvents

  const sortedConflictEvents = conflictEvents.sort((a, b) => a.row - b.row)
  for (const conflictEvent of sortedConflictEvents) {
    eventsByRow = shiftEventToEventsByRow(eventsByRow, {
      ...conflictEvent,
      row: toBeShiftEvent.row + 1
    })
  }

  return eventsByRow
}

function createEventsByRow <T extends { row: number }> (events: T[]): EventsByRow<T> {
  const eventsByRow: EventsByRow<T> = {}
  for (const event of events) {
    const events = eventsByRow[event.row] || []
    events.push(event)
    eventsByRow[event.row] = events
  }
  return eventsByRow
}

function createEventsFromEventsByRow (eventsByRow: EventsByRow<CalendarEvent>): CalendarEvent[] {
  const events: CalendarEvent[] = []
  for (const rowKey in eventsByRow) {
    const row = Number(rowKey)
    const rowEvents = eventsByRow[rowKey]
    for (const event of rowEvents) {
      events.push({
        ...event,
        row: row
      })
    }
  }
  return events
}

export function shiftEventToEvents (events: CalendarEvent[], toBeShiftEvent: CalendarEvent): CalendarEvent[] {
  const eventsByRow = createEventsByRow(events)
  const shiftedEventsByRow = shiftEventToEventsByRow(eventsByRow, toBeShiftEvent)
  return createEventsFromEventsByRow(shiftedEventsByRow)
}

export function createCalendarPack (events: Event[]) {
  const dates: CalendarDate[] = []

  const sortedEvents = events.sort((a, b) => {
    if (a.start !== b.start) return a.start.localeCompare(b.start)
    if (a.start === b.start) return a.end.localeCompare(b.end)
    return a.id.localeCompare(b.id)
  })

  const dateByEvents = sortedEvents.reduce((acc, event) => {
    const key = format(event.start, 'yyyy-MM-dd')
    const dateEvents = acc[key] || []
    dateEvents.push(event)
    acc[key] = dateEvents
    return acc
  }, {} as Record<string, Event[]>)

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
