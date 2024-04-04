import { Reducer } from 'react'

import { Event } from '@/types'

import { Action, State } from './types'

export function initializer (events: Event[]): State {
  const state: State = {}

  for (const event of events) {
    state[event.id] = event
  }

  return state
}

export const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'update': {
      const current = state[action.payload.id]
      if (!current) return state
      return {
        ...state,
        [current.id]: {
          ...current,
          ...action.payload
        }
      }
    }
    case 'bulkUpdate': {
      const newState = { ...state }
      for (const input of action.payload) {
        const current = state[input.id]
        if (!current) continue
        newState[input.id] = {
          ...current,
          ...input
        }
      }
      return newState
    }
    case 'delete': {
      const newState = { ...state }
      delete newState[action.payload]
      return newState
    }
    default:
      return state
  }
}
