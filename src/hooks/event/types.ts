import { Event, UpdateEventInput } from '@/types'

export type State = Record<string, Event>

export type UpdateAction = {
  type: 'update'
  payload: UpdateEventInput
}

export type BulkUpdate = {
  type: 'bulkUpdate'
  payload: UpdateEventInput[]
}

export type DeleteAction = {
  type: 'delete'
  payload: string
}



export type Action = UpdateAction | BulkUpdate | DeleteAction
