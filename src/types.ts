export interface Event {
  id: string
  start: string
  end: string
  label: string
  row: number
  updatedAt: string
  createdAt: string
}

export type UpdateEventInput = (
  Pick<Event, 'id'> & Partial<Omit<Event, 'id'>>
)

export interface CalendarEvent extends Event {
  startDateTime: Date
  endDateTime: Date
  displayRow: number
}

export interface CalendarDate {
  id: string
  date: Date
  events: CalendarEvent[]
}

export interface CalendarPack {
  dates: CalendarDate[]
  createdAt: string
}
