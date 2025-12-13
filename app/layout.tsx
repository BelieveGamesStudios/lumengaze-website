import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/lib/theme-provider"
import { RootLayoutClient } from "@/app/root-layout-client"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LumenGaze",
  description: "Discover immersive XR experiences with LumenGaze",
  icons: {
    icon: "public/Logo.png",
    shortcut: "/favicon-16x16.png",
    apple: "public/Logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`font-sans antialiased`}>
          <RootLayoutClient>
            {children}
          </RootLayoutClient>
          <Analytics />
        </body>
      </html>
    </ThemeProvider>
  )
}
