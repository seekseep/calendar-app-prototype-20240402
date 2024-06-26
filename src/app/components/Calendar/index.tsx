import { Event } from '@/types'

import Container from './Container'
import Contents from './Contents'
import Provider from './Provider'
import ThemeProvider from './ThemeProvider'
import Toolbar from './Toolbar'
import { Events } from './types'

export type CalendarProps = Events & {
  events: Event[]
  isFetching?: boolean
}

export default function Calendar (props: CalendarProps) {
  return (
    <ThemeProvider>
      <Provider {...props}>
        <Container>
          <Toolbar isFetching={props.isFetching} />
          <Contents />
        </Container>
      </Provider>
    </ThemeProvider>
  )
}
