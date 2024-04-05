import { add, format, set } from 'date-fns'

import { v4 as uuid } from 'uuid'

import { Event } from '@/types'

type EventEntity = Omit<Event, 'row'> & { row: number | null }

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
    id       : uuid(),
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
  const types = ['小学', '中学', '高校',]
  const baseDate = new Date('2022-04-01')

  const events: EventEntity[] = []

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const date =  format(add(baseDate, { days: i }), 'yyyy-MM-dd')
      for (let k = 0; k < 2; k++) {
        const l = i * 7 + j * 2 + k
        const subject1 = subjects[l % subjects.length]
        const type1 = types[Math.floor(l / subjects.length) % types.length]
        const subject2 = subjects[(l + 1) % subjects.length]
        const type2 = types[Math.floor((l + 1) / subjects.length) % types.length]
        events.push(...[
          createEvent(`${subject1}-${type1}`, date, `${(9 + k)}:00`, 60),
          createEvent(`${subject2}-${type2}`, date, `${(9 + k)}:30`, 60),
        ])
      }
      for (let k = 0; k < 2; k++) {
        const l = i * 7 + j * 2 + k
        const subject1 = subjects[l % subjects.length]
        const type1 = types[Math.floor(l / subjects.length) % types.length]
        const subject2 = subjects[(l + 1) % subjects.length]
        const type2 = types[Math.floor((l + 1) / subjects.length) % types.length]
        events.push(...[
          createEvent(`${subject1}-${type1}`, date, `${(13 + k)}:00`, 80),
          createEvent(`${subject2}-${type2}`, date, `${(13 + k)}:20`, 80),
        ])
      }
      for (let k = 0; k < 2; k++) {
        const l = i * 7 + j * 2 + k
        const subject1 = subjects[l % subjects.length]
        const type1 = types[Math.floor(l / subjects.length) % types.length]
        const subject2 = subjects[(l + 1) % subjects.length]
        const type2 = types[Math.floor((l + 1) / subjects.length) % types.length]
        events.push(...[
          createEvent(`${subject1}-${type1}`, date, `${(16 + k)}:00`, 100),
          createEvent(`${subject2}-${type2}`, date, `${(16 + k)}:50`, 100),
        ])
      }
    }
  }
  return events
}
