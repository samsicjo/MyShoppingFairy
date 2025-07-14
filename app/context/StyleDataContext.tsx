"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

// 1. 새로운 데이터 구조에 맞는 타입들을 정의합니다.
export interface Item {
  category: string;
  item_code: string;
  category_id: string;
  color: string;
}

export interface Items {
  "상의": Item | null;
  "하의": Item | null;
  "아우터": Item | null;
  "신발": Item | null;
  "원피스": Item | null;
}

export interface Look {
  look_name: string;
  look_description: string;
  items: Items;
}

export interface StyleRecommendation {
  style_name: string;
  looks: Look[];
}

// 2. 컨텍스트가 제공할 값의 타입을 업데이트합니다.
interface StyleDataContextType {
  recommendations: StyleRecommendation[];
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  fetchRecommendationsByStyles: (styles: string[]) => Promise<void>;
}

// 3. 컨텍스트를 생성합니다.
const StyleDataContext = createContext<StyleDataContextType | undefined>(undefined);

// 제공된 예시 데이터를 기반으로 한 임시 목 데이터입니다.
const mockApiData = {
  "recommendations": [
    {
      "style_name": "캐주얼",
      "looks": [
        {
          "look_name": "캐주얼룩1",
          "look_description": "편안하면서도 스타일리시한 캐주얼 룩입니다.",
          "items": {
            "상의": { "category": "긴소매 티셔츠", "item_code": "001010", "category_id": "001", "color": "화이트" },
            "하의": { "category": "데님 팬츠", "item_code": "003002", "category_id": "003", "color": "중청" },
            "아우터": { "category": "후드 집업", "item_code": "002022", "category_id": "002", "color": "그레이" },
            "신발": { "category": "스니커즈", "item_code": "103004", "category_id": "103", "color": "화이트" },
            "원피스": null
          }
        },
        {
          "look_name": "캐주얼룩2",
          "look_description": "활동적인 캐주얼 스타일을 연출합니다.",
          "items": {
            "상의": { "category": "맨투맨/스웨트", "item_code": "001005", "category_id": "001", "color": "핑크" },
            "하의": { "category": "레깅스", "item_code": "003005", "category_id": "003", "color": "블랙" },
            "아우터": { "category": "나일론/코치 재킷", "item_code": "002006", "category_id": "002", "color": "블랙" },
            "신발": { "category": "스포츠화", "item_code": "103005", "category_id": "103", "color": "화이트" },
            "원피스": null
          }
        },
        {
          "look_name": "캐주얼룩3",
          "look_description": "심플하면서도 세련된 캐주얼 룩입니다.",
          "items": {
            "상의": { "category": "셔츠/블라우스", "item_code": "001002", "category_id": "001", "color": "아이보리" },
            "하의": { "category": "코튼 팬츠", "item_code": "003007", "category_id": "003", "color": "베이지" },
            "아우터": { "category": "카디건", "item_code": "002020", "category_id": "002", "color": "라이트 그레이" },
            "신발": { "category": "스니커즈", "item_code": "103004", "category_id": "103", "color": "베이지" },
            "원피스": null
          }
        }
      ]
    },
    {
      "style_name": "스트릿",
      "looks": [
        { "look_name": "스트릿룩1", "look_description": "힙한 감성이 돋보이는 스트릿 스타일입니다.", "items": { "상의": { "category": "후드 티셔츠", "item_code": "001004", "category_id": "001", "color": "블랙" }, "하의": { "category": "데님 팬츠", "item_code": "003002", "category_id": "003", "color": "흑청" }, "아우터": { "category": "나일론/코치 재킷", "item_code": "002006", "category_id": "002", "color": "블랙" }, "신발": { "category": "스니커즈", "item_code": "103004", "category_id": "103", "color": "블랙" }, "원피스": null } },
        { "look_name": "스트릿룩2", "look_description": "자유분방한 스트릿 패션을 연출합니다.", "items": { "상의": { "category": "반소매 티셔츠", "item_code": "001001", "category_id": "001", "color": "화이트" }, "하의": { "category": "숏 팬츠", "item_code": "003009", "category_id": "003", "color": "블랙" }, "아우터": { "category": "베스트", "item_code": "002021", "category_id": "002", "color": "블랙" }, "신발": { "category": "스니커즈", "item_code": "103004", "category_id": "103", "color": "화이트" }, "원피스": null } },
        { "look_name": "스트릿룩3", "look_description": "트렌디한 스트릿 캐주얼 룩입니다.", "items": { "상의": { "category": "긴소매 티셔츠", "item_code": "001010", "category_id": "001", "color": "그레이" }, "하의": { "category": "트레이닝/조거팬츠", "item_code": "003004", "category_id": "003", "color": "블랙" }, "아우터": { "category": "후드 집업", "item_code": "002022", "category_id": "002", "color": "블랙" }, "신발": { "category": "스니커즈", "item_code": "103004", "category_id": "103", "color": "블랙" }, "원피스": null } }
      ]
    },
    {
      "style_name": "워크웨어",
      "looks": [
        { "look_name": "워크웨어룩1", "look_description": "견고하고 실용적인 워크웨어 스타일입니다.", "items": { "상의": { "category": "셔츠/블라우스", "item_code": "001002", "category_id": "001", "color": "카키" }, "하의": { "category": "코튼 팬츠", "item_code": "003007", "category_id": "003", "color": "베이지" }, "아우터": { "category": "트러거 재킷", "item_code": "002017", "category_id": "002", "color": "브라운" }, "신발": { "category": "부츠/워커", "item_code": "103002", "category_id": "103", "color": "브라운" }, "원피스": null } },
        { "look_name": "워크웨어룩2", "look_description": "활동적인 워크웨어 스타일을 연출합니다.", "items": { "상의": { "category": "긴소매 티셔츠", "item_code": "001010", "category_id": "001", "color": "네이비" }, "하의": { "category": "데님 팬츠", "item_code": "003002", "category_id": "003", "color": "진청" }, "아우터": { "category": "베스트", "item_code": "002021", "category_id": "002", "color": "카키" }, "신발": { "category": "스니커즈", "item_code": "103004", "category_id": "103", "color": "블랙" }, "원피스": null } },
        { "look_name": "워크웨어룩3", "look_description": "심플하면서도 강인한 워크웨어 룩입니다.", "items": { "상의": { "category": "맨투맨/스웨트", "item_code": "001005", "category_id": "001", "color": "그레이" }, "하의": { "category": "코튼 팬츠", "item_code": "003007", "category_id": "003", "color": "카키" }, "아우터": { "category": "사파리/헌팅 재킷", "item_code": "002014", "category_id": "002", "color": "카키" }, "신발": { "category": "부츠/워커", "item_code": "103002", "category_id": "103", "color": "브라운" }, "원피스": null } }
      ]
    }
  ]
};

