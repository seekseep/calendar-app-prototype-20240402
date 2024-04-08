import { add, format, set } from 'date-fns'

import { Event } from '@/types'

type EventEntity = Omit<Event, 'row'> & { row: number | null }

const getNewEventId = (() => {
  let count = 0
  return function getNewEventId () {
    return `e${++count}`
  }
})()

export function createEvent (
  label: string,
  date: string,
  time: string,
  durationAsMinutes: number,
  row?: number
): EventEntity {
  const now = new Date()
  const baseDate = new Date(date)
  if (isNaN(baseDate.getTime())) throw new Error('Invalid date')

  const [hours, minutes] = time.split(':').map(Number)
  const start  = set(baseDate, { hours, minutes })
  if (isNaN(start.getTime())) throw new Error('Invalid start time')
  const end = add(start, { minutes: durationAsMinutes })

  return {
    id       : getNewEventId(),
    label,
    start    : start.toISOString(),
    end      : end.toISOString(),
    row      : row ?? null,
    updatedAt: now.toISOString(),
    createdAt: now.toISOString(),
  }
}

export function createDefaultEvents (): EventEntity[] {
  const subjects = ['国語', '数学', '英語', '日本史', '世界史', '物理', '化学', '生物', '地学', '倫理', '政治', '経済']
  const baseDate = new Date('2022-04-01')

  const getSubject = (() => {
    let index = 0
    return () => {
      const subject = subjects[index]
      index = (index + 1) % subjects.length
      return subject
    }
  })()

  const events: EventEntity[] = []
  const dateCount = 5
  for (let i = 0; i < dateCount; i++) {
    const date =  format(add(baseDate, { days: i }), 'yyyy-MM-dd')
    events.push(...[
      createEvent(getSubject(), date, '00:00', 90, 0),
      createEvent(getSubject(), date, '00:00', 90, 1),

      createEvent(getSubject(), date, '01:45', 90, 1),
      createEvent(getSubject(), date, '01:45', 90, 2),

      createEvent(getSubject(), date, '03:30', 90, 0),
      createEvent(getSubject(), date, '03:30', 90, 1),

      createEvent(getSubject(), date, '03:30', 90, 3),
      createEvent(getSubject(), date, '03:30', 90, 4),

      createEvent(getSubject(), date, '5:30', 90, 0),
      createEvent(getSubject(), date, '6:00', 90, 1),
      createEvent(getSubject(), date, '5:30', 90, 2),
      createEvent(getSubject(), date, '6:00', 90, 3),

      createEvent(getSubject(), date, '8:00', 60, 0),
      createEvent(getSubject(), date, '8:00', 60, 0),
      createEvent(getSubject(), date, '8:00', 120, 0),
      createEvent(getSubject(), date, '9:00', 60, 1),

      createEvent(getSubject(), date, '12:00', 60, 0),
      createEvent(getSubject(), date, '12:00', 60, 0),
      createEvent(getSubject(), date, '11:00', 60, 1),
      createEvent(getSubject(), date, '11:00', 120, 0),

      createEvent(getSubject(), date, '14:00', 60, 1),
      createEvent(getSubject(), date, '14:30', 60, 2),
      createEvent(getSubject(), date, '15:00', 60, 3),
      createEvent(getSubject(), date, '16:00', 60, 1),
      createEvent(getSubject(), date, '15:30', 60, 2),
    ])
  }

  return events
}
