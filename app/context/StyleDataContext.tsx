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
  look_id: number;
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
  clearRecommendations: () => void;
  resetFetchAttempt: () => void; // Add this line
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
  const [hasFetchBeenAttempted, setHasFetchBeenAttempted] = useState(false); // Fetch-once flag

  const clearRecommendations = () => {
    setRecommendations([]);
    setError(null);
    setHasFetchBeenAttempted(false); // Allow fetching again
    sessionStorage.removeItem('styleRecommendations');
    console.log("StyleDataContext: Cleared recommendations, error, and fetch flag.");
  };

  const resetFetchAttempt = () => {
    setHasFetchBeenAttempted(false);
    console.log("StyleDataContext: Reset fetch attempt flag.");
  };

  const fetchRecommendations = useCallback(async () => {
    if (hasFetchBeenAttempted) {
      console.log("StyleDataContext: Fetch already attempted, aborting.");
      return;
    }
    setHasFetchBeenAttempted(true); // Lock fetching immediately

    console.log("StyleDataContext: fetchRecommendations called.");

    if (userId === null) {
      console.log("StyleDataContext: userId is null, not fetching recommendations.");
      setIsLoading(false);
      setIsInitializing(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`StyleDataContext: Fetching from http://127.0.0.1:8000/crawling/analyze-item?user_id=${userId}&filter=0`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 500000); // 200 seconds timeout

      const response = await fetch(`http://127.0.0.1:8000/crawling/analyze-item?user_id=${userId}&filter=0`, {
        method: 'POST',
        signal: controller.signal,
      });
      clearTimeout(timeoutId); // Clear the timeout if the fetch completes or fails before timeout
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch recommendations');
      }
      const data = await response.json();
      console.log("StyleDataContext: Received data:", data);
      setRecommendations(data);
      sessionStorage.setItem('styleRecommendations', JSON.stringify(data));
      console.log('StyleDataContext recommendations : ', recommendations)
      console.log("StyleDataContext: Saved recommendations to sessionStorage.");
    } catch (e: any) {
      let errorMessage = "추천 정보를 불러오는 데 실패했습니다.";
      if (e.name === 'AbortError') {
        errorMessage = "요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.";
        console.warn('StyleDataContext: Fetch aborted due to timeout.');
      } else {
        console.error('StyleDataContext: Error fetching recommendations:', e);
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsInitializing(false);
      console.log("StyleDataContext: fetchRecommendations finished.");
      console.log('StyleDataContext finally recommendations : ', recommendations)
    }
  }, [userId, hasFetchBeenAttempted]);

  useEffect(() => {
    console.log("StyleDataContext: Initial useEffect for sessionStorage load.");
    const savedRecommendations = sessionStorage.getItem('styleRecommendations');
    if (savedRecommendations) {
      try {
        const parsedData = JSON.parse(savedRecommendations);
        setRecommendations(parsedData);
        setHasFetchBeenAttempted(true); // Already have data, so lock fetching
        console.log("StyleDataContext: Loaded recommendations from sessionStorage:", parsedData);
      } catch (e) {
        console.error("StyleDataContext: Failed to load recommendations from sessionStorage", e);
        setRecommendations([]);
      }
    }
    setIsInitializing(false);
    console.log("StyleDataContext: isInitializing set to false after initial load attempt.");
  }, []);

  const value = { recommendations, isLoading, isInitializing, error, fetchRecommendations, clearRecommendations, resetFetchAttempt };

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