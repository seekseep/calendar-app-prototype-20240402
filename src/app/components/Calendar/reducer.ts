import { Reducer } from 'react'

import { createCalendarPack } from '@/model/calendarPack'
import { Event } from '@/types'

import { Action, State } from './types'

export function initializer (events: Event[]): State {
  return {
    minuteUnit: 15,
    pack      : createCalendarPack(events),
    drag      : null,
  }
}

export const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'dragStart':
      return {
        ...state,
        drag: action.payload
      }
    case 'drag': {
      const drag = state.drag
      if (!drag) return state
      return {
        ...state,
        drag: {
          ...drag,
          toDrop: action.payload
        }
      }
    }
    case 'dragEnd':
      return {
        ...state,
        drag: null
      }
    case 'setPack':
      return {
        ...state,
        pack: action.payload
      }
    case 'setMinuteUnit':
      return {
        ...state,
        minuteUnit: action.payload
      }
    default:
      return state
  }
}
