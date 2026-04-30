import { TrackProvider } from '@/ui/contexts/track/TrackProvider'
import { ChatProvider } from '@/ui/contexts/chat/ChatProvider'
import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Track Observer',
  description: 'A tool to check the currently playing track on Spotify',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} h-full antialiased`}>
      <body className="text-foreground min-h-full font-sans">
        <TrackProvider>
          <ChatProvider>{children}</ChatProvider>
        </TrackProvider>
      </body>
    </html>
  )
}
