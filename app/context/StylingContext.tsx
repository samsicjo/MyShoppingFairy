'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react'

export enum Gender{
    Male = "남",
    Female = "여",
    Other = "기타",
}

export enum MajorStyleSituation{
    workStyle = "출근/업무",      // 출근/업무
    date = "데이트",           // 데이트
    daily = "일상/집",          // 일상/집
    Party = "파티/행사",          // 파티/행사
    Travel = "여행",         // 여행
    Active = "운동/액티비티",         // 운동/액티비티
}

export enum TopSize{
    XS = 'XS',
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL',
    XXL = 'XXL',
}

export enum BodyType {
  UpperBodyDominant = "상체가 발달한 편",     // 상체가 발달한 편
  LowerBodyDominant = "하체가 발달한 편",     // 하체가 발달한 편
  Balanced = "전체적으로 균형잡힌 편",              // 전체적으로 균형잡힌 편
  Slim = "마른 편",                  // 마른 편
  Chubby = "통통한 편",                // 통통한 편
  Tall = "키가 큰 편",                  // 키가 큰 편
}

export enum PreferredStyle {
  Casual = "캐주얼",         // 캐주얼
  Street = "스트릿",         // 스트릿
  Gorpcore = "고프코어",     // 고프코어
  Workwear = "워크웨어",     // 워크웨어
  Preppy = "프레피",         // 프레피
  CityBoy = "시티보이",      // 시티보이
  Sporty = "스포티",        // 스포티
  Romantic = "로맨틱",      // 로맨틱
  Girlish = "걸리시",       // 걸리시
  Classic = "클래식",       // 클래식
  Minimal = "미니멀",       // 미니멀
  Chic = "시크",            // 시크
  Retro = "레트로",         // 레트로
  Ethnic = "에스닉",        // 에스닉
  Resort = "리조트"         // 리조트
}


// 1. 공유할 데이터의 타입 정의
interface StylingData {
    personalColor?: string      //퍼스널 컬러
    colorNames?: string[]      //어울리는 색 이름
    recommendedColors?: string[]   //추천 색 HEX
    description?: string       //설명
    height?: number        //사용자 키
    gender?: string        //사용자 성별 (API 응답에 맞춰 string으로 변경)
    user_situation?: string[]   //사용자 주된 스타일 상황 (API 응답에 맞춰 string[]으로 변경)
    budget?: number        //사용자 예산
    occasion?: string      //사용자 스타일링 메모 (API 응답에 맞춰 style_request로 변경)
    top_size?: string      //상의 사이즈 (API 응답에 맞춰 string으로 변경)
    bottom_size?: number     //허리 사이즈 (API 응답에 맞춰 bottom_size로 변경)
    shoe_size?: number      //신발 사이즈
    body_feature?: string[]  //체형 타입 (API 응답에 맞춰 string[]으로 변경)
    preferred_styles?: string[]      //선호하는 스타일 (API 응답에 맞춰 string[]으로 변경)
}
            // - 예산: {styling_summary.get('price', 'N/A')}원
            // - 스타일 요청: {styling_summary.get('style_request', 'N/A')}
            // - 키: {styling_summary.get('height', 'N/A')}cm
            // - 성별: {styling_summary.get('gender', 'N/A')}
            // - 상의 사이즈: {styling_summary.get('top_size', 'N/A')}
            // - 하의 사이즈: {styling_summary.get('bottom_size', 'N/A')}
            // - 신발 사이즈: {styling_summary.get('shoe_size', 'N/A')}
            // - 체형 특징: {styling_summary.get('body_feature', 'N/A')}
            // - 선호 스타일: {', '.join(styling_summary.get('preferred_styles', []))}
    //             summary_id: Optional[int] = None
                // user_id: Optional[int] = None
                // price: int
                // style_request: str
                // height: int
                // gender: str
                // top_size: str
                // bottom_size: int
                // shoe_size: int
                // body_feature: str
                // preferred_styles: List[str]

// 2. Context가 제공할 값의 타입 정의 (데이터와, 데이터를 변경할 함수)
interface StylingContextType {
    stylingData: StylingData
    setStylingData: React.Dispatch<React.SetStateAction<StylingData>>
}

// 3. Context 생성 (초기값 설정)
const StylingContext = createContext<StylingContextType | undefined>(undefined)

// 4. Context를 제공할 Provider 컴포넌트 생성
export function StylingProvider({ children }: { children: ReactNode }) {
    const [stylingData, setStylingData] = useState<StylingData>(() => {
        if (typeof window !== 'undefined') {
            const savedStylingData = sessionStorage.getItem('stylingData')
            const initialData = savedStylingData ? JSON.parse(savedStylingData) : {}

            
            // body_feature가 배열이 아니면 배열로 변환
            if (!Array.isArray(initialData.body_feature)) {
                initialData.body_feature = initialData.body_feature ? [initialData.body_feature] : []
            }
            // preferred_styles가 배열이 아니면 배열로 변환
            if (!Array.isArray(initialData.preferred_styles)) {
                initialData.preferred_styles = initialData.preferred_styles ? [initialData.preferred_styles] : []
            }
            console.log("StylingContext: Initializing with data from sessionStorage:", initialData)
            return initialData
        }
        console.log("StylingContext: Initializing with empty data (server-side).")
        return {}
    })

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            console.log("StylingContext: Saving stylingData to sessionStorage:", stylingData)
            sessionStorage.setItem('stylingData', JSON.stringify(stylingData))
        }
    }, [stylingData])

    return (
        <StylingContext.Provider value={{ stylingData, setStylingData }}>
        {children}
    </StylingContext.Provider>
    )
}

// 5. Context를 쉽게 사용하기 위한 커스텀 훅 생성
export function useStyling() {
    const context = useContext(StylingContext)
    if (context === undefined) {
        throw new Error('useStyling must be used within a StylingProvider')
    }
    return context
}
