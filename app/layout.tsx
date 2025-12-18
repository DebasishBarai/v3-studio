import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import ConvexClientProvider from '@/app/providers'
import { Toaster } from '@/components/ui/sonner'
import Script from 'next/script'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'V3 Studio – Instantly Create Viral Videos with AI',
  description: 'Create viral videos and Product Ads instantly using AI-powered tools',
  icons: {
    icon: '/logo.png',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* firstpromoter affiliate code */}
      <head>
        <Script src="/fprmain.js" strategy="beforeInteractive" />
        <Script src="https://cdn.firstpromoter.com/fpr.js" strategy="beforeInteractive" />
      </head>
      {/* firstpromoter affiliate code */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider appearance={{ theme: dark }}>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
        <Toaster richColors />
      </body>
    </html>
  )
}
