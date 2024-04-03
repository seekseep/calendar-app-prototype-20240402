import { memo } from 'react';
import { EventCardProps } from './types';
import { Card, Typography } from '@mui/material';

function EventCard ({
  label,
  left,
  top,
  width,
  height,
  zIndex,
  ...props
}: EventCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        position: 'absolute',
        left, top, width, height,
        px: 1,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        zIndex
      }}
      {...props}>
      <Typography
        variant='body2'
        whiteSpace="nowrap"
        sx={{
          userSelect: 'none',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}>
        {label}
      </Typography>
    </Card>
  )
}

export default memo(EventCard);
