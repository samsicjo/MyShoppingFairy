'use client'

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// 1. 컨텍스트가 가지게 될 값의 타입을 정의합니다.
interface AuthContextType {
  isLoggedIn: boolean
  userId: number | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

// 2. createContext를 사용하여 컨텍스트를 생성합니다.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provider 컴포넌트를 생성합니다.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    // 컴포넌트가 마운트될 때 localStorage를 확인하여 로그인 상태를 설정합니다.
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const { userId } = JSON.parse(userInfo)
      setIsLoggedIn(true)
      setUserId(userId as number)
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/users/user_login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '로그인 실패');
      }
      console.log(response.body)
      const data = await response.json();
      // 백엔드에서 순수한 숫자 (int8)를 반환한다고 가정
      const userId = data; // 숫자를 직접 할당
      console.log(userId)
      localStorage.setItem('userInfo', JSON.stringify({ userId }));
      setIsLoggedIn(true);
      setUserId(userId);
      router.push('/'); // 로그인 후 홈으로 이동
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error; // 오류를 다시 던져서 호출자가 처리하도록 합니다.
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo')
    setIsLoggedIn(false)
    setUserId(null)
    router.push('/') // 로그아웃 후 홈으로 이동
  }

  const value = { isLoggedIn, userId, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

// 4. 컨텍스트를 쉽게 사용할 수 있도록 커스텀 훅을 만듭니다.
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

