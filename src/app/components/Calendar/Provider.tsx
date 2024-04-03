'use client'

import { PropsWithChildren } from "react";

import { Event } from "@/types";

import { Context, useContextValue } from './hooks';
import { Events } from "./types";

export default function Provider ({ children, ...props }: PropsWithChildren & Events & { events: Event[] }) {
  const value = useContextValue(props)
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}
