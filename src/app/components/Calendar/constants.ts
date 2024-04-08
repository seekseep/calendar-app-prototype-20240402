import { ContextValue, Helpers, State, ThemeContextValue } from './types'

export const defaultState: State = {
  minuteUnit: 15,
  pack      : {
    dates    : [],
    createdAt: ''
  },
  drag: null
}

export const defaultHelpers: Helpers = {
  update       : () => {},
  bulkUpdate   : () => {},
  dragStart    : () => {},
  drag         : () => {},
  dragEnd      : () => {},
  setMinuteUnit: () => {}
}

export const defaultContextValue: ContextValue = {
  helpers: defaultHelpers,
  state  : defaultState,
}

export const defaultThemeContextValue: ThemeContextValue = {
  minuteWidth     : 2,
  toolbarHeight   : 48,
  eventHeight     : 32,
  timeRulerHeight : 24,
  rowHeadWidth    : 72,
  rowFootWidth    : 72,
  scrollHelperSize: 72,
  zIndex          : {
    timeGuide   : 100,
    eventCard   : 200,
    dropArea    : 300,
    rowHead     : 400,
    timeRuler   : 500,
    toolbar     : 600,
    scrollHelper: 700,
    debugger    : 700
  }
}
