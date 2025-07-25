"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Palette } from "lucide-react" // 메뉴 아이콘과 팔레트 아이콘 추가
import { useAuth } from '@/app/context/AuthContext'; // useAuth 훅 임포트
import { useModal } from '@/app/context/ModalContext'; // useModal 훅 임포트
import Image from "next/image";


interface HeaderProps {
  activePage: 'home' | 'personal-color' | 'styling' | 'my-page';
}

export const Header = React.memo(({ activePage }: HeaderProps) => {
  const router = useRouter()
  const { isLoggedIn, logout } = useAuth(); // useAuth 훅 사용
  const { openModal } = useModal(); // useModal 훅 사용
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getButtonClass = (page: 'home' | 'personal-color' | 'styling' | 'my-page') => {
    if (page === activePage) {
      return "text-purple-600 font-medium"
    }
    return "text-gray-600 hover:text-purple-600 transition-colors"
  }

  const handleProtectedNavigation = (path: string) => {
    if (!isLoggedIn) {
      openModal("로그인 필요", "로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.", () => {
        router.push("/login");
      });
    } else {
      router.push(path);
    }
    setMobileMenuOpen(false); // 모바일 메뉴 닫기
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Image
              src="/favicon.ico"
              alt="로고"
              width={48}
              height={48}
              className="object-contain"
            />
            </div>
            <span className="text-[#171212] font-bold">
              My Shopping Fairy
            </span>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => router.push("/")}
              className={getButtonClass('home')}
            >
              홈
            </button>
            <button
              onClick={() => handleProtectedNavigation("/personal-color-diagnosis")}
              className={getButtonClass('personal-color')}
            >
              퍼스널컬러
            </button>
            <button
              onClick={() => handleProtectedNavigation("/styling-step1")}
              className={getButtonClass('styling')}
            >
              스타일링
            </button>
            <button
              onClick={() => handleProtectedNavigation("/my-page")}
              className={getButtonClass('my-page')}
            >
              마이페이지
            </button>
            {isLoggedIn ? (
              <Button
                variant="outline"
                onClick={logout}
                className="border-purple-200 text-purple-600 bg-transparent"
              >
                로그아웃
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="border-purple-200 text-purple-600 bg-transparent"
              >
                로그인
              </Button>
            )}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-purple-600 hover:bg-purple-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-purple-100 shadow-lg">
          <div className="px-4 py-2 space-y-1">
            <button
              onClick={() => {
                router.push("/");
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-3 px-4 rounded-md ${activePage === 'home' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-purple-50'}`}
            >
              홈
            </button>
            <button
              onClick={() => handleProtectedNavigation("/personal-color-diagnosis")}
              className={`block w-full text-left py-3 px-4 rounded-md ${activePage === 'personal-color' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-purple-50'}`}
            >
              퍼스널컬러
            </button>
            <button
              onClick={() => handleProtectedNavigation("/styling-step1")}
              className={`block w-full text-left py-3 px-4 rounded-md ${activePage === 'styling' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-purple-50'}`}
            >
              스타일링
            </button>
            <button
              onClick={() => handleProtectedNavigation("/my-page")}
              className={`block w-full text-left py-3 px-4 rounded-md ${activePage === 'my-page' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-purple-50'}`}
            >
              마이페이지
            </button>
            <div className="py-2">
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full border-purple-200 text-purple-600 bg-transparent"
                >
                  로그아웃
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full border-purple-200 text-purple-600 bg-transparent"
                >
                  로그인
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
})
