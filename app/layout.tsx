import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BeyondBell Circle — Join the Waitlist',
  description:
    'A professional home for Indian school educators across CBSE, ICSE, and IGCSE schools. Six AI tools. A real community. Founding Member pricing locked for life.',
}

export const viewport: Viewport = {
  themeColor: '#1A2D4A',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-nunito antialiased bg-white text-navy`}>
        {children}
      </body>
    </html>
  )
}
