'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// 1. 컨텍스트가 가지게 될 값의 타입을 정의합니다.
interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  login: (username: string) => void;
  logout: () => void;
}

// 2. createContext를 사용하여 컨텍스트를 생성합니다.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provider 컴포넌트를 생성합니다.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 컴포넌트가 마운트될 때 localStorage를 확인하여 로그인 상태를 설정합니다.
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { username } = JSON.parse(userInfo);
      setIsLoggedIn(true);
      setUserId(username);
    }
  }, []);

  const login = (username: string) => {
    // 실제 로그인 로직 (예: API 호출) 후, 성공 시 localStorage에 저장
    localStorage.setItem('userInfo', JSON.stringify({ username }));
    setIsLoggedIn(true);
    setUserId(username);
    router.push('/'); // 로그인 후 홈으로 이동
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUserId(null);
    router.push('/'); // 로그아웃 후 홈으로 이동
  };

  const value = { isLoggedIn, userId, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 4. 컨텍스트를 쉽게 사용할 수 있도록 커스텀 훅을 만듭니다.
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