// 4. Provider 컴포넌트를 구현합니다.
export const StyleDataProvider = ({ children }: { children: ReactNode }) => {
  const [recommendations, setRecommendations] = useState<StyleRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const fetchRecommendationsByStyles = useCallback(async (styles: string[]) => {
    setIsLoading(true);
    setError(null);
    console.log(`Fetching recommendations for styles: ${styles.join(', ')}`);

    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // 실제 API 호출 시, 이 부분에 fetch 로직을 구현합니다.
      // 예: const response = await fetch(`/api/recommendations?styles=${styles.join(',')}`);
      //     const data = await response.json();
      const allRecommendations = mockApiData.recommendations;
      // 선택된 스타일에 맞는 추천만 필터링합니다.
      const lowercasedStyles = styles.map(s => s.toLowerCase());
      const filteredRecommendations = allRecommendations.filter(rec =>
        lowercasedStyles.includes(rec.style_name.toLowerCase())
      );

      if (filteredRecommendations.length === 0) {
        console.warn(`No recommendations found for styles: ${styles.join(', ')}`);
      }
      setRecommendations(filteredRecommendations);
      sessionStorage.setItem('styleRecommendations', JSON.stringify(filteredRecommendations));
    } catch (e) {
      const errorMessage = "추천 정보를 불러오는 데 실패했습니다.";
      setError(errorMessage);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = { recommendations, isLoading, isInitializing, error, fetchRecommendationsByStyles };

  return (
    <StyleDataContext.Provider value={value}>
      {children}
    </StyleDataContext.Provider>
  );
};

// 5. 커스텀 훅을 만듭니다.
export const useStyleData = (): StyleDataContextType => {
  const context = useContext(StyleDataContext);
  if (context === undefined) {
    throw new Error('useStyleData must be used within a StyleDataProvider');
  }
  return context;
};