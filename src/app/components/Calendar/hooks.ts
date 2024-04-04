'use client'

import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'

import { createCalendarPack } from '@/model/calendarPack'
import { Event } from '@/types'

import { defaultContextValue, defaultHelpers, defaultThemeContextValue } from './constants'
import { initializer, reducer } from './reducer'
import { ContextValue, Events, Helpers, ThemeContextValue } from './types'

export const Context = createContext<ContextValue>(defaultContextValue)
export const ThemeContext = createContext<ThemeContextValue>(defaultThemeContextValue)

export function useContextValue ({
  events,
  onUpdate,
  onBulkUpdate
}: Events & { events: Event[] }): ContextValue {
  const innerRef = useRef<HTMLDivElement>(null)
  const [state, dispatch]  = useReducer(reducer, events, initializer)

  const helpers = useMemo((): Helpers => {
    const helpers: Helpers = { ...defaultHelpers }

    helpers.update = onUpdate
    helpers.bulkUpdate = onBulkUpdate

    helpers.dragStart = (payload) => {
      dispatch({ type: 'dragStart', payload })
      window.addEventListener('mouseup', () => {
        dispatch({ type: 'dragEnd' })
      }, { once: true })
    }

    helpers.drag = (payload) => {
      dispatch({ type: 'drag', payload })
    }

    helpers.setMinuteUnit = (payload) => {
      dispatch({ type: 'setMinuteUnit', payload })
    }

    return helpers
  }, [onUpdate, onBulkUpdate])

  useEffect(() => {
    const pack = createCalendarPack(events)
    dispatch({ type: 'setPack', payload: pack })
  }, [events])

  return {
    state,
    helpers,
    refs: {
      inner: innerRef
    }
  }
}

export function useThemeContextValue (): ThemeContextValue {
  return useMemo(() => {
    const theme: ThemeContextValue = {
      ...defaultThemeContextValue
    }
    return theme
  }, [])
}

export function useCalendar() {
  return useContext(Context)
}

export function useTheme() {
  return useContext(ThemeContext)
}
