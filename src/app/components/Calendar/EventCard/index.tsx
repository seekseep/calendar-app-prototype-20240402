import { memo } from 'react'

import { Card, Typography } from '@mui/material'

import { EventCardProps } from './types'

function EventCard ({
  label,
  left,
  top,
  width,
  height,
  zIndex,
  dragging,
  ...props
}: EventCardProps) {
  return (
    <Card
      elevation={dragging ? 1 : 0}
      draggable
      sx={{
        border     : 1,
        borderColor: 'divider',
        position   : 'absolute',
        left, top, width, height,
        px         : 1,
        display    : 'flex',
        alignItems : 'center',
        zIndex     : zIndex + (dragging ? 1 : 0),
      }}
      {...props}>
      <Typography
        variant="body2"
        whiteSpace="nowrap"
        sx={{
          userSelect  : 'none',
          textOverflow: 'ellipsis',
          overflow    : 'hidden',
        }}>
        {label}
      </Typography>
    </Card>
  )
}

export default memo(EventCard)
