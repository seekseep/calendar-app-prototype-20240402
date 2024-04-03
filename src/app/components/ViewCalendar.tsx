'use client'

import Calendar from "./Calendar";
import { useEvents } from "@/hooks/event";
import { createDefaultEvents } from "@/model/event";

const initialEvents = createDefaultEvents()

export default function ViewCalendar () {
  const { events, update, bulkUpdate } = useEvents(initialEvents)
  return (
    <Calendar
      events={events}
      onUpdate={update}
      onBulkUpdate={bulkUpdate} />
  )
}
