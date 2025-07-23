'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext'; // AuthContext에서 userId를 가져옵니다.
import { Item } from './StyleDataContext'; // Item 인터페이스를 가져옵니다.

// 1. 컨텍스트가 가지게 될 값의 타입을 정의합니다.
interface FavoriteContextType {
  likedItems: number[];
  toggleFavorite: (item: Item) => Promise<void>;
  isLoadingFavorites: boolean;
  errorFavorites: string | null;
}

// 2. createContext를 사용하여 컨텍스트를 생성합니다.
const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

// 3. Provider 컴포넌트를 생성합니다.
export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
  const { userId } = useAuth();
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState<boolean>(true);
  const [errorFavorites, setErrorFavorites] = useState<string | null>(null);
  

  // 초기 찜 목록을 불러오는 함수
  const fetchLikedItems = useCallback(async () => {
    if (userId === null) {
      setLikedItems([]);
      setIsLoadingFavorites(false);
      return;
    }

    setIsLoadingFavorites(true);
    setErrorFavorites(null);
    try {
      const response = await fetch(`http://127.0.0.1:8000/users/favorites?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        // 백엔드 응답이 Item 객체 배열이라고 가정
        setLikedItems(data.map((item: Item) => item.product_id));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || '찜 목록을 불러오는 데 실패했습니다.');
      }
    } catch (e: any) {
      setErrorFavorites(e.message);
      console.error('Error fetching liked items:', e);
    } finally {
      setIsLoadingFavorites(false);
    }
  }, [userId]);

  // 컴포넌트 마운트 시 또는 userId 변경 시 찜 목록 불러오기
  useEffect(() => {
    fetchLikedItems();
  }, [fetchLikedItems]);

  // 찜하기/찜 취소 토글 함수
  const toggleFavorite = useCallback(async (item: Item) => {
    if (userId === null) {
      alert("로그인이 필요합니다.");
      return;
    }

    const isCurrentlyLiked = likedItems.includes(item.product_id);
    let newLikedItems: number[];

    try {
      if (isCurrentlyLiked) {
        // 찜 취소
        const response = await fetch(`http://127.0.0.1:8000/users/favorites?product_id=${item.product_id}&user_id=${userId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('찜 취소에 실패했습니다.');
        }
        newLikedItems = likedItems.filter((id) => id !== item.product_id);
        alert("찜 목록에서 제거되었습니다.");
      } else {
        // 찜하기
        const response = await fetch(`http://127.0.0.1:8000/users/favorites/add?user_id=${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: item.product_id,
            product_name: item.product_name,
            image_url: item.image_url,
            price: item.price,
          }),
        });
        if (!response.ok) {
          throw new Error('찜하기에 실패했습니다.');
        }
        newLikedItems = [...likedItems, item.product_id];
        alert("찜 목록에 추가되었습니다!");
      }
      setLikedItems(newLikedItems);
    } catch (error: any) {
      console.error("찜하기/취소 오류:", error);
      alert(error.message);
    }
  }, [userId, likedItems]);

  const value = { likedItems, toggleFavorite, isLoadingFavorites, errorFavorites };

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
};

// 4. 컨텍스트를 쉽게 사용할 수 있도록 커스텀 훅을 만듭니다.
export const useFavorite = (): FavoriteContextType => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorite must be used within a FavoriteProvider');
  }
  return context;
};
