import { memo } from 'react'

import { Card, Stack, Typography } from '@mui/material'

import { EventCardProps } from './types'

function EventCard ({
  label,
  left,
  top,
  width,
  height,
  zIndex,
  dragging,
  description,
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
      <Stack direction="row" spacing={0.5} sx={{ width: '100%' }}>
        <Typography
          variant="caption"
          flexGrow={1}
          whiteSpace="nowrap"
          sx={{
            userSelect  : 'none',
            textOverflow: 'ellipsis',
            overflow    : 'hidden',
          }}>
          {label}
        </Typography>
        {description && (
          <Typography
            flexShrink={0}
            variant="caption"
            color="text.secondary">
            {description}
          </Typography>
        )}
      </Stack>
    </Card>
  )
}

export default memo(EventCard)
