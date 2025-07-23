"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/ui/Header";
import { Camera, Upload, Sparkles, CheckCircle } from "lucide-react"
import { useStyling } from '../context/StylingContext'
import { useAuth } from '@/app/context/AuthContext'
import { personalColorTypes } from "@/lib/personalColorData"

export default function PersonalColorImageUpload() {
  const { stylingData, setStylingData } = useStyling()  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResult, setShowResult] = useState(false)
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
      const response = await fetch(`http://127.0.0.1:8000/personal/analyze-all`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.personal_color_analysis || 'AI 분석 실패');
      }

      const responseData = await response.json();
      const analysisResult = JSON.parse(responseData.personal_color_analysis); // FastAPI 응답 파싱

      setResult(analysisResult);
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

      setTimeout(() => {
        router.push("/personal-color-drape-test");
      }, 1000);
    } catch (error: any) {
      alert(error.message);
      console.error('AI analysis failed:', error);
      setIsAnalyzing(false);
    }
  }

  const triggerImageUpload = () => {
    imageInputRef.current?.click()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="personal-color" />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            AI{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              퍼스널 컬러
            </span>{" "}
            분석
          </h1>
          <p className="text-lg text-gray-600">사진을 업로드하시면 AI가 당신의 퍼스널 컬러를 정확하게 분석해드립니다</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!uploadedImage ? (
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-xl">
              <CardContent className="p-12">
                <div
                  className="border-2 border-dashed border-purple-300 rounded-xl p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300"
                  onClick={triggerImageUpload}
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Camera className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">이미지를 업로드해주세요</h3>
                  <p className="text-gray-600 mb-6">
                    얼굴이 잘 보이는 정면 사진을 업로드하시면 더 정확한 분석이 가능합니다
                  </p>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    사진 업로드
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">업로드된 이미지</h3>
                  <p className="text-gray-600">이미지가 선명하게 업로드되었습니다</p>
                </div>

                <div className="relative mb-8">
                  <img
                    src={uploadedImage || "/placeholder.svg?height=400&width=400"}
                    alt="Uploaded"
                    className="w-full max-w-md mx-auto rounded-xl shadow-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      업로드 완료
                    </Badge>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={handleDiagnosis}
                    disabled={isAnalyzing}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        AI 분석 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        분석하기
                      </>
                    )}
                  </Button>
                </div>

                {isAnalyzing && (
                  <div className="mt-8 text-center">
                    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
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
              </CardContent>
            </Card>
          )}

          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={imageInputRef} />

          {showResult && result && (
            <Card className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">분석 완료!</h2>
                  <Badge className="bg-green-100 text-green-800 px-3 py-1">정확도 {result.confidence}%</Badge>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {personalColorResult}
                  </h3>
                  <p className="text-gray-600 text-lg">{result.description}</p>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">추천 색상</h4>
                  <div className="flex justify-center gap-3">
                    {colorResult.map((color, index) => (
                      <div key={index} className="text-center">
                        <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg mb-2" style={{ backgroundColor: color}}></div>
                        <span className="text-xs text-gray-600">{colorNameResult[index]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4">3초 후 세부 스타일 설정 페이지로 이동합니다...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card className="mt-8 bg-white/60 backdrop-blur-sm border-purple-100">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📸 더 정확한 분석을 위한 팁</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  자연광에서 촬영된 사진을 사용해주세요
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  얼굴이 정면으로 잘 보이는 사진을 선택해주세요
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  메이크업이 진하지 않은 사진이 더 정확합니다
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  고화질 이미지일수록 분석 정확도가 높아집니다
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
