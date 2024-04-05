'use client'

import { Alert } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'

import { db } from '@/mock/db'
import { parseEvent } from '@/model/event'
import { Event, UpdateEventInput } from '@/types'

import Calendar from './Calendar'

export default function ViewCalendar () {

  const query = useQuery({
    queryKey: ['events'],
    async queryFn () {
      const rawEvents = db.event.getAll()
      const events: Event[] = []
      for (const rawEvent of rawEvents) {
        const event = parseEvent(rawEvent)
        events.push(event)
      }
      return events
    }
  })

  const updateMutation = useMutation({
    async mutationFn ({ id, ...data }: UpdateEventInput) {
      data.updatedAt = new Date().toISOString()
      db.event.update({
        where: {
          id: { equals: id }
        },
        data
      })
    },
    onSuccess () { query.refetch() }
  })

  const bulkUpdateMutation = useMutation({
    async mutationFn (events: UpdateEventInput[]) {
      for (const { id, ...data } of events) {
        data.updatedAt = new Date().toISOString()
        db.event.update({
          where: {
            id: { equals: id }
          },
          data
        })
      }
    },
    onSuccess () { query.refetch() }
  })

  return (
    <>
      {query.isError && (
        <Alert severity="error">{query.error.message}</Alert>
      )}
      {query.isLoading && (
        <Alert severity="info">Loading events...</Alert>
      )}
      {query.isSuccess && (
        <Calendar
          events={query.data}
          isFetching={query.isFetching}
          onUpdate={input => updateMutation.mutate(input)}
          onBulkUpdate={inputs => bulkUpdateMutation.mutate(inputs)} />
      )}
    </>
  )
}
