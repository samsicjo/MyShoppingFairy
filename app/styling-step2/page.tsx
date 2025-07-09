"use client"

import React from 'react'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStyling, MajorStyleSituation, TopSize, BodyType } from '../context/StylingContext'
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
  { id: MajorStyleSituation.workStyle, label: "출근/업무", icon: "💼" },
  { id: MajorStyleSituation.date, label: "데이트", icon: "💕" },
  { id: MajorStyleSituation.daily, label: "일상/집", icon: "🏠" },
  { id: MajorStyleSituation.Party, label: "파티/행사", icon: "🎉" },
  { id: MajorStyleSituation.Travel, label: "여행", icon: "✈️" },
  { id: MajorStyleSituation.Active, label: "운동/액티비티", icon: "🏃‍" }
]


const bodyTypeOptions = [
  { id: BodyType.UpperBodyDominant, label: "상체가 발달한 편" },
  { id: BodyType.LowerBodyDominant, label: "하체가 발달한 편" },  { id: BodyType.Balanced, label: "전체적으로 균형잡힌 편" },
  { id: BodyType.Slim, label: "마른 편" },
  { id: BodyType.Chubby, label: "통통한 편" },
  { id: BodyType.Tall, label: "키가 큰 편" },
]

const topSizeOptions = Object.values(TopSize)
const waistSizeOptions = Array.from({ length: 13 }, (_, i) => String(24 + i)) // 24-36
const shoeSizeOptions = Array.from({ length: 13 }, (_, i) => String(220 + i * 5)) // 220-280


export default function StylingStep2() {
  const { stylingData, setStylingData } = useStyling()
  const router = useRouter()

  const [localBudget, setLocalBudget] = useState([50]);
  const [selectedSituations, setSelectedSituations] = useState<MajorStyleSituation[]>([])
  const [topSize, setTopSize] = useState<TopSize | ''>('');
  const [waistSize, setWaistSize] = useState<number | ''>('');
  const [shoeSize, setShoeSize] = useState<number | ''>('');
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<BodyType[]>([]);


  useEffect(() => {
    if (!stylingData.userHeight) {
      alert('이전 단계의 정보가 없습니다. 1단계부터 다시 진행해주세요.');
      router.push('/styling-step1');
    }
  }, [stylingData, router]);


  // 이벤트 핸들러들을 Context 로직에 맞게 수정합니다.
  const handleSituationChange = React.useCallback((situationId: MajorStyleSituation) => {
    setSelectedSituations(prev =>
      prev.includes(situationId)
        ? prev.filter(id => id !== situationId)
        : [...prev, situationId]
    );
  }, []);


  const handleBodyTypeChange = React.useCallback((bodyTypeId: BodyType) => {
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
      userBudget: localBudget[0]*10000,
      userMajorStyleSituations: selectedSituations,
      userTopSize: topSize as TopSize,
      userWaistSize: waistSize as number,
      userShoeSize: shoeSize as number,
      userBodyType: selectedBodyTypes,
    }));
    router.push("/styling-step3");
  };

  const handleBack = () => {
    router.push("/styling-step1");
  };

  const isFormValid = selectedSituations.length > 0 && topSize && waistSize && shoeSize;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <Header activePage="styling" /> {/* MODIFIED */}

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-purple-600">Step 2 of 3</span>
          <span className="text-sm text-gray-500">67% 완료</span>
        </div>
        <Progress value={67} className="h-2" />
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