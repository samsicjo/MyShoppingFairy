"use client"

import React from 'react';

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  activePage: 'home' | 'personal-color' | 'styling' | 'my-page';
}

export const Header = React.memo(({ activePage }: HeaderProps) => {
  const router = useRouter()

  const getButtonClass = (page: 'home' | 'personal-color' | 'styling' | 'my-page') => {
    if (page === activePage) {
      return "text-purple-600 font-medium"
    }
    return "text-gray-600 hover:text-purple-600 transition-colors"
  }

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <img src='./favicon.ico'></img>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Shopping Fairy
              </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => router.push("/personal-color-diagnosis")}
              className={getButtonClass('personal-color')}
            >
              퍼스널컬러
            </button>
            <button
              onClick={() => router.push("/styling-step1")}
              className={getButtonClass('styling')}
            >
              스타일링
            </button>
            <button
              onClick={() => router.push("/my-page")}
              className={getButtonClass('my-page')}
            >
              마이페이지
            </button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border-purple-200 text-purple-600 bg-transparent"
            >
              로그인
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )})
