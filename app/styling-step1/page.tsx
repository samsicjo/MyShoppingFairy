"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/ui/Header";
import { OptimizedTextarea } from "@/components/OptimizedTextarea"; // Import the new component
import { User, ArrowLeft, Loader2 } from "lucide-react"
import { useStyling, Gender } from '../context/StylingContext'
import { useAuth } from '@/app/context/AuthContext' // useAuth 훅 임포트

const heightOptions = Array.from({ length: 61 }, (_, i) => 140 + i);

export default function StylingStep1() {
  const { stylingData, setStylingData } = useStyling();
  
  const router = useRouter()
  const [height, setHeight] = useState<number | ''>(stylingData.height || '')
  const [gender, setGender] = useState<string | null>(stylingData.gender || null)
  const isButtonDisabled = height === '' || gender === null;
  const [isPersonalColorLoading, setIsPersonalColorLoading] = useState(true); // 퍼스널 컬러 로딩 상태
  const [isStylingDataLoading, setIsStylingDataLoading] = useState(true); // 스타일링 데이터 로딩 상태

  const { userId } = useAuth(); // userId 가져오기

  useEffect(() => {
    if (!userId) {
      // userId가 없으면 로그인 페이지로 리다이렉트하거나 에러 처리
      router.push("/login");
      return;
    }

    const fetchPersonalColor = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/users/user_info_personal?user_id=${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.personal_color_name) {
            setStylingData(prevData => ({
              ...prevData,
              personalColor: data.personal_color_name,
              description: data.description,
              recommendedColors: data.recommended_colors,
              colorNames: data.color_names,
            }));
          } else {
            alert('퍼스널 컬러 진단이 필요합니다.');
            router.push('/personal-color-diagnosis');
          }
        } else if (response.status === 404) {
          alert('퍼스널 컬러 진단이 필요합니다.');
          router.push('/personal-color-diagnosis');
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch personal color:", errorData);
          alert('퍼스널 컬러 정보를 불러오는 데 실패했습니다.');
          router.push('/personal-color-diagnosis');
        }
      } catch (error) {
        console.error("Error fetching personal color:", error);
        alert('퍼스널 컬러 정보를 불러오는 중 오류가 발생했습니다.');
        router.push('/personal-color-diagnosis');
      } finally {
        setIsPersonalColorLoading(false);
      }
    };

    const fetchStylingSummary = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/users/styling_summary_info?user_id=${userId}`);
        if (response.ok) {
          const data = await response.json();
          // API 응답 필드명과 StylingData 인터페이스 필드명 매핑
          setStylingData(prevData => ({
            ...prevData,
            budget: data.budget || 0,
            occasion: data.occasion || '',
            height: data.height || 0,
            gender: data.gender || "",
            top_size: data.top_size || "",
            bottom_size: data.bottom_size || 0,
            shoe_size: data.shoe_size || 0,
            body_feature: data.body_feature || [],
            preferred_styles: data.preferred_styles || [],
            user_situation: data.user_situation || [],
          }));
        } else if (response.status === 404) {
          console.log("Styling summary not found for user. This is normal for new users.");
          // 데이터가 없으면 StylingContext의 해당 필드들을 기본값으로 유지
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch styling summary:", errorData);
          alert('스타일링 요약 정보를 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error("Error fetching styling summary:", error);
        alert('스타일링 요약 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsStylingDataLoading(false);
      }
    };

    fetchPersonalColor();
    fetchStylingSummary();

    sessionStorage.removeItem('styleRecommendations');
    console.log("step1 : ", stylingData)
    console.log("StylingStep1: sessionStorage cleared for 'styleRecommendations'.");
  }, [userId, router, setStylingData]);

  useEffect(() => {
    setHeight(stylingData.height || '');
    setGender(stylingData.gender || null);
  }, [stylingData]);

  const handleMemoSave = (value: string) => {
    setStylingData(prevData => ({
      ...prevData,
      occasion: value,
    }));
  };

  if (isPersonalColorLoading || isStylingDataLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
        <p className="ml-4 text-lg">퍼스널 컬러, 사용자 정보를 불러오는 중...</p>
      </div>
    );
  }



  const handleNextStep = () => {
    if (isButtonDisabled) { // 유효성 검사
      alert('키와 성별을 모두 입력해주세요.');
      return;
    }
    setStylingData(prevData => ({ // setStylingData를 사용해서 새로운 데이터 추가.
      ...prevData, // 이전 단계(퍼스널 컬러)에서 저장된 데이터를 그대로 유지
      height: height,
      gender: gender,
    }));
    router.push('/styling-step2'); // 다음 페이지로 이동
  }

  const handleBackToDashboard = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="styling" />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
            {/* Step 1 - Active */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <span className="ml-3 text-purple-600 font-medium">기본 정보</span>
            </div>

            {/* Step 2 - Inactive */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                2
              </div>
              <span className="ml-3 text-gray-500">예산 & 사이즈</span>
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

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              기본 정보
            </span>
            를 입력해주세요
          </h1>
          <p className="text-lg text-gray-600">맞춤형 코디 추천을 위한 기본 정보가 필요해요</p>
        </div>

        {/* Form Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-xl max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-bold text-gray-900">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mr-3">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              기본정보
            </CardTitle>
            <p className="text-gray-600">개인 맞춤 추천을 위한 기본 정보를 입력해주세요</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 키 입력 */}
              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm font-medium text-gray-700">
                  키 (cm) <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={String(height)}
                  onValueChange={(value: string) => setHeight(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="키를 선택해주세요"/>
                  </SelectTrigger>
                  <SelectContent>
                    {/* 1단계에서 만든 heightOptions 배열을 map으로 돌려 선택지를 만듭니다. */}
                    {heightOptions.map(h => (
                      <SelectItem key={h} value={String(h)}>
                        {h} cm
                      </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 성별 선택 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  성별 <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={gender !== null ? String(gender) : ''}
                  onValueChange={(value: string) => setGender(String(value) as Gender)}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={String(Gender.Female)} id="female" />
                    <Label htmlFor="female" className="cursor-pointer">
                      여성
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={String(Gender.Male)} id="male" />
                    <Label htmlFor="male" className="cursor-pointer">
                      남성
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={String(Gender.Other)} id="other" />
                    <Label htmlFor="other" className="cursor-pointer">
                      기타
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* 스타일링 요청/메모 */}
            <OptimizedTextarea
              id="stylingRequest"
              label="스타일링 요청/메모"
              placeholder="특별한 요청사항이나 선호하는 스타일에 대해 자유롭게 작성해주세요..."
              initialValue={stylingData.occasion || ''}
              maxLength={225}
              onSave={handleMemoSave}
              description="원하는 스타일, 피하고 싶은 스타일, 특별한 요청사항 등을 자유롭게 작성해주세요"
            />

            {/* 다음 단계 버튼 */}
            <Button
              onClick={handleNextStep}
              disabled={isButtonDisabled}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 mt-8"
            >
              다음 단계
            </Button>
          </CardContent>
        </Card>

        {/* Back to Dashboard Link */}
        <div className="text-center mt-8">
          <button
            onClick={handleBackToDashboard}
            className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}
