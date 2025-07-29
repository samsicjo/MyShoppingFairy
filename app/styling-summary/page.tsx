"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useStyling } from "@/app/context/StylingContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/ui/Header"
import { Footer } from '@/components/ui/Footer'
import { Check, User, DollarSign, Heart, Edit, Database, Loader2, Palette } from "lucide-react"
import { useAuth } from "@/app/context/AuthContext"
import { useModal } from "@/app/context/ModalContext"
import { getFlexibleColorPalette } from "@/components/data/personalColorData"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function StylingSummary() {
  const { stylingData, setStylingData } = useStyling()
  const { userId } = useAuth()
  const { openModal } = useModal()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [usePersonalColor, setUsePersonalColor] = useState(true)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const saveStylingSummaryToDatabase = async (): Promise<any | null> => {
    if (userId === null) {
      openModal("로그인 필요", "로그인이 필요한 기능입니다.")
      return null
    }

    setIsSaving(true)

    const dataToSave = {
      budget: stylingData.budget || 0,
      occasion: Array.isArray(stylingData.occasion) ? stylingData.occasion.join(', ') : stylingData.occasion || '',
      height: stylingData.height || 0,
      gender: stylingData.gender || "",
      top_size: stylingData.top_size || "",
      bottom_size: stylingData.bottom_size || 0,
      shoe_size: stylingData.shoe_size || 0,
      body_feature: stylingData.body_feature || [],
      preferred_styles: stylingData.preferred_styles || [],
      user_situation: stylingData.user_situation || [], // 이 줄을 추가합니다.
    }

    try {
      const checkResponse = await fetch(`http://127.0.0.1:8000/users/styling_summary_info?user_id=${userId}`)

      let method: 'POST' | 'PATCH'
      let url: string

      if (checkResponse.ok) {
        method = 'PATCH'
        url = `http://127.0.0.1:8000/users/styling_summary_update?user_id=${userId}`
      } else if (checkResponse.status === 404) {
        method = 'POST'
        url = `http://127.0.0.1:8000/users/styling_summary_create?user_id=${userId}`
      } else {
        const errorData = await checkResponse.json()
        throw new Error(errorData.detail || '스타일 정보 확인에 실패했습니다.')
      }

      const saveResponse = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      })

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json()
        let errorMessage = '스타일 정보 저장에 실패했습니다.'
        if (errorData && errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((err: any) => err.msg).join(', ')
          } else if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail
          } else {
            errorMessage = JSON.stringify(errorData.detail)
          }
        }
        throw errorMessage // Error 객체 대신 메시지 문자열 자체를 던집니다.
      }

      const savedData = await saveResponse.json()
      console.log(`Styling summary successfully ${method === 'PATCH' ? 'updated' : 'saved'}!`)
      return savedData // Return the saved data
    } catch (error: any) {
      console.error("스타일 정보 저장/업데이트 실패:", error)
      openModal("오류", `스타일 정보 저장/업데이트 중 오류가 발생했습니다: ${error}`)
      return null
    } finally {
      setIsSaving(false)
    }
  }

  const handleStartAnalysis = async () => {
    const savedData = await saveStylingSummaryToDatabase()
    if (savedData) {
      // Update the context with the latest data from the server
      setStylingData(prevData => ({
        ...prevData,
        budget: savedData.budget,
        occasion: savedData.occasion.split(', ').map((s: string) => s.trim()),
        height: savedData.height,
        gender: savedData.gender,
        top_size: savedData.top_size,
        bottom_size: savedData.bottom_size,
        shoe_size: savedData.shoe_size,
        body_feature: savedData.body_feature,
        preferred_styles: savedData.preferred_styles,
      }))
      const filterQuery = usePersonalColor ? 'filter=1' : 'filter=0';
      router.push(`/styling-results?${filterQuery}`)
    }
  }

  const handleEdit = () => {
    router.push("/styling-step1")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="styling" />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step Indicator */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-[#FFF9EE] rounded-full text-[#171212] text-sm font-medium mb-4">
            <Check className="h-4 w-4 mr-2" />
            입력 완료
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            입력하신 정보를 확인해주세요
          </h1>
          <p className="text-lg text-gray-600">아래 정보가 맞다면 분석을 시작하겠습니다</p>
        </div>

        <div className="space-y-6">
          {isClient ? (
            <>
              {/* 퍼스널컬러 */}
              <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                      <Palette className="h-4 w-4 text-[#171212]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">퍼스널컬러</h3>
                  </div>
                  <p className="text-gray-600 mb-4">진단 또는 선택하신 퍼스널컬러 정보</p>

                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{stylingData.personalColor || "정보 없음"}</h4>
                    <p className="text-gray-600 text-sm mb-4">{stylingData.description || "정보 없음"}</p>
                  </div>

                  <div className="mb-4">
                    <h5 className="text-lg font-medium text-gray-700 mb-3">추천 색상</h5>
                    <div className="flex flex-wrap gap-3">
                      {(() => {
                        if (!stylingData.personalColor) {
                          return <span className="text-gray-500">퍼스널컬러 정보가 없습니다</span>
                        }

                        const colorPalette = getFlexibleColorPalette(stylingData.personalColor)
                        const selectedColors = colorPalette.slice(0, 3) // 3가지 색상만 선택

                        if (selectedColors.length === 0) {
                          return <span className="text-gray-500">추천 색상이 없습니다</span>
                        }

                        return selectedColors.map((colorSwatch, index) => (
                          <div key={index} className="text-center w-16 flex flex-col items-center">
                            <div
                              className="w-8 h-8 rounded-full border-2 border-white shadow-sm mb-1"
                              style={{ backgroundColor: colorSwatch.color }}
                            />
                            <span className="text-xs text-gray-600 text-center leading-tight">
                              {colorSwatch.title}
                            </span>
                          </div>
                        ))
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 기본 정보 */}
              <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                      <User className="h-4 w-4 text-[#171212]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">기본 정보</h3>
                  </div>
                  <p className="text-gray-600 mb-4">입력하신 기본 정보</p>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-lg font-medium text-gray-700">키</span>
                      <p className="text-lg font-semibold text-gray-900">{stylingData.height || "-"}</p>
                    </div>
                    <div>
                      <span className="text-lg font-medium text-gray-700">성별</span>
                      <p className="text-lg font-semibold text-gray-900">{stylingData.gender || "-"}</p>
                    </div>
                  </div>

                  {stylingData.occasion && (
                    <div className="mt-4">
                      <span className="text-sm font-medium text-gray-700 block mb-2">스타일링 요청사항</span>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{stylingData.occasion}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 예산 및 사이즈 */}
              <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                      <DollarSign className="h-4 w-4 text-#171212" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">예산 및 사이즈</h3>
                  </div>
                  <p className="text-gray-600 mb-4">설정하신 예산과 사이즈 정보</p>

                  <div className="space-y-4">
                    <div>
                      <span className="text-lg font-medium text-gray-700">예산</span>
                      <p className="text-2xl font-bold text-[#171212]">{Number(stylingData.budget) / 10000 || 0}만원</p>
                    </div>

                    <div>
                      <span className="text-lg font-medium text-gray-700 block mb-2">사이즈 정보</span>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center bg-gray-50 p-3 rounded-lg">
                          <span className="text-xs text-gray-500 block">상의</span>
                          <p className="font-semibold text-lg">{stylingData.top_size || "-"}</p>
                        </div>
                        <div className="text-center bg-gray-50 p-3 rounded-lg">
                          <span className="text-xs text-gray-500 block">하의(허리)</span>
                          <p className="font-semibold text-lg">{stylingData.bottom_size || "-"} inch</p>
                        </div>
                        <div className="text-center bg-gray-50 p-3 rounded-lg">
                          <span className="text-xs text-gray-500 block">신발</span>
                          <p className="font-semibold text-lg">{stylingData.shoe_size || "-"} mm</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-lg font-medium text-gray-700 block mb-2">주요 스타일 상황</span>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(stylingData.user_situation) ? stylingData.user_situation : []).map((user_situation) => (
                          <Badge key={user_situation} variant="secondary" className="bg-[#FFF9EE] text-[#171212] shadow-xl pointer-events-none">
                            {user_situation}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {stylingData.body_feature && stylingData.body_feature.length > 0 && (
                      <div>
                        <span className="text-lg font-medium text-gray-700 block mb-2">체형 특징</span>
                        <div className="flex flex-wrap gap-2">
                          {stylingData.body_feature.map((bodyType) => (
                            <Badge key={bodyType} variant="outline" className="bg-[#FFF9EE] text-[#171212] shadow-xl">
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
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                      <Heart className="h-4 w-4 text-#171212" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">스타일 선호도</h3>
                  </div>
                  <p className="text-lg text-gray-600 mb-4">선택하신 선호 스타일</p>

                  <div className="flex flex-wrap gap-2">
                    {stylingData.preferred_styles?.map((styleId) => {
                      const styleOptions = [
                        { id: "캐주얼", name: "캐주얼", emoji: "👕" },
                        { id: "스트릿", name: "스트릿", emoji: "🛹" },
                        { id: "고프코어", name: "고프코어", emoji: "🏔️" },
                        { id: "워크웨어", name: "워크웨어", emoji: "👔" },
                        { id: "프레피", name: "프레피", emoji: "🎓" },
                        { id: "시티보이", name: "시티보이", emoji: "🏙️" },
                        { id: "스포티", name: "스포티", emoji: "⚽" },
                        { id: "로맨틱", name: "로맨틱", emoji: "🌸" },
                        { id: "걸리시", name: "걸리시", emoji: "💪" },
                        { id: "클래식", name: "클래식", emoji: "👗" },
                        { id: "미니멀", name: "미니멀", emoji: "⚪" },
                        { id: "시크", name: "시크", emoji: "🖤" },
                        { id: "레트로", name: "레트로", emoji: "📻" },
                        { id: "에스닉", name: "에스닉", emoji: "🌍" },
                        { id: "리조트", name: "리조트", emoji: "🏖️" },
                      ]
                      const style = styleOptions.find((s) => s.id === styleId)
                      return (
                        <Badge
                          key={styleId}
                          className="bg-[#FFF9EE] text-[#171212] px-3 py-1 text-sm shadow-xl pointer-events-none"
                        >
                          {style?.emoji} {style?.name}
                        </Badge>
                      )
                    }) || <span className="text-gray-500">선택된 스타일이 없습니다</span>}
                  </div>
                </CardContent>
              </Card>

              {/* 데이터 저장 안내 */}
              <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                      <Database className="h-4 w-4 text-#171212" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">데이터베이스 저장</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    위 정보들이 데이터베이스에 저장되어 개인화된 스타일링 추천에 활용됩니다.
                  </p>
                  <div className="text-left bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">저장될 정보:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-[#E8B5B8] border border-gray-300 mr-2 flex-shrink-0"></div>
                        퍼스널컬러 진단 결과
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-[#E8B5B8] border border-gray-300 mr-2 flex-shrink-0"></div>
                        기본 정보 (키, 성별, 요청사항)
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-[#E8B5B8] border border-gray-300 mr-2 flex-shrink-0"></div>
                        예산 및 사이즈 정보
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-[#E8B5B8] border border-gray-300 mr-2 flex-shrink-0"></div>
                        스타일 선호도
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-[#E8B5B8] border border-gray-300 mr-2 flex-shrink-0"></div>
                        저장 시간 및 사용자 ID
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center text-gray-500">데이터를 불러오는 중...</div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-12">
          <Button variant="outline" onClick={handleEdit} className="px-8 py-3 bg-[#F5F2F2] border-[#F5F2F2] text-[#171212] hover:bg-[#d8a5a8] hover:text-[#171212] font-medium rounded-full transition-colors duration-200">
            <Edit className="h-4 w-4 mr-2" />
            수정하기
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="personal-color-checkbox" 
                checked={usePersonalColor}
                onCheckedChange={() => setUsePersonalColor(!usePersonalColor)}
                className="hidden" // Hide the default checkbox
              />
              <Label 
                htmlFor="personal-color-checkbox"
                className={`flex items-center px-8 py-3 font-medium rounded-full transition-colors duration-200 cursor-pointer \
                  ${usePersonalColor 
                    ? 'bg-[#E8B5B8] text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`
                }
              >
                <Palette className="h-4 w-4 mr-2" />
                  퍼스널 컬러 기반으로 검색
              </Label>
            </div>
            <Button
              onClick={handleStartAnalysis}
              disabled={isSaving}
              className="px-8 py-3 bg-[#E8B5B8] hover:bg-[#CE8CA5] text-white font-medium rounded-full transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              {isSaving ? "분석 중..." : "분석 시작하기"}
            </Button>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  )
}

