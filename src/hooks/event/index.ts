import { Event, UpdateEventInput } from '@/types'
import { useMemo, useReducer } from 'react'
import { initializer, reducer } from './reducer'

export function useEvents (events: Event[]) {
  const [state, dispatch] = useReducer(reducer, events, initializer)
  const _events = useMemo(() => Object.values(state), [state])
  return {
    events: _events,
    update: (event: UpdateEventInput) => dispatch({ type: 'update', payload: event }),
    bulkUpdate: (events: UpdateEventInput[]) => dispatch({ type: 'bulkUpdate', payload: events }),
    remove: (id: string) => dispatch({ type: 'delete', payload: id })
  }
}
