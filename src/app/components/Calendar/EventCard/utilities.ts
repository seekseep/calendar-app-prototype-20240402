import { CalendarEvent } from "@/types"
import { EventCardProps } from "./types"

export function createEventCardProps (event: CalendarEvent, {
  eventHeight, minuteWidth, offsetMinutes = 0, zIndex
} : {
  eventHeight: number
  offsetMinutes?: number
  minuteWidth: number
  zIndex: number
}) : EventCardProps {
  const startMinutes = event.start.getHours() * 60 + event.start.getMinutes()
  const endMinutes = event.end.getHours() * 60 + event.end.getMinutes()
  const durationMinutes = endMinutes - startMinutes
  const row = event.row

  const label = event.label
  const top = row * eventHeight
  const left = startMinutes * minuteWidth - offsetMinutes
  const width = durationMinutes * minuteWidth
  const height = eventHeight
  return {
    label,
    top,
    left,
    width,
    height,
    zIndex
  }
}
