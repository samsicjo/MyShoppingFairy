'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';

// 1. 새로운 API 응답 구조에 맞는 타입 정의
export interface Item {
  product_id: number;
  product_name: string;
  image_url: string;
  price: number;
}

export interface Items {
  "아우터"?: Item | null;
  "상의"?: Item | null;
  "하의"?: Item | null;
  "신발"?: Item | null;
  "원피스"?: Item | null; 
}

export interface Look {
  look_name: string;
  look_description: string;
  items: Items;
}

// 2. 컨텍스트가 제공할 값의 타입 업데이트
interface StyleDataContextType {
  recommendations: Look[];
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  fetchRecommendations: () => Promise<void>;
}

// 3. 컨텍스트 생성
const StyleDataContext = createContext<StyleDataContextType | undefined>(undefined);

// 4. Provider 컴포넌트를 구현합니다.
export const StyleDataProvider = ({ children }: { children: ReactNode }) => {
  const { userId } = useAuth();
  const [recommendations, setRecommendations] = useState<Look[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/crawling/analyze-item?user_id=1&filter=0`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      const data = await response.json();
      console.log(data)
      setRecommendations(data);
      sessionStorage.setItem('styleRecommendations', JSON.stringify(data));
    } catch (e) {
      const errorMessage = "추천 정보를 불러오는 데 실패했습니다.";
      setError(errorMessage);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    try {
      const savedRecommendations = sessionStorage.getItem('styleRecommendations');
      if (savedRecommendations) {
        setRecommendations(JSON.parse(savedRecommendations));
      }
    } catch (e) {
      console.error("Failed to load recommendations from session storage", e);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const value = { recommendations, isLoading, isInitializing, error, fetchRecommendations };

  return (
    <StyleDataContext.Provider value={value}>
      {children}
    </StyleDataContext.Provider>
  );
};

// 5. 커스텀 훅
export const useStyleData = (): StyleDataContextType => {
  const context = useContext(StyleDataContext);
  if (context === undefined) {
    throw new Error('useStyleData must be used within a StyleDataProvider');
  }
  return context;
};