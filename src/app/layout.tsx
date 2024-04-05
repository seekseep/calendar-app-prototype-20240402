import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import { ReactNode } from 'react'

import { CssBaseline } from '@mui/material'

import DashboardLayout from './components/DashboardLayout'
import Provider from './components/Provider'

const notoSansJp = Noto_Sans_JP({ subsets: ['latin'] })

export const metadata: Metadata = {
  title      : 'カレンダープロトタイプ@20240402',
  description: 'カレンダーのプロトタイプ',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={notoSansJp.className}>
        <CssBaseline />
        <Provider>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </Provider>
      </body>
    </html>
  )
}
