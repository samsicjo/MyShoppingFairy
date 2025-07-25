"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/Header";
import { Footer } from '@/components/ui/Footer';
import { Palette, Shirt, Heart, Star, TrendingUp, ArrowRight } from "lucide-react"
import { useAuth } from "./context/AuthContext";
import { useModal } from "./context/ModalContext";
import { useEffect } from "react";
import { useStyling } from './context/StylingContext'

export default function HomePage() {
  const router = useRouter()
  const { isLoggedIn, userId } = useAuth();
  const { openModal } = useModal();
  const { stylingData, setStylingData} = useStyling()

  //간단한 백엔드 확인용 코드
  useEffect(() => {
    
    console.log(isLoggedIn)
    if(isLoggedIn){
      console.log('초기 stylingData : ', stylingData)
      const getUserStylingSummaryInfo = async () => {
        try {
          const response = await fetch(`http://localhost:8000/users/styling_summary_info?user_id=${userId}`)
          if(response.ok){
            
            const data = await response.json()
            console.log('User Styling Summary Info : ', data)
            setStylingData(data)
          } else if (response.status === 404) {
            console.log("No styling data found for user (404). This is expected for new users.");
            setStylingData({}); // Set to an empty object or appropriate default
          } else {
            console.error("Fetch styling data 실패 : ", response.status, response.statusText)
          }
        }
        catch(error){
          console.log('getUserStylingSummaryInfo Error : ', error)
        }
      }
      getUserStylingSummaryInfo()
    }
    }, [isLoggedIn, userId, setStylingData])

    const handleNavigation = (path: string) => {
      if (!isLoggedIn) {
        openModal("로그인 필요", "로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.", () => {
          router.push("/login");
        });
        return;
      }
      router.push(path)
    }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="home" />

      {/* Hero Image Section - 모든 디바이스에서 동일한 위치 */}
      <section className="relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-2xl overflow-hidden shadow-lg relative">
            <img
              src="/images/service-hero.png"
              alt="Fashion Style"
              className="w-full h-96 md:h-[500px] object-cover"
            />

            {/* 텍스트와 버튼 오버레이 - 고정 위치 */}
            <div className="absolute inset-0 flex flex-col justify-end items-end text-right p-8 pr-6 pb-12">
              {/* 메인 제목 - 고정 크기 */}
              <h1 className="text-3xl font-bold text-[#171212] mb-3 drop-shadow-lg">
                Find Your Perfect Style
              </h1>

              {/* 부제목 - 고정 크기 */}
              <p className="text-base text-[#171212]/90 mb-6 drop-shadow-md max-w-md">
                AI가 찾아주는 당신만의 완벽한 스타일
              </p>

              {/* 버튼들 */}
              <div className="flex gap-4">
                <Button
                  onClick={() => handleNavigation("/personal-color-diagnosis")}
                  className="bg-[#F8B8D2] hover:bg-[#f5a6c6] text-white hover:text-[#171212] px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Palette className="h-5 w-5 mr-2" />
                  퍼스널컬러 진단
                </Button>
                <Button
                  onClick={() => handleNavigation("/styling-step1")}
                  className="bg-[#A8958F] hover:bg-[#A8958F] text-white hover:text-[#171212] px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Shirt className="h-5 w-5 mr-2" />
                  스타일링 추천
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section - 버튼 추가된 버전 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-left">
            How It Works
          </h2>
          <h2 className="text-md md:text-2xl font text-gray-900 mb-6 text-left">
            우리서비스의 AI 분석이 당신의 특징과 취향을 분석하여 초개인 맞춤형 패션 스타일링 조언을 제공합니다.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Personal Color Analysis - 호버 효과 추가 */}
            <div
              onClick={() => handleNavigation("/personal-color-diagnosis")}
              className="bg-white rounded-lg p-8 shadow-sm border border-red-200 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-2 group group-hover:border-purple-400"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
                <Palette className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                퍼스널컬러 진단
              </h3>
              <p className="text-[#82696B] group-hover:text-gray-700 transition-colors duration-300">
                당신의 피부 톤, 헤어 컬러, 눈동자 색을 기반으로 나에게 딱 맞는 퍼스널 컬러 팔레트를 찾아보세요.
              </p>
            </div>

            {/* Style Recommendation - 호버 효과 추가 */}
            <div
              onClick={() => handleNavigation("/styling-step1")}
              className="bg-white rounded-lg p-8 shadow-sm border border-red-200 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-2 group group-hover:border-purple-400"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
                <Shirt className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                스타일링 추천
              </h3>
              <p className="text-[#82696B] group-hover:text-gray-700 transition-colors duration-300">
                나만의 스타일에 맞춘 의류 및 액세서리 추천도 함께 제공됩니다.
              </p>
            </div>

            {/* My Style Profile - 호버 효과 추가 */}
            <div
              onClick={() => handleNavigation("/my-page?tab=favorites")}
              className="bg-white rounded-lg p-8 shadow-sm border border-red-200 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-2 group group-hover:border-purple-400"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                찜한 아이템
              </h3>
              <p className="text-[#82696B] group-hover:text-gray-700 transition-colors duration-300">
                스타일 취향과 마음에 드는 아이템은 프로필에서 관리하고 저장해보세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-purple-100 p-4">
        <div className="flex justify-around">
          <button
            onClick={() => handleNavigation("/personal-color-diagnosis")}
            className="flex flex-col items-center space-y-1 text-purple-600"
            style={{ height: '40px', width: '55.2px' }}
          >
            <Palette className="h-5 w-5" />
            <span className="text-xs">퍼스널컬러</span>
          </button>
          <button
            onClick={() => handleNavigation("/styling-step1")}
            className="flex flex-col items-center space-y-1 text-purple-600"
            style={{ height: '40px', width: '55.2px' }}
          >
            <Shirt className="h-5 w-5" />
            <span className="text-xs">스타일링</span>
          </button>
          <button
            onClick={() => handleNavigation("/my-page?tab=favorites")}
            className="flex flex-col items-center space-y-1 text-purple-600"
            style={{ height: '40px', width: '55.2px' }}
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs">마이페이지</span>
          </button>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  )
}
