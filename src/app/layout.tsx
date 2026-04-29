import { TrackProvider } from "@/ui/contexts/TrackProvider"
import type { Metadata } from "next"
import { Quicksand } from "next/font/google"
import "./globals.css"

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Track Observer",
  description: "A tool to check the currently playing track on Spotify",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${quicksand.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <TrackProvider>{children}</TrackProvider>
      </body>
    </html>
  )
}
