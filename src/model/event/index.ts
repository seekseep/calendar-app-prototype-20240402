import { add, format, set } from 'date-fns'

import { v4 as uuid } from 'uuid'

import { Event } from '@/types'

export function createEvent (label: string, date: string, startTime: string, durationAsMinutes: number, row?: number): Event {
  const baseDate = new Date(date)
  if (isNaN(baseDate.getTime())) throw new Error('Invalid date')

  const [startHours, startMinutes] = startTime.split(':').map(Number)
  const start = set(baseDate, { hours: startHours, minutes: startMinutes })
  if (isNaN(start.getTime())) throw new Error('Invalid start time')

  const end = add(start, { minutes: durationAsMinutes })

  return {
    id   : uuid(),
    label,
    start: start.toISOString(),
    end  : end.toISOString(),
    row  : row ?? 0
  }
}

export function createDefaultEvents () {
  const subjects = [
    '国語', '数学', '英語', '日本史'
  ]
  const words = [
    '中学', '高校', '小学'
  ]

  const baseDate = new Date('2022-04-01')
  const events: Event[] = [
    createEvent(`${subjects[0]}-${words[0]}`, format(baseDate, 'yyyy-MM-dd'), '23:00', 60)
  ]

  // for (let i = 0; i < 7; i++) {
  //   for (let s = 0; s < 6; s++) {
  //     const date =  format(add(baseDate, { days: i }), 'yyyy-MM-dd')
  //     for (let j = 0; j < 2; j++) {
  //       events.push(...[
  //         createEvent(`${subjects[0]}-${words[0]}`, date, `${(9 + s + j)}:00`, 60),
  //         createEvent(`${subjects[3]}-${words[1]}`, date, `${(9 + s + j)}:00`, 60),
  //       ])
  //     }
  //     for (let j = 0; j < 2; j++) {
  //       events.push(...[
  //         createEvent(`${subjects[1]}-${words[2]}`, date, `${(9 + s + j)}:20`, 80),
  //       ])
  //     }
  //     for (let j = 0; j < 2; j++) {
  //       events.push(...[
  //         createEvent(`${subjects[2]}-${words[1]}`, date, `${(9 + s + j)}:30`, 90),
  //       ])
  //     }
  //   }
  // }
  return events
}
