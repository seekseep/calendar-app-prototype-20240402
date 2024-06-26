import { ReactNode } from 'react'

import { CardProps } from '@mui/material'

export interface EventCardProps extends CardProps {
  label: ReactNode
  description?: ReactNode
  left: number
  top: number
  width: number
  height: number
  zIndex: number
  dragging?: boolean
}
