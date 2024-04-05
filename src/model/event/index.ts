import { Event } from '@/types'

function isValidDateString (value: any): value is string {
  if (typeof value !== 'string') return false
  return !isNaN(Date.parse(value))
}

function isValidNumberOrNull (value: any): value is number | null {
  if (value === null) return true
  if (typeof value !== 'number') return false
  return true
}

export function parseEvent (data: any): Event {
  const id = data.id
  const label = data.label
  const start = data.start
  const end = data.end
  const row = data.row
  const updatedAt = data.updatedAt
  const createdAt = data.createdAt
  if(typeof id != 'string') throw new Error('Invalid ID')
  if(typeof label != 'string') throw new Error('Invalid Label')
  if(!isValidDateString(start)) throw new Error('Invalid start')
  if(!isValidDateString(end)) throw new Error('Invalid end')
  if(!isValidNumberOrNull(row)) throw new Error('Invalid row')
  if(!isValidDateString(updatedAt)) throw new Error('Invalid updatedAt')
  if(!isValidDateString(createdAt)) throw new Error('Invalid createdAt')

  return {
    id       : id,
    label    : label,
    start    : start,
    end      : end,
    row      : row ?? 0,
    updatedAt: updatedAt,
    createdAt: createdAt,
  }
}
