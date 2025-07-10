"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStyling } from "@/app/context/StylingContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/ui/Header";
import { Check, User, DollarSign, Heart, Edit, Database, Sparkles } from "lucide-react"

export default function StylingSummary() {
  const { stylingData } = useStyling()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleEdit = () => {
    router.push("/styling-step1")
  }

  const handleSaveToDatabase = async () => {
    setIsLoading(true)

    // DB 저장용 데이터 구성 (Context 데이터 사용)
    const dataToSave = {
      personalColor: {
        type: stylingData.personalColor,
        description: stylingData.description,
        colors: stylingData.recommendedColors,
        colorNames: stylingData.colorNames,
      },
      basicInfo: {
        height: stylingData.userHeight,
        gender: stylingData.userGender,
        stylingRequest: stylingData.userStylingMemo,
      },
      budgetAndSize: {
        budget: stylingData.userBudget,
        occasions: stylingData.userMajorStyleSituations,
        topSize: stylingData.userTopSize,
        bottomSize: stylingData.userWaistSize, // 컨텍스트 필드에 맞게 수정
        shoeSize: stylingData.userShoeSize,
        bodyTypes: stylingData.userBodyType,
      },
      stylePreferences: {
        selectedStyles: stylingData.userPreferredStyle,
      },
      timestamp: new Date().toISOString(),
      userId: "user_" + Date.now(), // 실제로는 로그인된 사용자 ID 사용
    }

    try {
      // 여기서 실제 DB 저장 API 호출
      console.log("DB에 저장할 데이터:", dataToSave)

      // 임시로 localStorage에도 저장 (실제로는 DB 저장 후 제거)
      localStorage.setItem("savedStylingProfile", JSON.stringify(dataToSave))

      // 2초 후 결과 페이지로 이동 (DB 저장 시뮬레이션)
      setTimeout(() => {
        setIsLoading(false)
        router.push("/styling-results")
      }, 2000)
    } catch (error) {
      console.error("DB 저장 실패:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="styling" />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step Indicator */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-600 text-sm font-medium mb-4">
            <Check className="h-4 w-4 mr-2" />
            입력 완료
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            입력하신{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">정보</span>를
            확인해주세요
          </h1>
          <p className="text-lg text-gray-600">아래 정보가 맞다면 분석을 시작하겠습니다</p>
        </div>

        <div className="space-y-6">
          {/* 퍼스널컬러 */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">퍼스널컬러</h3>
              </div>
              <p className="text-gray-600 mb-4">진단 또는 선택하신 퍼스널컬러 정보</p>

              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{stylingData.personalColor || "정보 없음"}</h4>
                <p className="text-gray-600 text-sm mb-4">{stylingData.description || "정보 없음"}</p>
              </div>

              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">추천 색상</h5>
                <div className="flex flex-wrap gap-3">
                  {stylingData.recommendedColors?.map((color, index) => (
                    <div key={index} className="text-center">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm mb-1"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs text-gray-600">
                        {stylingData.colorNames?.[index] || `색상${index + 1}`}
                      </span>
                    </div>
                  )) || <span className="text-gray-500">추천 색상이 없습니다</span>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 기본 정보 */}
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">기본 정보</h3>
              </div>
              <p className="text-gray-600 mb-4">입력하신 기본 정보</p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-sm font-medium text-gray-700">키</span>
                  <p className="text-lg font-semibold text-gray-900">{stylingData.userHeight || "-"}cm</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">성별</span>
                  <p className="text-lg font-semibold text-gray-900">{stylingData.userGender || "-"}</p>
                </div>
              </div>

              {stylingData.userStylingMemo && (
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-700 block mb-2">스타일링 요청사항</span>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{stylingData.userStylingMemo}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 예산 및 사이즈 */}
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">예산 및 사이즈</h3>
              </div>
              <p className="text-gray-600 mb-4">설정하신 예산과 사이즈 정보</p>

              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">예산</span>
                  <p className="text-2xl font-bold text-green-600">{Number(stylingData.userBudget) / 10000 || 0}만원</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700 block mb-2">사이즈 정보</span>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center bg-gray-50 p-3 rounded-lg">
                      <span className="text-xs text-gray-500 block">상의</span>
                      <p className="font-semibold text-lg">{stylingData.userTopSize || "-"}</p>
                    </div>
                    <div className="text-center bg-gray-50 p-3 rounded-lg">
                      <span className="text-xs text-gray-500 block">하의(허리)</span>
                      <p className="font-semibold text-lg">{stylingData.userWaistSize || "-"} inch</p>
                    </div>
                    <div className="text-center bg-gray-50 p-3 rounded-lg">
                      <span className="text-xs text-gray-500 block">신발</span>
                      <p className="font-semibold text-lg">{stylingData.userShoeSize || "-"} mm</p>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700 block mb-2">주요 스타일 상황</span>
                  <div className="flex flex-wrap gap-2">
                    {stylingData.userMajorStyleSituations?.map((occasion) => (
                      <Badge key={occasion} variant="secondary" className="bg-blue-100 text-blue-800">
                        {occasion}
                      </Badge>
                    )) || <span className="text-gray-500">선택된 상황이 없습니다</span>}
                  </div>
                </div>

                {stylingData.userBodyType && stylingData.userBodyType.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700 block mb-2">체형 특징</span>
                    <div className="flex flex-wrap gap-2">
                      {stylingData.userBodyType.map((bodyType) => (
                        <Badge key={bodyType} variant="outline" className="border-gray-300">
                          {bodyType}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 스타일 선호도 */}
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                  <Heart className="h-4 w-4 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">스타일 선호도</h3>
              </div>
              <p className="text-gray-600 mb-4">선택하신 선호 스타일</p>

              <div className="flex flex-wrap gap-2">
                {stylingData.userPreferredStyle?.map((style) => (
                  <Badge key={style} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2">
                    {style}
                  </Badge>
                )) || <span className="text-gray-500">선택된 스타일이 없습니다</span>}
              </div>
            </CardContent>
          </Card>

          {/* 데이터 저장 안내 */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Database className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">데이터베이스 저장</h3>
              </div>
              <p className="text-gray-600 mb-4">
                위 정보들이 데이터베이스에 저장되어 개인화된 스타일링 추천에 활용됩니다.
              </p>
              <div className="bg-white/50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">저장될 정보:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 퍼스널컬러 진단 결과</li>
                  <li>• 기본 정보 (키, 성별, 요청사항)</li>
                  <li>• 예산 및 사이즈 정보</li>
                  <li>• 스타일 선호도</li>
                  <li>• 저장 시간 및 사용자 ID</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          <Button variant="outline" onClick={handleEdit} className="flex items-center px-6 py-3 bg-transparent">
            <Edit className="h-4 w-4 mr-2" />
            수정하기
          </Button>
          <Button
            onClick={handleSaveToDatabase}
            disabled={isLoading}
            className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                저장 중...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                분석 시작하기
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
