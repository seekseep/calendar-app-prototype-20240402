export interface Event {
  id: string
  start: string
  end: string
  label: string
  row: number
}

export type UpdateEventInput = (
  Pick<Event, 'id'> & Partial<Omit<Event, 'id'>>
)

export interface CalendarEvent extends Omit<Event, 'start' | 'end'> {
  start: Date
  end: Date
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
