"use client"

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

// 1. 새로운 API 응답 구조에 맞는 타입 정의
export interface Item {
  product_id: string;
  product_name: string;
  image_url: string;
  price: number;
}

export interface Items {
  "아우터"?: Item | null;
  "상의"?: Item | null;
  "하의"?: Item | null;
  "신발"?: Item | null;
  "원피스"?: Item | null; // 예시 데이터에는 없지만, 확장성을 위해 유지
}

export interface Look {
  look_name: string;
  look_description: string;
  items: Items;
}

// 2. 컨텍스트가 제공할 값의 타입 업데이트 (StyleRecommendation[] -> Look[])
interface StyleDataContextType {
  recommendations: Look[];
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  fetchRecommendationsByStyles: (styles: string[]) => Promise<void>;
}

// 3. 컨텍스트 생성
const StyleDataContext = createContext<StyleDataContextType | undefined>(undefined);

// temp.js 기반의 새로운 목 데이터
const mockLooks: Look[] = [
  {
    "look_name": "편안한 가을 캐주얼",
    "look_description": "어깨가 좁은 체형을 보완하고 오버핏을 선호하는 고객님을 위해 상의는 자연스러운 루즈핏을 선택하고, 하의는 편안한 핏으로 전체적인 밸런스를 맞춘 캐주얼 룩입니다.",
    "items": {
      "아우터": {
        "product_id": "3092810",
        "product_name": "트렌치 5307 롱기장 오버핏 블랙 데님코트",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20230220/3092810/3092810_17407252278178_big.jpg",
        "price": 53700
      },
      "상의": {
        "product_id": "1817394",
        "product_name": "[3-PACK]베이직 트래블러 피그먼트 스웨트셔츠",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20210226/1817394/1817394_17152436181527_big.jpg",
        "price": 59900
      },
      "하의": {
        "product_id": "2546006",
        "product_name": "[해피가이정호 PICK] 세미와이드 원턱  린넨 팬츠_5color",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20220509/2546006/2546006_17436646656153_big.jpg",
        "price": 38400
      },
      "신발": {
        "product_id": "3436833",
        "product_name": "포폴라 클래식 컵솔 베이지(QO323LCU74)",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20230801/3436833/3436833_17298113231572_big.jpg",
        "price": 32700
      }
    }
  },
  {
    "look_name": "활동적인 데일리 캐주얼",
    "look_description": "선호하는 오버핏을 살리면서 활동성을 강조한 캐주얼 룩입니다. 상하의 모두 여유로운 핏으로 편안함을 제공하며, 마른 체형을 자연스럽게 보완합니다.",
    "items": {
      "아우터": {
        "product_id": "4853261",
        "product_name": "빈티지 워싱 절개 디테일 카라넥 코튼 집업 봄버 점퍼_3COLOR",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20250304/4853261/4853261_17410780299236_big.jpg",
        "price": 45600
      },
      "상의": {
        "product_id": "4011115",
        "product_name": "아노락 후드반팔 블랙 ITY2TH31GBK",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20240401/4011115/4011115_17119530416016_big.jpg",
        "price": 24900
      },
      "하의": {
        "product_id": "4149670",
        "product_name": "SL01 섬머 데님 와이드 팬츠 (FADE LIGHT BLUE)",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20240523/4149670/4149670_17164526388049_big.jpg",
        "price": 36750
      },
      "신발": {
        "product_id": "3436833",
        "product_name": "포폴라 클래식 컵솔 베이지(QO323LCU74)",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20230801/3436833/3436833_17298113231572_big.jpg",
        "price": 32700
      }
    }
  },
  {
    "look_name": "깔끔한 캐주얼",
    "look_description": "깔끔하면서도 오버핏 선호를 반영한 캐주얼 룩입니다. 상의는 여유로운 핏의 셔츠를 활용하고 하의는 슬림하지만 편안한 핏의 팬츠를 매치하여 조화롭습니다.",
    "items": {
      "아우터": {
        "product_id": "3464714",
        "product_name": "CONE MILL DENIM STITCHED TRUCKER JACKET ECRU",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20230814/3464714/3464714_16932936131304_big.jpg",
        "price": 89500
      },
      "상의": {
        "product_id": "4143736",
        "product_name": "써머 링클 오션 체크남방 _5Color",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20240521/4143736/4143736_17490098223174_big.jpg",
        "price": 29990
      },
      "하의": {
        "product_id": "2546006",
        "product_name": "[해피가이정호 PICK] 세미와이드 원턱  린넨 팬츠_5color",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20220509/2546006/2546006_17436646656153_big.jpg",
        "price": 38400
      },
      "신발": {
        "product_id": "3436833",
        "product_name": "포폴라 클래식 컵솔 베이지(QO323LCU74)",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20230801/3436833/3436833_17298113231572_big.jpg",
        "price": 32700
      }
    }
  },
  {
    "look_name": "편안한 트레이닝 스포티",
    "look_description": "오버핏 선호와 스포티한 스타일을 결합하여, 운동할 때 뿐만 아니라 일상에서도 편안하게 입을 수 있는 룩입니다. 마른 체형을 자연스럽게 감싸는 오버핏 상의와 편안한 하의를 매치했습니다.",
    "items": {
      "아우터": {
        "product_id": "4307075",
        "product_name": "클래식 NY 트랙 탑 라이트베이지",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20240807/4307075/4307075_17524663984063_big.png",
        "price": 74250
      },
      "상의": {
        "product_id": "4011115",
        "product_name": "아노락 후드반팔 블랙 ITY2TH31GBK",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20240401/4011115/4011115_17119530416016_big.jpg",
        "price": 24900
      },
      "하의": {
        "product_id": "4335497",
        "product_name": "Track Pants (U24DBPT474)",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20240816/4335497/4335497_17260405828650_big.jpg",
        "price": 17900
      },
      "신발": {
        "product_id": "3901126",
        "product_name": "NBPFFF750L / W480SK5 (Uni 4E) (BLACK)",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20240226/3901126/3901126_17479644701162_big.jpg",
        "price": 99000
      }
    }
  },
  {
    "look_name": "스트릿 스포티",
    "look_description": "젊고 활동적인 스트릿 감성을 담은 스포티 룩입니다. 오버핏 티셔츠와 편안한 조거 팬츠의 조합으로 트렌디하면서도 체형 보완에 좋습니다.",
    "items": {
      "아우터": {
        "product_id": "3909084",
        "product_name": "클래식 반팔 스탠넥 아노락 블루(UP323CWT79)",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20240228/3909084/3909084_17267308427918_big.jpg",
        "price": 55300
      },
      "상의": {
        "product_id": "4729987",
        "product_name": "AVL 트랙 오버핏 긴팔티 AVT933 (2 COLOR)",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20250120/4729987/4729987_17397739475712_big.jpg",
        "price": 29900
      },
      "하의": {
        "product_id": "4335497",
        "product_name": "Track Pants (U24DBPT474)",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20240816/4335497/4335497_17260405828650_big.jpg",
        "price": 17900
      },
      "신발": {
        "product_id": "3436833",
        "product_name": "포폴라 클래식 컵솔 베이지(QO323LCU74)",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20230801/3436833/3436833_17298113231572_big.jpg",
        "price": 32700
      }
    }
  },
  {
    "look_name": "기능성 스포티",
    "look_description": "기능성을 겸비하면서도 스타일리시함을 잃지 않는 스포티 룩입니다. 경량 아우터와 편안한 상하의 조합으로 활동성을 최적화하면서, 오버핏 선호를 반영합니다.",
    "items": {
      "아우터": {
        "product_id": "4901469",
        "product_name": "스월 로고 패디드 베스트 (스카이 블루)",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20250314/4901469/4901469_17430606849354_big.jpg",
        "price": 59000
      },
      "상의": {
        "product_id": "4306373",
        "product_name": "[SET] 24H 트랙 브이넥 맨투맨 셋업_네이비",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20240807/4306373/4306373_17237616249027_big.jpg",
        "price": 59900
      },
      "하의": {
        "product_id": "5022734",
        "product_name": "TCM ethnic nylon pants (black)",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20250414/5022734/5022734_17457977879262_big.jpg",
        "price": 98100
      },
      "신발": {
        "product_id": "3901126",
        "product_name": "NBPFFF750L / W480SK5 (Uni 4E) (BLACK)",
        "image_url": "https://image.msscdn.net/thumbnails/images/goods_img/20240226/3901126/3901126_17479644701162_big.jpg",
        "price": 99000
      }
    }
  }
];

// 4. Provider 컴포넌트를 구현합니다.
export const StyleDataProvider = ({ children }: { children: ReactNode }) => {
  const [recommendations, setRecommendations] = useState<Look[]>([]);
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
      // 현재는 목 데이터를 사용합니다. API가 스타일 기반으로 필터링된 결과를 반환한다고 가정합니다.
      setRecommendations(mockLooks);
      sessionStorage.setItem('styleRecommendations', JSON.stringify(mockLooks));
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

// 5. 커스텀 훅
export const useStyleData = (): StyleDataContextType => {
  const context = useContext(StyleDataContext);
  if (context === undefined) {
    throw new Error('useStyleData must be used within a StyleDataProvider');
  }
  return context;
};
