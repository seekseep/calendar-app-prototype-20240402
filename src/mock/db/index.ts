import { factory } from '@mswjs/data'

import { event } from './dictionary/event'
import { createDefaultEvents } from './utilities'

export const db = factory({
  event
})

const defaultEvents = createDefaultEvents()

for (const event of defaultEvents) {
  db.event.create(event)
}
