'use client'

import { PropsWithChildren } from "react"
import { ThemeContext, useThemeContextValue } from "./hooks"

export default function ThemeProvider({ children }: PropsWithChildren) {
  const value = useThemeContextValue()
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
