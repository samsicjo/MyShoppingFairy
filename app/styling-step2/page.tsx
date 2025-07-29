"use client"

import React from 'react'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStyling } from '../context/StylingContext'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Header } from '@/components/ui/Header' 
import { Footer } from '@/components/ui/Footer'
import { useModal } from "@/app/context/ModalContext"

const situationOptions = [
  { id: "출근/업무", label: "출근/업무", icon: "💼" },
  { id: "데이트", label: "데이트", icon: "💕" },
  { id: "일상/집", label: "일상/집", icon: "🏠" },
  { id: "파티/행사", label: "파티/행사", icon: "🎉" },
  { id: "여행", label: "여행", icon: "✈️" },
  { id: "운동/액티비티", label: "운동/액티비티", icon: "🏃‍" }
]

const bodyTypeOptions = [
  { id: "상체가 발달한 편", label: "상체가 발달한 편" },
  { id: "하체가 발달한 편", label: "하체가 발달한 편" },
  { id: "전체적으로 균형잡힌 편", label: "전체적으로 균형잡힌 편" },
  { id: "마른 편", label: "마른 편" },
  { id: "통통한 편", label: "통통한 편" },
  { id: "어깨가 넓은 편", label: "어깨가 넓은 편" },
]

const topSizeOptions = ["XS", "S", "M", "L", "XL", "XXL"]
const waistSizeOptions = Array.from({ length: 13 }, (_, i) => String(24 + i)) // 24-36
const shoeSizeOptions = Array.from({ length: 13 }, (_, i) => String(220 + i * 5)) // 220-280


