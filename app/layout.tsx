import type { Metadata, Viewport } from 'next'
import { Sora, Inter } from 'next/font/google'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BeyondBell Circle — The Professional Circle for Indian Educators',
  description:
    'The smarter professional circle for Indian educators — built with AI tools, real peers, and practical support. Founding Members ₹199/month. First 500 only.',
  keywords: [
    'Indian educators',
    'teacher community',
    'AI tools for teachers',
    'BeyondBell',
    'CBSE',
    'ICSE',
  ],
  openGraph: {
    title: 'BeyondBell Circle',
    description: 'Beyond the classroom. Beyond the noise. Beyond the bell.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#FF8A00',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${inter.variable} font-inter antialiased bg-white text-ink`}>
        {children}
      </body>
    </html>
  )
}
