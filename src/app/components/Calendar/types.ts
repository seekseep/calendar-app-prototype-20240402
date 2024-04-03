import { CalendarPack as Pack, CalendarEvent, UpdateEventInput } from "@/types"
import { RefObject } from "react"

type DropArea = string

type ToDrop = {
  area: DropArea
  row: number
  time: string
}

export interface DragState {
  event: CalendarEvent
  toDrop: ToDrop | null
  ui: {
    offsetX: number
    offsetY: number
  } | null
}

export interface State {
  minuteUnit: number
  pack: Pack
  drag: DragState | null
}

export type DragStartAction = {
  type: "dragStart"
  payload: DragState
}

export type DragAction = {
  type: "drag"
  payload: ToDrop | null
}

export type DragEndAction = {
  type: "dragEnd"
}

export type SetPackAction = {
  type: "setPack"
  payload: Pack
}

export type SetMinuteUnitAction = {
  type: "setMinuteUnit"
  payload: number
}

export type Action = DragStartAction | DragAction | DragEndAction | SetPackAction | SetMinuteUnitAction

export interface Events {
  onUpdate: (input: UpdateEventInput) => any
  onBulkUpdate: (inputs: UpdateEventInput[]) => any
}

export interface Helpers {
  update: (event: UpdateEventInput) => any
  bulkUpdate: (events: UpdateEventInput[]) => any
  dragStart: (event: DragStartAction['payload']) => any
  drag: (toDrop: DragAction['payload']) => any
  dragEnd: () => any
  setMinuteUnit: (minuteUnit: number) => any
}

export interface Refs {
  inner?: RefObject<HTMLDivElement>
}

export interface ContextValue {
  state: State
  helpers: Helpers
  refs: Refs
}

export interface ThemeContextValue {
  rowHeadWidth: number
  minuteWidth: number
  toolbarHeight: number
  timeRulerHeight: number
  eventHeight: number
  scrollHelperSize: number
  zIndex: {
    timeGuide: number
    eventCard: number
    dropArea: number
    rowHead: number
    timeRuler: number
    toolbar: number
    scrollHelper: number
    debugger: number
  }
}
