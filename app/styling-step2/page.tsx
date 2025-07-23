"use client"

import React from 'react'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStyling } from '../context/StylingContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"
import SizeInformationSection from '@/components/SizeInformationSection';
import OccasionsSection from '@/components/OccasionsSection';
import BodyTypeSection from '@/components/BodyTypeSection';
import { Header } from '@/components/ui/Header'; // ADDED

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
  { id: "하체가 발달한 편", label: "하체가 발달한 편" },  { id: "전체적으로 균형잡힌 편", label: "전체적으로 균형잡힌 편" },
  { id: "마른 편", label: "마른 편" },
  { id: "통통한 편", label: "통통한 편" },
  { id: "키가 큰 편", label: "키가 큰 편" },
]

const topSizeOptions = ["XS", "S", "M", "L", "XL", "XXL"]
const waistSizeOptions = Array.from({ length: 13 }, (_, i) => String(24 + i)) // 24-36
const shoeSizeOptions = Array.from({ length: 13 }, (_, i) => String(220 + i * 5)) // 220-280


export default function StylingStep2() {
  const { stylingData, setStylingData } = useStyling()
  const router = useRouter()

  const [localBudget, setLocalBudget] = useState([stylingData.budget ? stylingData.budget / 10000 : 50]);
  const [selectedSituations, setSelectedSituations] = useState<string[]>(stylingData.user_situation || [])
  const [topSize, setTopSize] = useState<string | ''>('');
  const [waistSize, setWaistSize] = useState<number | ''>('');
  const [shoeSize, setShoeSize] = useState<number | ''>('');
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>(stylingData.body_feature || []);

  useEffect(() => {
    setLocalBudget([stylingData.budget ? stylingData.budget / 10000 : 50]);
    setSelectedSituations(stylingData.user_situation || []);
    setTopSize(stylingData.top_size || '');
    setWaistSize(stylingData.bottom_size || '');
    setShoeSize(stylingData.shoe_size || '');
    setSelectedBodyTypes(stylingData.body_feature || []);
  }, [stylingData]);


  useEffect(() => {
    if (!stylingData.height) {
      alert('이전 단계의 정보가 없습니다. 1단계부터 다시 진행해주세요.');
      router.push('/styling-step1');
    }
  }, [stylingData, router]);


  // 이벤트 핸들러들을 Context 로직에 맞게 수정합니다.
  const handleSituationChange = React.useCallback((situationId: string) => {
    setSelectedSituations(prev =>
      prev.includes(situationId)
        ? prev.filter(id => id !== situationId)
        : [...prev, situationId]
    );
  }, []);


  const handleBodyTypeChange = React.useCallback((bodyTypeId: string) => {
    setSelectedBodyTypes(prev =>
      prev.includes(bodyTypeId)
        ? prev.filter(id => id !== bodyTypeId)
        : [...prev, bodyTypeId]
    );
  }, []);

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
    }));
    router.push("/styling-step3");
  };

  const handleBack = () => {
    router.push("/styling-step1");
  };

  const isFormValid = selectedSituations.length > 0 && topSize && waistSize && shoeSize;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="styling" />

      {/* Progress Steps (Step 2 활성화) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
            {/* Step 1 - Completed */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <span className="ml-3 text-purple-600 font-medium">기본 정보</span>
            </div>

            {/* Step 2 - Active */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <span className="ml-3 text-purple-600 font-medium">예산 & 사이즈</span>
            </div>

            {/* Step 3 - Inactive */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                3
              </div>
              <span className="ml-3 text-gray-500">스타일 선호도</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            예산과{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">사이즈</span>를
            알려주세요
          </h1>
          <p className="text-lg text-gray-600">더 정확한 스타일링 추천을 위해 필요한 정보입니다</p>
        </div>

        <div className="space-y-8">
          {/* Budget Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">💰 예산 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium text-gray-700">
                  월 스타일링 예산: <span className="text-2xl font-bold text-purple-600">{localBudget[0]}만원</span>
                </Label>
                <div className="mt-4">
                  <Slider value={localBudget} onValueChange={setLocalBudget} max={200} min={10} step={1} className="w-full" />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>10만원</span>
                    <span>200만원</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <OccasionsSection
            selectedSituations={selectedSituations}
            onSituationChange={handleSituationChange}
            situationOptions={situationOptions}
          />

          {/* Size Information Section */}
          <SizeInformationSection
            topSize={topSize}
            setTopSize={setTopSize}
            waistSize={waistSize}
            setWaistSize={setWaistSize}
            shoeSize={shoeSize}
            setShoeSize={setShoeSize}
            topSizeOptions={topSizeOptions}
            waistSizeOptions={waistSizeOptions}
            shoeSizeOptions={shoeSizeOptions}
          />

          <BodyTypeSection
            selectedBodyTypes={selectedBodyTypes}
            onBodyTypeChange={handleBodyTypeChange}
            bodyTypeOptions={bodyTypeOptions}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          <Button variant="outline" onClick={handleBack} className="flex items-center px-6 py-3 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            이전
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
            className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50"
          >
            다음
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
