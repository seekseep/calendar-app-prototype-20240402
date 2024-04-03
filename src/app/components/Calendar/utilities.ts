import { getMinutesFromDate, shiftEventToEvents } from "@/model/calendarPack";
import { CalendarEvent } from "@/types";
import { add, set } from "date-fns";

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

  const durationAsMinutes = getMinutesFromDate(event.end) - getMinutesFromDate(event.start)
  const end = add(start, { minutes: durationAsMinutes })

  const newEvent = {
    ...event,
    start,
    end,
    row
  }

  return shiftEventToEvents(events, newEvent)
}
