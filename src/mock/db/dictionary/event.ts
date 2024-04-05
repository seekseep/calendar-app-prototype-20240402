import { primaryKey, nullable } from '@mswjs/data'

export const event = {
  id       : primaryKey(String),
  label    : String,
  start    : String,
  end      : String,
  row      : nullable(Number),
  updatedAt: () => new Date().toISOString(),
  createdAt: () => new Date().toISOString(),
}
