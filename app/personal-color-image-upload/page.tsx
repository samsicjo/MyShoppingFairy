"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/ui/Header";
import { Camera, Upload, Sparkles, CheckCircle, RefreshCw, Lightbulb } from "lucide-react"
import { useStyling } from '../context/StylingContext'
import { useAuth } from '@/app/context/AuthContext'
import { getFlexible3x3ColorPalette, getOppositeColorType, convertToKebabCase, isValidPersonalColorType } from "@/components/data/personalColorData"

export default function PersonalColorImageUpload() {
  const { stylingData, setStylingData } = useStyling()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [hasApiResult, setHasApiResult] = useState(false) // API 결과가 있는지 확인
  const [colorResult, setColorResult] = useState<string[]>([])
  const [colorNameResult, setColorNameResult] = useState<string[]>([])
  const [personalColorResult, setPersonalColorResult] = useState<string | undefined>()
  const [descriptionResult, setDescriptionResult] = useState<string | undefined>()

  const [result, setResult] = useState<{
    personalColor: string
    confidence: number
    description: string
    recommendedColors: string[]
  } | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const { userId } = useAuth()

  useEffect(() => {
    if (personalColorResult && colorResult.length > 0) {
      setStylingData({
        personalColor: personalColorResult,
        description: descriptionResult,
        recommendedColors: colorResult,
        colorNames: colorNameResult,
      })
    }
  }, [personalColorResult, descriptionResult, colorResult, colorNameResult, setStylingData])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImageFile(file) // 파일 객체 저장

    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadedImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDiagnosis = async () => {
    if (!imageFile || !userId) {
      alert("이미지를 업로드하거나 로그인해야 합니다.");
      return;
    }

    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("user_id", String(userId));

    try {
      const response = await fetch(`http://127.0.0.1:8000/personal/analyze-all?user_id=${userId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.personal_color_analysis || 'AI 분석 실패');
      }

      const responseData = await response.json();
      let analysisResult;

      try {
        // 백엔드에서 JSON 문자열을 반환할 것으로 예상하고 파싱 시도
        analysisResult = JSON.parse(responseData.personal_color_analysis);
      } catch (e) {
        // JSON 파싱 실패 시, personal_color_analysis가 단순 문자열이라고 가정하고 객체 구성
        console.warn("personal_color_analysis is not valid JSON. Treating as plain personal color name.", responseData.personal_color_analysis);
        analysisResult = {
          personalColor: responseData.personal_color_analysis, // 단순 문자열을 personalColor로 사용
          description: "분석 결과 설명이 제공되지 않았습니다.", // 기본 설명
          recommendedColors: [], // 빈 배열
          colorNames: [], // 빈 배열
          confidence: 0, // 기본값
        };
      }

      // 유효한 퍼스널 컬러 타입인지 검증
      console.log('API에서 받은 퍼스널 컬러 타입:', analysisResult.personalColor);
      console.log('유효성 검증 결과:', isValidPersonalColorType(analysisResult.personalColor));
      
      if (!isValidPersonalColorType(analysisResult.personalColor)) {
        console.log('유효하지 않은 퍼스널 컬러 타입:', analysisResult.personalColor);
        throw new Error('오류가 발생했습니다. 다시 시도해주세요.');
      }

      setResult(analysisResult);
      setHasApiResult(true); // API 결과가 있음을 표시
      setIsAnalyzing(false);
      setShowResult(true);

      localStorage.setItem(
        "personalColorAnalysis",
        JSON.stringify({
          type: analysisResult.personalColor,
          description: analysisResult.description,
          colors: analysisResult.recommendedColors,
          colorNames: analysisResult.colorNames,
          confidence: analysisResult.confidence,
          analyzedAt: new Date().toISOString(),
        }),
      );

      setPersonalColorResult(analysisResult.personalColor);
      setColorResult(analysisResult.recommendedColors);
      setColorNameResult(analysisResult.colorNames);
      setDescriptionResult(analysisResult.description);

      // setTimeout(() => {
      //   router.push("/personal-color-drape-test");
      // }, 60000);
    } catch (error: any) {
      console.log('API 에러 발생, 모든 상태 초기화 중...');
      setHasApiResult(false); // API 실패 시 결과가 없음을 표시
      setShowResult(false); // 결과 화면 숨기기
      setResult(null); // 결과 객체 초기화
      setPersonalColorResult(undefined);
      setColorResult([]);
      setColorNameResult([]);
      setDescriptionResult(undefined);
      console.log('상태 초기화 완료 - hasApiResult: false, showResult: false');
      alert(error.message);
      console.error('AI analysis failed:', error);
      setIsAnalyzing(false);
    }
  }

  const triggerImageUpload = () => {
    imageInputRef.current?.click()
  }


  const resetUpload = () => {
    setUploadedImage(null)
    setShowResult(false)
    setIsAnalyzing(false)
    setResult(null)
    setHasApiResult(false)
    setColorResult([])
    setColorNameResult([])
    setPersonalColorResult(undefined)
    setDescriptionResult(undefined)

    // 상태 초기화 후 이미지 업로드 다이얼로그 열기
    setTimeout(() => {
      triggerImageUpload()
    }, 100) // 약간의 지연을 두어 상태 업데이트 후 실행되도록 함
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="personal-color" />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-left mb-12">
          <h1 className="text-4xl font-bold mb-4">
            AI 퍼스널 컬러 분석
          </h1>
          <p className="text-lg text-gray-600">사진을 업로드하시면 AI가 당신의 퍼스널 컬러를 정확하게 분석해드립니다</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {!uploadedImage ? (
            /* 업로드 전 - 점선 테두리 */
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div
                  className="relative cursor-pointer group border-2 border-dashed border-[#E3DEDE]"
                  onClick={triggerImageUpload}
                >
                  {/* 업로드 영역 */}
                  <div className="relative p-16 text-center">
                    {/* 메인 아이콘 - 배경 없음 */}
                    <div className="mx-auto mb-10 group-hover:scale-105 transition-transform duration-300">
                      <Camera className="h-24 w-24 text-[#F8B8D2] mx-auto" />
                    </div>

                    {/* 텍스트 */}
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">이미지를 업로드해주세요</h3>
                    <p className="text-xl text-gray-600 mb-10 max-w-lg mx-auto">
                      얼굴이 잘 보이는 정면 사진을 업로드하시면 더 정확한 분석이 가능합니다
                    </p>

                    {/* 버튼 */}
                    <Button
                      size="lg"
                      className="bg-[#F8B8D2] hover:bg-[#f5a6c6] text-white px-10 py-6 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                    >
                      <Upload className="h-6 w-6 mr-3" />
                      <span className="text-lg">사진 업로드</span>
                    </Button>

                    {/* 추가 안내 */}
                    <p className="mt-6 text-sm text-gray-500">
                      클릭하거나 이미지를 끌어다 놓으세요
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* 업로드 후 - 실선 테두리 */
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative border-2 border-solid border-[#E3DEDE]">
                  {/* 업로드 영역 */}
                  <div className="relative p-8 md:p-10">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-center flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">업로드된 이미지</h3>
                        <p className="text-gray-600">이미지가 선명하게 업로드되었습니다</p>
                      </div>
                      <Button
                        onClick={resetUpload}
                        variant="outline"
                        className="border-[#F8B8D2] text-[#F8B8D2] hover:bg-[#F8B8D2]/10"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        다시 업로드
                      </Button>
                    </div>

                    <div className="relative mb-8">
                      <div className="p-2 bg-white rounded-xl shadow-lg mx-auto max-w-md">
                        <img
                          src={uploadedImage || "/placeholder.svg?height=400&width=400"}
                          alt="Uploaded"
                          className="w-full rounded-lg"
                        />
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-500 text-white px-3 py-1 shadow-md">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          업로드 완료
                        </Badge>
                      </div>
                    </div>

                    <div className="text-center">
                      <Button
                        onClick={handleDiagnosis}
                        disabled={isAnalyzing || showResult}
                        size="lg"
                        className="bg-[#F8B8D2] hover:bg-[#f5a6c6] text-white px-10 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 text-lg"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                            AI 분석 중...
                          </>
                        ) : showResult ? (
                          <>
                            <CheckCircle className="h-6 w-6 mr-3" />
                            분석 완료
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-6 w-6 mr-3" />
                            분석하기
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isAnalyzing && (
            <div className="mt-8 text-center">
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="animate-pulse flex space-x-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    AI가 당신의 피부톤, 눈동자, 머리카락 색상을 분석하고 있습니다...
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={imageInputRef} />
          {showResult && result && hasApiResult && (
            <Card className="mt-8 bg-white/80 backdrop-blur-sm border-purple-100 shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  {/* 배경 그라데이션 효과 */}
                  <div className="absolute inset-0 bg-white"></div>

                  {/* 결과 영역 */}
                  <div className="relative p-8 md:p-10">

                    <div className="text-left mb-8">
                      <div className="w-20 h-20 bg-[#F8B8D2] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Sparkles className="h-10 w-10 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-3">분석 완료!</h2>
                    </div>

                    {/* 퍼스널 컬러 타입 결과 */}
                    {hasApiResult && (
                      <div className="text-left mb-8 mx-auto">
                        <h3 className="text-4xl font-bold text-[#F8B8D2] mb-4">
                          {personalColorResult}
                        </h3>
                        <div className="p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-md">
                          <p className="text-gray-700 text-lg leading-relaxed">{result.description}</p>

                          {/* 퍼스널 컬러 타입별 상세 설명 */}
                          {personalColorResult?.includes('Spring-Light') && (
                            <div className="mt-4 border-t pt-4 border-gray-200">
                              <h4 className="font-bold text-lg mb-2">봄 라이트(Spring-Light) 특징</h4>
                              <ul className="list-disc pl-5 space-y-2">
                                <li>밝고 화사한 톤으로 생기 넘치는 이미지를 연출합니다.</li>
                                <li>따뜻한 언더톤과 밝은 피부톤을 가진 분들에게 잘 어울립니다.</li>
                                <li>파스텔 톤의 밝은 색상이 잘 어울립니다.</li>
                              </ul>
                            </div>
                          )}

                          {personalColorResult?.includes('Spring-Bright') && (
                            <div className="mt-4 border-t pt-4 border-gray-200">
                              <h4 className="font-bold text-lg mb-2">봄 브라이트(Spring-Bright) 특징</h4>
                              <ul className="list-disc pl-5 space-y-2">
                                <li>선명하고 생동감 있는 톤으로 활기찬 이미지를 연출합니다.</li>
                                <li>따뜻한 언더톤과 생기 있는 피부톤을 가진 분들에게 잘 어울립니다.</li>
                                <li>선명하고 채도가 높은 색상이 잘 어울립니다.</li>
                              </ul>
                            </div>
                          )}

                          {personalColorResult?.includes('Summer-Light') && (
                            <div className="mt-4 border-t pt-4 border-gray-200">
                              <h4 className="font-bold text-lg mb-2">여름 라이트(Summer-Light) 특징</h4>
                              <ul className="list-disc pl-5 space-y-2">
                                <li>부드럽고 시원한 톤으로 청순하고 여성스러운 이미지를 연출합니다.</li>
                                <li>차가운 언더톤과 밝은 피부톤을 가진 분들에게 잘 어울립니다.</li>
                                <li>파스텔 톤의 부드러운 색상이 잘 어울립니다.</li>
                              </ul>
                            </div>
                          )}

                          {personalColorResult?.includes('Summer-Mute') && (
                            <div className="mt-4 border-t pt-4 border-gray-200">
                              <h4 className="font-bold text-lg mb-2">여름 뮤트(Summer-Mute) 특징</h4>
                              <ul className="list-disc pl-5 space-y-2">
                                <li>차분하고 우아한 톤으로 세련된 이미지를 연출합니다.</li>
                                <li>차가운 언더톤과 중간 톤의 피부를 가진 분들에게 잘 어울립니다.</li>
                                <li>채도가 낮은 뮤트한 색상이 잘 어울립니다.</li>
                              </ul>
                            </div>
                          )}

                          {personalColorResult?.includes('Autumn-Mute') && (
                            <div className="mt-4 border-t pt-4 border-gray-200">
                              <h4 className="font-bold text-lg mb-2">가을 뮤트(Autumn-Mute) 특징</h4>
                              <ul className="list-disc pl-5 space-y-2">
                                <li>따뜻하고 차분한 톤으로 편안하고 자연스러운 이미지를 연출합니다.</li>
                                <li>따뜻한 언더톤과 중간 톤의 피부를 가진 분들에게 잘 어울립니다.</li>
                                <li>채도가 낮은 어스 톤 색상이 잘 어울립니다.</li>
                              </ul>
                            </div>
                          )}

                          {personalColorResult?.includes('Autumn-Deep') && (
                            <div className="mt-4 border-t pt-4 border-gray-200">
                              <h4 className="font-bold text-lg mb-2">가을 딥(Autumn-Deep) 특징</h4>
                              <ul className="list-disc pl-5 space-y-2">
                                <li>깊고 진한 톤으로 고급스럽고 강인한 이미지를 연출합니다.</li>
                                <li>따뜻한 언더톤과 진한 피부톤을 가진 분들에게 잘 어울립니다.</li>
                                <li>깊이 있는 어스 톤 색상이 잘 어울립니다.</li>
                              </ul>
                            </div>
                          )}

                          {personalColorResult?.includes('Winter-Bright') && (
                            <div className="mt-4 border-t pt-4 border-gray-200">
                              <h4 className="font-bold text-lg mb-2">겨울 브라이트(Winter-Bright) 특징</h4>
                              <ul className="list-disc pl-5 space-y-2">
                                <li>선명하고 강렬한 톤으로 카리스마 있는 이미지를 연출합니다.</li>
                                <li>차가운 언더톤과 대비가 강한 피부를 가진 분들에게 잘 어울립니다.</li>
                                <li>선명하고 채도가 높은 색상이 잘 어울립니다.</li>
                              </ul>
                            </div>
                          )}

                          {personalColorResult?.includes('Winter-Deep') && (
                            <div className="mt-4 border-t pt-4 border-gray-200">
                              <h4 className="font-bold text-lg mb-2">겨울 딥(Winter-Deep) 특징</h4>
                              <ul className="list-disc pl-5 space-y-2">
                                <li>깊고 세련된 톤으로 도시적이고 세련된 이미지를 연출합니다.</li>
                                <li>차가운 언더톤과 진한 피부톤을 가진 분들에게 잘 어울립니다.</li>
                                <li>깊이 있는 쿨 톤 색상이 잘 어울립니다.</li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 퍼스널 컬러 매칭 결과 */}
                    {hasApiResult && showResult && result && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        {/* 잘 맞는 컬러 타입 */}
                        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md">
                          <h4 className="text-lg font-bold text-green-600 mb-4 flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            잘 어울리는 컬러 타입
                          </h4>
                          <p className="text-gray-700 mb-4">
                            <span className="font-semibold">{personalColorResult}</span>
                          </p>
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {getFlexible3x3ColorPalette(personalColorResult || '').map((color, index) => (
                              <div
                                key={index}
                                className="aspect-square rounded-lg border-2 border-white shadow-md hover:scale-105 transition-transform duration-200"
                                style={{ backgroundColor: color }}
                                title={`추천 색상 ${index + 1}`}
                              ></div>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600">
                            당신의 피부톤과 가장 조화롭게 어울리는 컬러 팔레트입니다.
                          </p>
                        </div>
                        {/* 잘 맞지 않는 컬러 타입 */}
                        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md">
                          <h4 className="text-lg font-bold text-red-500 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            피해야 할 컬러 타입
                          </h4>
                          <p className="text-gray-700 mb-4">
                            <span className="font-semibold">
                              {personalColorResult && getOppositeColorType(convertToKebabCase(personalColorResult)).split('-').map(word =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join('-')}
                            </span>
                          </p>
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {personalColorResult && getFlexible3x3ColorPalette(getOppositeColorType(convertToKebabCase(personalColorResult))).map((color, index) => (
                              <div
                                key={index}
                                className="aspect-square rounded-lg border-2 border-white shadow-md hover:scale-105 transition-transform duration-200"
                                style={{ backgroundColor: color }}
                                title={`피해야 할 색상 ${index + 1}`}
                              ></div>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600">
                            당신의 피부톤과 조화롭지 않아 피하는 것이 좋은 컬러 팔레트입니다.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 피부 타입 분석 */}
                    {hasApiResult && (
                      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md mb-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-3">피부 타입 분석</h4>
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-[#F8B8D2] rounded-full flex items-center justify-center mr-4 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {personalColorResult?.includes('Spring') || personalColorResult?.includes('Autumn') ? '웜톤' :
                                personalColorResult?.includes('Winter-Bright') || personalColorResult?.includes('Summer-Light') ? '뉴트럴' : '쿨톤'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {personalColorResult?.includes('Spring') || personalColorResult?.includes('Autumn') ?
                                '따뜻한 느낌의 황금빛이 도는 피부톤입니다.' :
                                personalColorResult?.includes('Winter-Bright') || personalColorResult?.includes('Summer-Light') ?
                                  '중간 톤으로 웜톤과 쿨톤의 특성이 모두 있습니다.' :
                                  '차가운 느낌의 핑크빛이 도는 피부톤입니다.'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold mb-2">피부톤 특징</h5>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {personalColorResult?.includes('Spring') && (
                              <>
                                <li>밝고 투명한 피부톤</li>
                                <li>황금빛이 도는 따뜻한 피부</li>
                                <li>햇볕에 잘 타지 않고 붉어지는 경향</li>
                                <li>피부 결점이 잘 드러나지 않음</li>
                              </>
                            )}
                            {personalColorResult?.includes('Summer') && (
                              <>
                                <li>핑크빛이 도는 차가운 피부톤</li>
                                <li>붉은 기가 살짝 있는 피부</li>
                                <li>햇볕에 쉽게 붉어지고 탄 후에는 붉은 기가 남음</li>
                                <li>피부가 얇고 민감한 편</li>
                              </>
                            )}
                            {personalColorResult?.includes('Autumn') && (
                              <>
                                <li>황금빛 또는 올리브 톤의 피부</li>
                                <li>따뜻한 언더톤이 강함</li>
                                <li>햇볕에 잘 타고 갈색으로 변함</li>
                                <li>피부가 두꺼운 편</li>
                              </>
                            )}
                            {personalColorResult?.includes('Winter') && (
                              <>
                                <li>푸른빛이 도는 차가운 피부톤</li>
                                <li>대비가 강한 피부</li>
                                <li>햇볕에 잘 타지 않거나 붉어짐</li>
                                <li>피부가 투명하고 맑은 편</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* 헤어 컬러 추천 */}
                    {hasApiResult && (
                      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md mb-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-4">헤어 컬러 추천</h4>

                        {/* 헤어 컬러 팔레트 */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          {personalColorResult?.includes('Spring') ? (
                            // 봄 타입 헤어 컬러
                            [
                              { color: '#D4A76A', name: '골드 브라운' },
                              { color: '#B87333', name: '카퍼 브라운' },
                              { color: '#CD7F32', name: '라이트 브라운' },
                              { color: '#DAA520', name: '골든 브라운' }
                            ].map((item, index) => (
                              <div key={index} className="text-center">
                                <div className="w-full h-16 rounded-lg border-2 border-white shadow-md mb-2"
                                  style={{ backgroundColor: item.color }}></div>
                                <span className="text-xs text-gray-700">{item.name}</span>
                              </div>
                            ))
                          ) : personalColorResult?.includes('Summer') ? (
                            // 여름 타입 헤어 컬러
                            [
                              { color: '#8B7D6B', name: '애쉬 브라운' },
                              { color: '#A9A9A9', name: '실버 브라운' },
                              { color: '#967969', name: '라이트 애쉬' },
                              { color: '#736F6E', name: '쿨 다크 브라운' }
                            ].map((item, index) => (
                              <div key={index} className="text-center">
                                <div className="w-full h-16 rounded-lg border-2 border-white shadow-md mb-2"
                                  style={{ backgroundColor: item.color }}></div>
                                <span className="text-xs text-gray-700">{item.name}</span>
                              </div>
                            ))
                          ) : personalColorResult?.includes('Autumn') ? (
                            // 가을 타입 헤어 컬러
                            [
                              { color: '#8B4513', name: '다크 브라운' },
                              { color: '#A0522D', name: '시에나 브라운' },
                              { color: '#954535', name: '체스넛 브라운' },
                              { color: '#800000', name: '마호가니' }
                            ].map((item, index) => (
                              <div key={index} className="text-center">
                                <div className="w-full h-16 rounded-lg border-2 border-white shadow-md mb-2"
                                  style={{ backgroundColor: item.color }}></div>
                                <span className="text-xs text-gray-700">{item.name}</span>
                              </div>
                            ))
                          ) : (
                            // 겨울 타입 헤어 컬러 (최종 else 블록)
                            [
                              { color: '#000000', name: '블랙' },
                              { color: '#2C3539', name: '블루 블랙' },
                              { color: '#36454F', name: '차콜 블랙' },
                              { color: '#483C32', name: '다크 브라운' }
                            ].map((item, index) => (
                              <div key={index} className="text-center">
                                <div className="w-full h-16 rounded-lg border-2 border-white shadow-md mb-2"
                                  style={{ backgroundColor: item.color }}></div>
                                <span className="text-xs text-gray-700">{item.name}</span>
                              </div>
                            ))
                          )}
                        </div>

                        {/* 헤어 스타일 추천 */}
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold mb-2">추천 헤어 스타일</h5>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {personalColorResult?.includes('Spring') && (
                              <>
                                <li>밝고 생기 있는 골드 브라운 계열 염색</li>
                                <li>자연스러운 웨이브나 볼륨감 있는 스타일</li>
                                <li>하이라이트로 입체감 연출</li>
                                <li>밝은 컬러의 발레아쥬 염색 추천</li>
                              </>
                            )}
                            {personalColorResult?.includes('Summer') && (
                              <>
                                <li>차가운 애쉬 브라운 계열 염색</li>
                                <li>부드러운 레이어드 컷</li>
                                <li>실버 톤의 하이라이트</li>
                                <li>자연스러운 웨이브 스타일</li>
                              </>
                            )}
                            {personalColorResult?.includes('Autumn') && (
                              <>
                                <li>따뜻한 다크 브라운, 마호가니 계열 염색</li>
                                <li>풍성한 질감의 헤어스타일</li>
                                <li>레드 브라운 계열의 포인트 컬러</li>
                                <li>자연스러운 볼륨감 있는 스타일</li>
                              </>
                            )}
                            {personalColorResult?.includes('Winter') && (
                              <>
                                <li>블랙, 다크 브라운 계열 염색</li>
                                <li>깔끔하고 선명한 라인의 헤어컷</li>
                                <li>광택감 있는 스트레이트 스타일</li>
                                <li>선명한 컬러의 포인트 염색</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* 액세서리 추천 */}
                    {hasApiResult && (
                      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md mb-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-3">액세서리 추천</h4>

                        {/* 금속 소재 */}
                        <div className="mb-4">
                          <h5 className="font-semibold mb-2">추천 금속 소재</h5>
                          <div className="flex flex-wrap gap-3 mb-3">
                            {personalColorResult?.includes('Spring') || personalColorResult?.includes('Autumn') ? (
                              // 웜톤 액세서리
                              ['골드', '로즈 골드', '브라스', '구리'].map((metal, index) => (
                                <Badge key={index} className="bg-[#DAA520] text-white px-3 py-1">
                                  {metal}
                                </Badge>
                              ))
                            ) : (
                              // 쿨톤 액세서리
                              ['실버', '화이트 골드', '플래티넘', '스틸'].map((metal, index) => (
                                <Badge key={index} className="bg-[#C0C0C0] text-white px-3 py-1">
                                  {metal}
                                </Badge>
                              ))
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mt-2">
                            {personalColorResult?.includes('Spring') || personalColorResult?.includes('Autumn') ?
                              '따뜻한 골드 계열의 액세서리가 피부톤을 더욱 화사하게 보이게 합니다.' :
                              '차가운 실버나 화이트 골드 계열의 액세서리가 피부톤과 조화롭게 어울립니다.'}
                          </p>
                        </div>

                        {/* 보석 추천 */}
                        <div className="mt-5 bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold mb-2">추천 보석 & 스톤</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            {personalColorResult?.includes('Spring') ? (
                              // 봄 타입 보석
                              [
                                { name: '시트린', color: '#E4D00A' },
                                { name: '앰버', color: '#FFBF00' },
                                { name: '코랄', color: '#FF7F50' },
                                { name: '피치 문스톤', color: '#FFDAB9' }
                              ].map((gem, index) => (
                                <div key={index} className="text-center">
                                  <div className="w-full h-10 rounded-lg" style={{ backgroundColor: gem.color }}></div>
                                  <span className="text-xs mt-1 block">{gem.name}</span>
                                </div>
                              ))
                            ) : personalColorResult?.includes('Summer') ? (
                              // 여름 타입 보석
                              [
                                { name: '로즈 쿼츠', color: '#F7CAC9' },
                                { name: '오팔', color: '#A8C3BC' },
                                { name: '문스톤', color: '#E6E6FA' },
                                { name: '라벤더 자드', color: '#D8BFD8' }
                              ].map((gem, index) => (
                                <div key={index} className="text-center">
                                  <div className="w-full h-10 rounded-lg" style={{ backgroundColor: gem.color }}></div>
                                  <span className="text-xs mt-1 block">{gem.name}</span>
                                </div>
                              ))
                            ) : personalColorResult?.includes('Autumn') ? (
                              // 가을 타입 보석
                              [
                                { name: '가넷', color: '#7B1113' },
                                { name: '타이거 아이', color: '#B8860B' },
                                { name: '토파즈', color: '#FFC87C' },
                                { name: '앰버', color: '#FFBF00' }
                              ].map((gem, index) => (
                                <div key={index} className="text-center">
                                  <div className="w-full h-10 rounded-lg" style={{ backgroundColor: gem.color }}></div>
                                  <span className="text-xs mt-1 block">{gem.name}</span>
                                </div>
                              ))
                            ) : (
                              // 겨울 타입 보석
                              [
                                { name: '사파이어', color: '#0F52BA' },
                                { name: '아메시스트', color: '#9966CC' },
                                { name: '루비', color: '#E0115F' },
                                { name: '에메랄드', color: '#50C878' }
                              ].map((gem, index) => (
                                <div key={index} className="text-center">
                                  <div className="w-full h-10 rounded-lg" style={{ backgroundColor: gem.color }}></div>
                                  <span className="text-xs mt-1 block">{gem.name}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* 안경 추천 */}
                        <div className="mt-5">
                          <h5 className="font-semibold mb-2">추천 안경 프레임</h5>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {personalColorResult?.includes('Spring') && (
                              <>
                                <li>밝은 골드, 투명한 프레임</li>
                                <li>라이트 브라운, 피치 컬러 프레임</li>
                                <li>둥근 형태의 부드러운 디자인</li>
                              </>
                            )}
                            {personalColorResult?.includes('Summer') && (
                              <>
                                <li>실버, 라이트 그레이 프레임</li>
                                <li>투명한 블루, 라벤더 컬러 프레임</li>
                                <li>부드러운 사각형 또는 타원형 디자인</li>
                              </>
                            )}
                            {personalColorResult?.includes('Autumn') && (
                              <>
                                <li>토트쉘, 다크 브라운 프레임</li>
                                <li>앤티크 골드, 구리색 프레임</li>
                                <li>클래식하고 두꺼운 디자인</li>
                              </>
                            )}
                            {personalColorResult?.includes('Winter') && (
                              <>
                                <li>블랙, 다크 네이비 프레임</li>
                                <li>선명한 컬러의 프레임</li>
                                <li>각진 형태의 세련된 디자인</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* 메이크업 추천 */}
                    {hasApiResult && (
                      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md mb-10">
                        <h4 className="text-lg font-bold text-gray-900 mb-4">메이크업 추천</h4>

                        {/* 베이스 메이크업 */}
                        <div className="mb-5">
                          <h5 className="font-semibold mb-2">베이스 메이크업</h5>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm mb-3">
                              {personalColorResult?.includes('Spring') || personalColorResult?.includes('Autumn') ?
                                '노란빛이 도는 따뜻한 톤의 파운데이션을 선택하세요.' :
                                '핑크빛이 도는 차가운 톤의 파운데이션을 선택하세요.'}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                              {personalColorResult?.includes('Spring') ? (
                                // 봄 타입 베이스
                                [
                                  { name: '아이보리 베이지', color: '#FFFDD0' },
                                  { name: '웜 베이지', color: '#F5DEB3' },
                                  { name: '피치 베이지', color: '#FFDAB9' },
                                  { name: '골든 베이지', color: '#F3E5AB' }
                                ].map((base, index) => (
                                  <div key={index} className="text-center">
                                    <div className="w-full h-10 rounded-lg" style={{ backgroundColor: base.color }}></div>
                                    <span className="text-xs mt-1 block">{base.name}</span>
                                  </div>
                                ))
                              ) : personalColorResult?.includes('Summer') ? (
                                // 여름 타입 베이스
                                [
                                  { name: '로즈 베이지', color: '#E8CEBF' },
                                  { name: '쿨 아이보리', color: '#FFF5EE' },
                                  { name: '핑크 베이지', color: '#EAD5C9' },
                                  { name: '쿨 베이지', color: '#E0D8B0' }
                                ].map((base, index) => (
                                  <div key={index} className="text-center">
                                    <div className="w-full h-10 rounded-lg" style={{ backgroundColor: base.color }}></div>
                                    <span className="text-xs mt-1 block">{base.name}</span>
                                  </div>
                                ))
                              ) : personalColorResult?.includes('Autumn') ? (
                                // 가을 타입 베이스
                                [
                                  { name: '골든 베이지', color: '#E6BE8A' },
                                  { name: '허니 베이지', color: '#D2B48C' },
                                  { name: '웜 탠', color: '#D2B48C' },
                                  { name: '카라멜', color: '#C19A6B' }
                                ].map((base, index) => (
                                  <div key={index} className="text-center">
                                    <div className="w-full h-10 rounded-lg" style={{ backgroundColor: base.color }}></div>
                                    <span className="text-xs mt-1 block">{base.name}</span>
                                  </div>
                                ))
                              ) : (
                                // 겨울 타입 베이스
                                [
                                  { name: '포슬린', color: '#FAF9F6' },
                                  { name: '아이보리', color: '#FFFFF0' },
                                  { name: '쿨 베이지', color: '#E0D8B0' },
                                  { name: '올리브 베이지', color: '#D1E231' }
                                ].map((base, index) => (
                                  <div key={index} className="text-center">
                                    <div className="w-full h-10 rounded-lg" style={{ backgroundColor: base.color }}></div>
                                    <span className="text-xs mt-1 block">{base.name}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 블러셔 & 립 컬러 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* 블러셔 */}
                          <div>
                            <h5 className="font-semibold mb-2">추천 블러셔</h5>
                            <div className="grid grid-cols-2 gap-2">
                              {personalColorResult?.includes('Spring') ? (
                                // 봄 타입 블러셔
                                [
                                  { name: '코랄', color: '#FF7F50' },
                                  { name: '피치', color: '#FFDAB9' }
                                ].map((blush, index) => (
                                  <div key={index} className="text-center">
                                    <div className="w-full h-10 rounded-lg" style={{ backgroundColor: blush.color }}></div>
                                    <span className="text-xs mt-1 block">{blush.name}</span>
                                  </div>
                                ))
                              ) : personalColorResult?.includes('Summer') ? (
                                // 여름 타입 블러셔
                                [
                                  { name: '로즈 핑크', color: '#FF66CC' },
                                  { name: '라벤더', color: '#E6E6FA' }
                                ].map((blush, index) => (
                                  <div key={index} className="text-center">
                                    <div className="w-full h-10 rounded-lg" style={{ backgroundColor: blush.color }}></div>
                                    <span className="text-xs mt-1 block">{blush.name}</span>
                                  </div>
                                ))
                              ) : personalColorResult?.includes('Autumn') ? (
                                // 가을 타입 블러셔
                                [
                                  { name: '테라코타', color: '#E2725B' },
                                  { name: '브릭', color: '#B22222' }
                                ].map((blush, index) => (
                                  <div key={index} className="text-center">
                                    <div className="w-full h-10 rounded-lg" style={{ backgroundColor: blush.color }}></div>
                                    <span className="text-xs mt-1 block">{blush.name}</span>
                                  </div>
                                ))
                              ) : (
                                // 겨울 타입 블러셔
                                [
                                  { name: '푸시아', color: '#FF00FF' },
                                  { name: '플럼', color: '#8E4585' }
                                ].map((blush, index) => (
                                  <div key={index} className="text-center">
                                    <div className="w-full h-10 rounded-lg" style={{ backgroundColor: blush.color }}></div>
                                    <span className="text-xs mt-1 block">{blush.name}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* 립 컬러 */}
                          <div>
                            <h5 className="font-semibold mb-2">추천 립 컬러</h5>
                            <div className="grid grid-cols-2 gap-2">
                              {personalColorResult?.includes('Spring') ? (
                                // 봄 타입 립
                                [
                                  { name: '코랄', color: '#FF7F50' },
                                  { name: '피치', color: '#FFDAB9' }
                                ].map((lip, index) => (
                                  <div key={index} className="text-center">
                                    <div className="w-full h-10 rounded-lg" style={{ backgroundColor: lip.color }}></div>
                                    <span className="text-xs mt-1 block">{lip.name}</span>
                                  </div>
                                ))
                              ) : personalColorResult?.includes('Summer') ? (
                                // 여름 타입 립
                                [
                                  { name: '로즈', color: '#FF007F' },
                                  { name: '라즈베리', color: '#E30B5C' }
                                ].map((lip, index) => (
                                  <div key={index} className="text-center">
                                    <div className="w-full h-10 rounded-lg" style={{ backgroundColor: lip.color }}></div>
                                    <span className="text-xs mt-1 block">{lip.name}</span>
                                  </div>
                                ))
                              ) : personalColorResult?.includes('Autumn') ? (
                                // 가을 타입 립
                                [
                                  { name: '테라코타', color: '#E2725B' },
                                  { name: '브릭 레드', color: '#B22222' }
                                ].map((lip, index) => (
                                  <div key={index} className="text-center">
                                    <div className="w-full h-10 rounded-lg" style={{ backgroundColor: lip.color }}></div>
                                    <span className="text-xs mt-1 block">{lip.name}</span>
                                  </div>
                                ))
                              ) : (
                                // 겨울 타입 립
                                [
                                  { name: '버건디', color: '#800020' },
                                  { name: '체리 레드', color: '#DE3163' }
                                ].map((lip, index) => (
                                  <div key={index} className="text-center">
                                    <div className="w-full h-10 rounded-lg" style={{ backgroundColor: lip.color }}></div>
                                    <span className="text-xs mt-1 block">{lip.name}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 아이 메이크업 */}
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold mb-2">아이 메이크업 팁</h5>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {personalColorResult?.includes('Light') ? (
                              <>
                                <li>부드러운 브라운이나 피치 계열의 아이섀도우로 자연스러운 눈매를 연출하세요.</li>
                                <li>너무 진한 아이라인은 피하고 부드러운 브라운 아이라이너를 사용하세요.</li>
                                <li>마스카라는 브라운 계열이 자연스럽게 어울립니다.</li>
                              </>
                            ) : personalColorResult?.includes('Bright') ? (
                              <>
                                <li>선명한 컬러의 아이섀도우로 또렷한 눈매를 강조하세요.</li>
                                <li>블랙 아이라이너로 선명한 라인을 그려주세요.</li>
                                <li>볼륨감 있는 마스카라로 눈매를 강조하세요.</li>
                              </>
                            ) : personalColorResult?.includes('Mute') ? (
                              <>
                                <li>차분한 톤의 아이섀도우로 세련된 눈매를 연출하세요.</li>
                                <li>소프트한 브라운 또는 그레이 아이라이너가 잘 어울립니다.</li>
                                <li>자연스러운 컬링 마스카라를 사용하세요.</li>
                              </>
                            ) : (
                              <>
                                <li>깊이 있는 다크 브라운이나 버건디 계열로 깊은 눈매를 연출하세요.</li>
                                <li>블랙 아이라이너로 선명하게 라인을 그려주세요.</li>
                                <li>볼륨감과 길이감을 모두 살린 마스카라를 사용하세요.</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                    {!hasApiResult && showResult && (
                      <div className="text-center py-8">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                          <h3 className="text-xl font-bold text-red-700 mb-2">분석 결과를 가져올 수 없습니다</h3>
                          <p className="text-red-600 mb-4">
                            AI 분석에 실패했습니다. 다시 시도해주세요.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 다음 단계 버튼 추가 */}
                    <div className="text-center mt-10">
                      <Button
                        onClick={() => router.push("/personal-color-drape-test")}
                        size="lg"
                        className="bg-[#F8B8D2] hover:bg-[#f5a6c6] text-white px-10 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
                      >
                        <span className="mr-3">드레이프 테스트 하기</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right">
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </Button>
                      <p className="text-sm text-gray-600 mt-4 max-w-md mx-auto">
                        다양한 색상을 직접 비교해보며 가장 잘 어울리는 색상을 찾아보세요
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card className="mt-8 bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <div className="absolute inset-0"></div>
                <div className="relative p-8">
                  <div className="flex items-center mb-6">
                    <Lightbulb className="text-[#171212] text-2xl mr-4" />
                    <h3 className="text-xl font-bold text-[#171212]">더 정확한 분석을 위한 팁</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      "자연광에서 촬영된 사진을 사용해주세요",
                      "얼굴이 정면으로 잘 보이는 사진을 선택해주세요",
                      "메이크업이 진하지 않은 사진이 더 정확합니다",
                      "고화질 이미지일수록 분석 정확도가 높아집니다"
                    ].map((tip, idx) => (
                      <div key={idx} className="bg-white/70 backdrop-blur-sm p-5 rounded-xl shadow-sm flex items-start">
                        <div className="w-8 h-8 bg-[#E8B5B8] rounded-sm flex-shrink-0 mr-4" />
                        <p className="text-[#171212] font-medium leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}