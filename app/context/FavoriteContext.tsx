'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useModal } from './ModalContext'; // ModalContext에서 useModal을 가져옵니다.
import { useAuth } from './AuthContext'
import { Item } from './StyleDataContext'
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
  const { openModal } = useModal(); // useModal 훅을 사용합니다.
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/favorites?user_id=${userId}`);
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
      openModal("로그인 필요", "로그인이 필요한 기능입니다.");
      return;
    }

    const isCurrentlyLiked = likedItems.includes(item.product_id);
    let newLikedItems: number[];

    try {
      if (isCurrentlyLiked) {
        // 찜 취소
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/favorites?product_id=${item.product_id}&user_id=${userId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('찜 취소에 실패했습니다.');
        }
        newLikedItems = likedItems.filter((id) => id !== item.product_id);
        openModal("알림", "찜 목록에서 제거되었습니다.");
      } else {
        // 찜하기
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/favorites/add?user_id=${userId}`, {
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
        openModal("알림", "찜 목록에 추가되었습니다!");
      }
      setLikedItems(newLikedItems);
    } catch (error: any) {
      console.error("찜하기/취소 오류:", error);
      openModal("오류", error.message);
    }
  }, [userId, likedItems, openModal]);

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
