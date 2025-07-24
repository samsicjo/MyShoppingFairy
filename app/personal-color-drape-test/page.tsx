"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/ui/Header";
import { Upload, ArrowLeft, ArrowRight, Camera, RotateCcw, Lightbulb, Loader2 } from "lucide-react"
import { colorCategories } from "@/components/data/personalColorData"
import { useStyling } from '@/app/context/StylingContext' // useStyling 훅 임포트

export default function PersonalColorDrapeTest() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false) // Add processing state
  const [backgroundColor, setBackgroundColor] = useState("#e0e0e0")
  const [currentScale, setCurrentScale] = useState(1)
  const [currentOffsetX, setCurrentOffsetX] = useState(0)
  const [currentOffsetY, setCurrentOffsetY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [personalColorResult, setPersonalColorResult] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("spring-light")
  const [selectedColorInfo, setSelectedColorInfo] = useState<{ color: string, title: string } | null>(null)

  const imageInputRef = useRef<HTMLInputElement>(null)
  const faceImageRef = useRef<HTMLImageElement>(null)
  const router = useRouter()
  const { stylingData } = useStyling(); // useStyling 훅 사용

  useEffect(() => {
    // StylingContext에서 personalColor를 먼저 확인
    if (stylingData.personalColor) {
      setPersonalColorResult(stylingData.personalColor);
      return;
    }

    // StylingContext에 없으면 localStorage에서 불러오기 (폴백)
    const personalColorAnalysis = localStorage.getItem("personalColorAnalysis")
    const selectedPersonalColor = localStorage.getItem("selectedPersonalColor")

    if (personalColorAnalysis) {
      const analysis = JSON.parse(personalColorAnalysis)
      setPersonalColorResult(analysis.type)
    } else if (selectedPersonalColor) {
      try {
        const selected = JSON.parse(selectedPersonalColor)
        setPersonalColorResult(selected.name || selected.type)
      } catch {
        setPersonalColorResult(selectedPersonalColor)
      }
    }
  }, [stylingData.personalColor])

  // 배경 제거 API 호출 함수 (삭제)
  // const removeBackground = useCallback(async (imageDataUrl: string): Promise<string> => { /* ... */ }, [])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true); // Start processing
    setUploadedImage(null); // Clear previous image

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/personal/extract-face-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to extract face image: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setUploadedImage(imageUrl);

      // 이미지 업로드 시 변형 값 초기화
      setCurrentScale(1);
      setCurrentOffsetX(0);
      setCurrentOffsetY(0);

    } catch (error) {
      console.error("Error uploading image or extracting face:", error);
      alert(`이미지 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsProcessing(false); // End processing
    }
  }

  // handleRemoveBackground 함수 삭제
  // const handleRemoveBackground = async () => { /* ... */ }

  const applyTransform = () => {
    if (faceImageRef.current) {
      faceImageRef.current.style.transform = `translateX(${currentOffsetX}px) translateY(${currentOffsetY}px) scale(${currentScale})`
    }
  }

  useEffect(() => {
    applyTransform()
  }, [currentScale, currentOffsetX, currentOffsetY])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!uploadedImage) return
    setIsDragging(true)
    setStartX(e.clientX - currentOffsetX)
    setStartY(e.clientY - currentOffsetY)
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setCurrentOffsetX(e.clientX - startX)
    setCurrentOffsetY(e.clientY - startY)
    e.preventDefault()
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleColorSelect = (color: string, title: string) => {
    setBackgroundColor(color)
    setSelectedColorInfo({ color, title })
  }

  const triggerImageUpload = () => {
    imageInputRef.current?.click()
  }

  const resetImage = () => {
    setCurrentScale(1)
    setCurrentOffsetX(0)
    setCurrentOffsetY(0)
    // setUseProcessedImage(false) // 삭제
    // setProcessedImage(null) // 선택된 이미지 제거 (초기화 시)
    setUploadedImage(null) // 업로드된 이미지도 초기화
  }

  const handleComplete = () => {
    // 현재 사용 중인 이미지를 저장 (배경 제거된 이미지 선택 로직 제거)
    const currentImage = uploadedImage
    if (currentImage) {
      localStorage.setItem("drapeTestImage", currentImage)
    }

    // 드레이프 테스트 완료 후 스타일링으로 이동
    router.push("/styling-step1")
  }

  const handleSkip = () => {
    // 드레이프 테스트 건너뛰고 스타일링으로 이동
    router.push("/styling-step1")
  }

  // const currentDisplayImage = useProcessedImage && processedImage ? processedImage : uploadedImage // 삭제
  const currentDisplayImage = uploadedImage // 단순히 업로드된 이미지로 변경

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="personal-color" />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-[#171212]">
              퍼스널컬러 드레이프 테스트
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-4">다양한 색상을 직접 비교해보며 가장 잘 어울리는 색상을 찾아보세요</p>
          {personalColorResult && (
            <Badge className="bg-[#E8B5B8] text-white px-4 py-2 text-sm">
              진단 결과: {personalColorResult}
            </Badge>
          )}
        </div>

        {/* 좌우 분할 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 왼쪽: 이미지 영역 */}
          <div className="order-2 lg:order-1">
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg h-full">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">얼굴 사진 업로드</h3>
                  <p className="text-gray-600 text-sm">드레이프 테스트를 위해 얼굴이 잘 보이는 사진을 업로드해주세요</p>
                </div>

                <div className="flex flex-col items-center space-y-4">
                  <div className="flex gap-3">
                    <Button
                      onClick={triggerImageUpload}
                      className="bg-[#E8B5B8] hover:bg-[#2a2a2a] text-white px-4 py-2 text-sm"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      사진 업로드
                    </Button>

                    {uploadedImage && (
                      <Button onClick={resetImage} variant="outline" className="px-4 py-2 text-sm bg-transparent">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        초기화
                      </Button>
                    )}
                  </div>

                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={imageInputRef} />

                  {/* Face Container with Background */}
                  <div
                    className="relative rounded-2xl shadow-xl overflow-hidden w-full"
                    style={{
                      height: "500px",
                      backgroundColor: backgroundColor,
                      transition: "background-color 0.5s ease-in-out",
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`w-48 h-48 rounded-full overflow-hidden relative z-10 ${isDragging ? "cursor-grabbing" : "cursor-grab"
                          }`}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                      >
                        {isProcessing ? (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center animate-pulse">
                            <Loader2 className="h-12 w-12 text-gray-500" />
                            <p className="text-gray-500 text-sm ml-2">얼굴 추출 중...</p>
                          </div>
                        ) : currentDisplayImage ? (
                          <img
                            ref={faceImageRef}
                            src={currentDisplayImage || "/placeholder.svg"}
                            alt="업로드된 얼굴 사진"
                            className="w-full h-full object-cover absolute top-0 left-0"
                            style={{
                              transformOrigin: "center center",
                              transition: isDragging ? "none" : "transform 0.05s ease-out",
                            }}
                            draggable={false}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <div className="text-center">
                              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500 text-sm">얼굴 사진</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Zoom Control */}
                  {currentDisplayImage && (
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">사이즈 조절</label>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.01"
                        value={currentScale}
                        onChange={(e) => setCurrentScale(Number.parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 색상 팔레트 */}
          <div className="order-1 lg:order-2">
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg h-full">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">배경색 선택</h3>
                  <p className="text-gray-600 text-sm">색상을 클릭하여 어떤 색이 가장 잘 어울리는지 확인해보세요</p>
                </div>

                {/* 선택된 색상 정보 표시 */}
                {selectedColorInfo && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: selectedColorInfo.color }}
                      ></div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">현재 선택된 색상</p>
                        <p className="font-semibold text-gray-900">{selectedColorInfo.title}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 탭 네비게이션 */}
                <div className="flex flex-wrap gap-3 mb-6 justify-center">
                  {colorCategories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setActiveTab(category.name)}
                      className={`px-4 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 ${activeTab === category.name
                        ? "bg-[#E8B5B8] text-white shadow-lg transform scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                        }`}
                    >
                      {category.title}
                    </button>
                  ))}
                </div>

                {/* 활성 탭의 색상 팔레트 */}
                {colorCategories
                  .filter((category) => category.name === activeTab)
                  .map((category) => (
                    <div key={category.name} className="bg-white p-6 rounded-xl shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                        {category.title}
                      </h4>
                      <div className="grid grid-cols-4 gap-4 justify-items-center">
                        {category.colors.slice(0, 12).map((colorSwatch, index) => (
                          <button
                            key={index}
                            className="w-14 h-14 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform duration-200 cursor-pointer hover:shadow-lg"
                            style={{ backgroundColor: colorSwatch.color }}
                            onClick={() => handleColorSelect(colorSwatch.color, colorSwatch.title)}
                            title={colorSwatch.title}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg overflow-hidden mb-8">
          <CardContent className="p-0">
            <div className="relative">
              {/* 배경 효과 */}
              <div className="absolute inset-0 bg-gray-50 opacity-70"></div>

              {/* 팁 영역 */}
              <div className="relative p-8">
                <div className="flex items-center mb-5">
                  <Lightbulb className="text-[#171212] text-2xl mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">드레이프 테스트 팁</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    "자연광에서 테스트하는 것이 가장 정확합니다",
                    "얼굴이 칙칙해 보이는 색상은 피하세요",
                    "얼굴이 화사해 보이는 색상을 선택하세요",
                    "여러 색상을 비교해보며 선택하세요",
                    "피부톤이 맑고 생기있어 보이는 색상이 좋습니다",
                    "진단 결과와 비교해보며 확인하세요"
                  ].map((tip, idx) => (
                    <div
                      key={idx}
                      className="bg-white/70 backdrop-blur-sm p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-start"
                    >
                      <div className="w-8 h-8 bg-[#E8B5B8] rounded-sm flex-shrink-0 mr-4" />
                      <p className="text-[#171212] font-medium leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center px-6 py-3 bg-transparent border-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            이전으로
          </Button>
          <div className="flex gap-4">
            <Button
              onClick={handleComplete}
              className="flex items-center px-8 py-3 bg-[#E8B5B8] hover:bg-[#2a2a2a] text-white"
            >
              완료
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}