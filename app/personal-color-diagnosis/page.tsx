"use client"


import { useEffect } from 'react';
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/Header";
import { Camera, Palette } from "lucide-react"
import { useStyleData } from '../context/StyleDataContext';

export default function PersonalColorDiagnosis() {
  const router = useRouter()
  const { clearRecommendations } = useStyleData();

  useEffect(() => {
    // 진단 프로세스의 첫 단계이므로, 이전 추천 데이터를 모두 초기화합니다.
    clearRecommendations();
  }, []); // 페이지가 처음 마운트될 때 한 번만 실행합니다.

  const handleAIDiagnosis = () => {
    router.push("/personal-color-image-upload")
  }

  const handleDirectSelection = () => {
    router.push("/personal-color-select")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="personal-color" />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            퍼스널컬러 진단
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            당신에게 가장 잘 어울리는 색상을 찾아보세요. AI가 분석하거나 직접 선택할 수 있어요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* AI 자동 진단 */}
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <Camera className="h-10 w-10 text-purple-600" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI 자동 진단</h3>
              <p className="text-gray-600 mb-6">사진을 업로드하여 AI가 자동으로 퍼스널컬러를 분석해드려요</p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  정확한 AI 분석
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  빠른 결과 확인
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  객관적인 진단
                </div>
              </div>

              <Button
                onClick={handleAIDiagnosis}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-full font-medium"
              >
                사진으로 진단하기
              </Button>
            </CardContent>
          </Card>

          {/* 직접 선택 */}
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <Palette className="h-10 w-10 text-purple-600" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">직접 선택</h3>
              <p className="text-gray-600 mb-6">이미 퍼스널컬러를 알고 계신다면 직접 선택해주세요</p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  8가지 타입 중 선택
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  즉시 결과 확인
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  간편한 선택
                </div>
              </div>

              <Button
                onClick={handleDirectSelection}
                variant="outline"
                className="w-full border-2 border-purple-200 text-purple-600 hover:bg-purple-50 py-3 rounded-full font-medium bg-transparent"
              >
                직접 선택하기
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 퍼스널컬러란? */}
        <div className="text-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <span className="text-white font-bold text-lg">💡</span>
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-3">퍼스널컬러란?</h4>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            개인의 피부톤, 눈동자, 머리카락 색상과 조화를 이루어 가장 아름답게 보이게 하는 색상 그룹입니다.
            <br />
            올바른 퍼스널컬러를 찾으면 더욱 생기 있고 매력적인 모습을 연출할 수 있어요.
          </p>
        </div>
      </div>
    </div>
  )
}

