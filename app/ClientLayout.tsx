"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from '../components/theme-provider';
import { StylingProvider } from './context/StylingContext';
import { Footer } from "@/components/ui/Footer";

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({ children, }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <StylingProvider>
          <main className="flex-grow">{children}</main>
          <Footer />
        </StylingProvider>
      </body>
    </html>
  )
}
