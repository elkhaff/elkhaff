import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TikTok Downloader",
  description: "Download TikTok videos and photos without watermark",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#3b82f6" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1e40af" />
      </head>
      <body className={`${inter.className} transition-colors duration-500`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="tiktok-downloader-theme"
        >
          <Suspense
            fallback={
              <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800"></div>
            }
          >
            {children}
          </Suspense>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
