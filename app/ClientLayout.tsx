"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { Inter } from "next/font/google"
import "./globals.css"
import { StylingProvider } from './context/StylingContext';

import { AuthProvider } from './context/AuthContext';
import { StyleDataProvider } from './context/StyleDataContext';

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
        <AuthProvider>
          <StyleDataProvider>
            <StylingProvider>
              <main className="flex-grow">{children}</main>
              <Footer />
            </StylingProvider>
          </StyleDataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