export default function StylingStep2() {
  const { stylingData, setStylingData } = useStyling()
  const router = useRouter()
  const { openModal } = useModal()
  const [localBudget, setLocalBudget] = useState([stylingData.budget ? stylingData.budget / 10000 : 50])
  const [selectedSituations, setSelectedSituations] = useState<string[]>(stylingData.user_situation || [])
  const [topSize, setTopSize] = useState<string | ''>('')
  const [waistSize, setWaistSize] = useState<number | ''>('')
  const [shoeSize, setShoeSize] = useState<number | ''>('')
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>(stylingData.body_feature || [])

  useEffect(() => {
    setLocalBudget([stylingData.budget ? stylingData.budget / 10000 : 50])
    setSelectedSituations(stylingData.user_situation || [])
    setTopSize(stylingData.top_size || '')
    setWaistSize(stylingData.bottom_size || '')
    setShoeSize(stylingData.shoe_size || '')
    setSelectedBodyTypes(stylingData.body_feature || [])
  }, [stylingData])


  useEffect(() => {
    if (!stylingData.height) {
      openModal('오류', '이전 단계의 정보가 없습니다. 1단계부터 다시 진행해주세요.')
      router.push('/styling-step1')
    }
  }, [stylingData, router, openModal])

  // 이벤트 핸들러들을 Context 로직에 맞게 수정합니다.
  const handleSituationChange = React.useCallback((situationId: string) => {
    setSelectedSituations(prev =>
      prev.includes(situationId)
        ? prev.filter(id => id !== situationId)
        : [...prev, situationId]
    )
  }, [])

  const handleBodyTypeChange = React.useCallback((bodyTypeId: string) => {
    setSelectedBodyTypes(prev =>
      prev.includes(bodyTypeId)
        ? prev.filter(id => id !== bodyTypeId)
        : [...prev, bodyTypeId]
    )
  }, [])

  // '다음' 버튼 클릭 시 Context에 데이터를 저장합니다.
  const handleNext = () => {
    setStylingData(prevData => ({
      ...prevData,
      budget: localBudget[0]*10000,
      user_situation: selectedSituations,
      top_size: topSize,
      bottom_size: waistSize as number,
      shoe_size: shoeSize as number,
      body_feature: selectedBodyTypes,
    }))
    router.push("/styling-step3")
  }

  const handleBack = () => {
    router.push("/styling-step1")
  }

  const isFormValid = selectedSituations.length > 0 && topSize && waistSize && shoeSize

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="styling" />

      {/* Progress Steps */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="flex items-center space-x-16">
              {/* Step 1 - Completed */}
              <div className="flex flex-col items-center relative">
                <div className="w-6 h-6 rounded-full mb-3" style={{ backgroundColor: '#E8B5B8' }}></div>
                <span className="text-sm text-gray-900 font-medium">1 기본정보</span>
              </div>

              {/* Step 2 - Active */}
              <div className="flex flex-col items-center relative">
                <div className="w-6 h-6 rounded-full mb-3" style={{ backgroundColor: '#E8B5B8' }}></div>
                <span className="text-sm text-gray-900 font-medium">2 예산&사이즈</span>
                {/* Active underline */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 rounded-full" style={{ backgroundColor: '#E8B5B8' }}></div>
              </div>

              {/* Step 3 - Inactive */}
              <div className="flex flex-col items-center relative">
                <div className="w-6 h-6 bg-gray-300 rounded-full mb-3 border-2 border-gray-400"></div>
                <span className="text-sm text-gray-400">3 스타일 선호도</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            예산과 사이즈를 알려주세요
          </h1>
          <p className="text-gray-500">더 정확한 스타일링 추천을 위해 필요한 정보입니다</p>
        </div>

        {/* Form Content */}
        <div className="max-w-5xl mx-auto">
          <div className="space-y-12">
            {/* Budget Section */}
            <div className="border border-[#E3DEE0] rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="inline-flex items-center justify-center w-6 h-6 bg-pink-100 rounded-full mr-3">
                  <span className="text-pink-500 text-xs">👤</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">예산 설정</h2>
              </div>
              <p className="text-gray-500 text-sm mb-8">개인 맞춤 추천을 위한 기본 정보를 입력해주세요</p>

              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0 md:w-48">
                  <span className="text-base font-semibold text-gray-900">스타일링 예산 : {localBudget[0]}만원</span>
                </div>
                <div className="flex-1 flex justify-end">
                  <div className="flex flex-col space-y-4 w-full md:w-auto">
                    {/* Quick Budget Selection Buttons */}
                    <div className="flex gap-2 justify-end">
                      {[10, 25, 50, 100, 150].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setLocalBudget([amount])}
                          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${localBudget[0] === amount
                            ? 'bg-[#E8B5B8] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {amount} 만원
                        </button>
                      ))}
                    </div>

                    {/* Slider Row */}
                    <div className="flex items-center space-x-4 justify-end">
                      <div className="flex-1 max-w-md">
                        <Slider
                          value={localBudget}
                          onValueChange={setLocalBudget}
                          max={200}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div className="flex-shrink-0 w-20">
                        <span className="text-sm text-gray-500">{(localBudget[0] * 10000).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Occasions Section */}
            <div className="border border-[#E3DEE0] rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="inline-flex items-center justify-center w-6 h-6 bg-pink-100 rounded-full mr-3">
                  <span className="text-pink-500 text-xs">👔</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">주요 스타일링 상황</h2>
              </div>
              <p className="text-gray-500 text-sm mb-8">개인 맞춤 추천을 위한 기본 정보를 입력해주세요</p>

              <div className="grid grid-cols-3 gap-3">
                {situationOptions.map((situation) => (
                  <div
                    key={situation.id}
                    className="flex items-center p-3 rounded-lg border border-[#E3DEE0] bg-white hover:border-gray-300 transition-colors"
                  >
                    <Checkbox
                      id={situation.id}
                      checked={selectedSituations.includes(situation.id)}
                      onCheckedChange={() => handleSituationChange(situation.id)}
                      className="mr-3"
                    />
                    <label
                      htmlFor={situation.id}
                      className="flex items-center cursor-pointer flex-1"
                    >
                      <span className="text-lg mr-2">{situation.icon}</span>
                      <span className="text-sm font-medium text-gray-900">{situation.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Information Section */}
            <div className="border border-[#E3DEE0] rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="inline-flex items-center justify-center w-6 h-6 bg-pink-100 rounded-full mr-3">
                  <span className="text-pink-500 text-xs">📏</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">사이즈 정보</h2>
              </div>
              <p className="text-gray-500 text-sm mb-8">개인 맞춤 추천을 위한 기본 정보를 입력해주세요</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Top Size */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">
                    상의 사이즈 <span className="text-red-500">*</span>
                  </Label>
                  <Select value={topSize} onValueChange={setTopSize}>
                    <SelectTrigger className="h-12 border-[#E3DEE0]" style={{ '--tw-ring-color': '#E8B5B8' } as React.CSSProperties}>
                      <SelectValue placeholder="사이즈 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {topSizeOptions.map(size => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Waist Size */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">
                    허리 사이즈 <span className="text-red-500">*</span>
                  </Label>
                  <Select value={String(waistSize)} onValueChange={(value) => setWaistSize(Number(value))}>
                    <SelectTrigger className="h-12 border-[#E3DEE0]" style={{ '--tw-ring-color': '#E8B5B8' } as React.CSSProperties}>
                      <SelectValue placeholder="사이즈 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {waistSizeOptions.map(size => (
                        <SelectItem key={size} value={size}>
                          {size}인치
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Shoe Size */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">
                    신발 사이즈 <span className="text-red-500">*</span>
                  </Label>
                  <Select value={String(shoeSize)} onValueChange={(value) => setShoeSize(Number(value))}>
                    <SelectTrigger className="h-12 border-[#E3DEE0]" style={{ '--tw-ring-color': '#E8B5B8' } as React.CSSProperties}>
                      <SelectValue placeholder="사이즈 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {shoeSizeOptions.map(size => (
                        <SelectItem key={size} value={size}>
                          {size}mm
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Body Type Section */}
            <div className="border border-[#E3DEE0] rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="inline-flex items-center justify-center w-6 h-6 bg-pink-100 rounded-full mr-3">
                  <span className="text-pink-500 text-xs">👤</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">체형 특징</h2>
              </div>
              <p className="text-gray-500 text-sm mb-8">해당하는 체형 특징을 선택해주세요 (복수 선택 가능)</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {bodyTypeOptions.map((bodyType) => (
                  <div
                    key={bodyType.id}
                    className="flex items-center p-3 rounded-lg border border-[#E3DEE0] bg-white hover:border-gray-300 transition-colors"
                  >
                    <Checkbox
                      id={bodyType.id}
                      checked={selectedBodyTypes.includes(bodyType.id)}
                      onCheckedChange={() => handleBodyTypeChange(bodyType.id)}
                      className="mr-3"
                    />
                    <label
                      htmlFor={bodyType.id}
                      className="flex items-center cursor-pointer flex-1"
                    >
                      <span className="text-sm font-medium text-gray-900">{bodyType.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12">
              <Button
                onClick={handleBack}
                variant="outline"
                className="px-8 py-3 border-[#E8B5B8] text-[#171212] hover:bg-[#E8B5B8] hover:text-white font-medium rounded-full transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                이전 단계
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isFormValid}
                className="px-8 py-3 bg-[#E8B5B8] hover:bg-[#CE8CA5] text-white font-medium rounded-full transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                다음 단계
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  )
}
