"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/ui/Header";
import { Footer } from '@/components/ui/Footer';
import { OptimizedTextarea } from "@/components/OptimizedTextarea"; // Import the new component
import { User, ArrowLeft, Loader2 } from "lucide-react"
import { useStyling, Gender } from '../context/StylingContext'
import { useAuth } from '@/app/context/AuthContext'
import { useModal } from "@/app/context/ModalContext";
import { useStyleData } from '@/app/context/StyleDataContext'; // Add this import

const heightOptions = Array.from({ length: 61 }, (_, i) => 140 + i);

export default function StylingStep1() {
  const { stylingData, setStylingData } = useStyling();
  const { openModal } = useModal();
  const { clearRecommendations } = useStyleData(); // Add this line
  
  const router = useRouter()
  const [height, setHeight] = useState<number | ''>(stylingData.height || '')
  const [gender, setGender] = useState<string | null>(stylingData.gender || null)
  const isButtonDisabled = height === '' || gender === null;
  const [isPersonalColorLoading, setIsPersonalColorLoading] = useState(true); // 퍼스널 컬러 로딩 상태
  const [isStylingDataLoading, setIsStylingDataLoading] = useState(true); // 스타일링 데이터 로딩 상태
  const [hasRedirected, setHasRedirected] = useState(false); // 무한 루프 방지를 위한 상태 추가
  const mountedRef = useRef(false); // API 호출이 한 번만 실행되도록 하는 Ref

  const { userId } = useAuth(); // userId 가져오기

  useEffect(() => {
    if (!userId) {
      router.push("/login");
      return;
    }

    // 이미 리다이렉트가 시작되었으면 더 이상 진행하지 않음
    if (hasRedirected) {
      return;
    }

    // 컴포넌트가 처음 마운트될 때만 API 호출
    if (!mountedRef.current) {
      mountedRef.current = true; // 마운트되었음을 표시
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
              openModal('알림', '퍼스널 컬러 진단이 필요합니다.', () => router.push('/personal-color-diagnosis'));
              setHasRedirected(true); // 리다이렉트 시작 플래그 설정
            }
          } else if (response.status === 404) {
            openModal('알림', '퍼스널 컬러 진단이 필요합니다.', () => router.push('/personal-color-diagnosis'));
            setHasRedirected(true); // 리다이렉트 시작 플래그 설정
          } else {
            const errorData = await response.json();
            console.error("Failed to fetch personal color:", errorData);
            openModal('오류', '퍼스널 컬러 정보를 불러오는 데 실패했습니다.', () => router.push('/personal-color-diagnosis'));
            setHasRedirected(true); // 리다이렉트 시작 플래그 설정
          }
        } catch (error) {
          console.error("Error fetching personal color:", error);
          openModal('오류', '퍼스널 컬러 정보를 불러오는 중 오류가 발생했습니다.', () => router.push('/personal-color-diagnosis'));
          setHasRedirected(true); // 리다이렉트 시작 플래그 설정
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
            openModal('오류', '스타일링 요약 정보를 불러오는 데 실패했습니다.');
          }
        } catch (error) {
          console.error("Error fetching styling summary:", error);
          openModal('오류', '스타일링 요약 정보를 불러오는 중 오류가 발생했습니다.');
        } finally {
          setIsStylingDataLoading(false);
        }
      };

      fetchPersonalColor();
      fetchStylingSummary();
    }

    clearRecommendations();
    console.log("StylingStep1: clearRecommendations called.");
  }, [userId, router, setStylingData, hasRedirected, openModal]);

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
      openModal('알림', '키와 성별을 모두 입력해주세요.');
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="flex items-center space-x-16">
              {/* Step 1 - Active */}
              <div className="flex flex-col items-center relative">
                <div className="w-6 h-6 rounded-full mb-3" style={{ backgroundColor: '#E8B5B8' }}></div>
                <span className="text-sm text-gray-900 font-medium">1 기본정보</span>
                {/* Active underline */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 rounded-full" style={{ backgroundColor: '#E8B5B8' }}></div>
              </div>

              {/* Step 2 - Inactive */}
              <div className="flex flex-col items-center relative">
                <div className="w-6 h-6 bg-gray-300 rounded-full mb-3 border-2 border-gray-400"></div>
                <span className="text-sm text-gray-400">2 예산&사이즈</span>
              </div>

              {/* Step 3 - Inactive */}
              <div className="flex flex-col items-center relative">
                <div className="w-6 h-6 bg-gray-300 rounded-full mb-3 border-2 border-gray-400"></div>
                <span className="text-sm text-gray-400">3 스타일 선호도</span>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            기본 정보를 입력해주세요
          </h1>
          <p className="text-gray-500">맞춤형 코디 추천을 위한 기본 정보가 필요해요</p>
        </div>

        {/* Form Content */}
        <div className="max-w-5xl mx-auto">
          {/* 기본정보 카드 */}
          <div className="border border-[#E3DEE0] rounded-lg bg-white p-8">
            {/* Section Header */}
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <div className="inline-flex items-center justify-center w-6 h-6 bg-pink-100 rounded-full mr-3">
                  <User className="h-3 w-3 text-pink-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">기본정보</h2>
              </div>
              <p className="text-gray-500 text-sm ml-9">개인 맞춤 추천을 위한 기본 정보를 입력해주세요</p>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 키 입력 */}
                <div className="space-y-3">
                  <Label htmlFor="height" className="text-sm font-medium text-gray-900">
                    키 (cm) <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={String(height)}
                    onValueChange={(value: string) => setHeight(Number(value))}>
                    <SelectTrigger className="h-12 border-gray-200" style={{ '--tw-ring-color': '#E8B5B8' } as React.CSSProperties} onFocus={(e) => e.target.style.borderColor = '#E8B5B8'}>
                      <SelectValue placeholder="키를 선택해주세요" />
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
                  <Label className="text-sm font-medium text-gray-900">
                    성별 <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setGender(String(Gender.Female) as Gender)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${gender === String(Gender.Female)
                        ? 'bg-[#E8B5B8] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      style={gender === String(Gender.Female) ? { backgroundColor: '#E8B5B8' } : {}}
                    >
                      여성
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender(String(Gender.Male) as Gender)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${gender === String(Gender.Male)
                        ? 'bg-[#E8B5B8] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      남성
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender(String(Gender.Other) as Gender)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${gender === String(Gender.Other)
                        ? 'bg-[#E8B5B8] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      기타
                    </button>
                  </div>
                </div>
              </div>

              {/* 스타일링 요청/메모 */}
              <div className="space-y-3">
                <OptimizedTextarea
                  id="stylingRequest"
                  label="스타일링 요청/메모"
                  placeholder="특별한 요청사항이나 선호하는 스타일에 대해 자유롭게 작성해주세요..."
                  initialValue={stylingData.occasion || ''}
                  maxLength={225}
                  onSave={handleMemoSave}
                  description="원하는 스타일, 피하고 싶은 스타일, 특별한 요청사항 등을 자유롭게 작성해주세요"
                />
              </div>
            </div>
          </div>

          {/* 다음 단계 버튼 - 카드 밖으로 이동 */}
          <div className="flex justify-center mt-12">
            <Button
              onClick={handleNextStep}
              disabled={isButtonDisabled}
              className="px-12 py-3 bg-[#E8B5B8] hover:bg-[#CE8CA5] text-white font-medium rounded-full transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              다음 단계
            </Button>
          </div>
        </div>

        {/* Back to Dashboard Link */}
        <div className="text-center mt-8">
          <button
            onClick={handleBackToDashboard}
            className="inline-flex items-center text-[#82696B] hover:text-gray-600 transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            대시보드로 돌아가기
          </button>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  )
}
