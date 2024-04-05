import { CalendarEvent } from '@/types'

import { EventCardProps } from './types'

export function createEventCardProps (event: CalendarEvent, {
  eventHeight, minuteWidth, offsetMinutes = 0, zIndex
} : {
  eventHeight: number
  offsetMinutes?: number
  minuteWidth: number
  zIndex: number
}) : EventCardProps {
  const {
    startDateTime: start,
    endDateTime: end
  } = event
  const startMinutes = start.getHours() * 60 + start.getMinutes()
  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60)

  const row = event.displayRow
  const label = `${event.label} (${event.row})`
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
