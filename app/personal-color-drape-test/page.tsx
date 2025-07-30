"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/ui/Header"
import { Footer } from '@/components/ui/Footer'
import { Upload, ArrowLeft, ArrowRight, Camera, RotateCcw, Lightbulb, Palette, Trophy, ArrowDown } from "lucide-react"
import { CustomLoader } from "@/components/ui/CustomLoader"
import { colorCategories } from "@/components/data/personalColorData"
import { useStyling } from "@/app/context/StylingContext"

export default function PersonalColorDrapeTest() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false) // Add processing state
  const [hasValidResult, setHasValidResult] = useState(true) // 유효한 결과가 있는지 확인
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
  const { stylingData, setStylingData } = useStyling()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const faceImageRef = useRef<HTMLImageElement>(null)
  const router = useRouter()

  useEffect(() => {
    // 퍼스널컬러 진단 결과 불러오기
    const personalColorAnalysis = localStorage.getItem("personalColorAnalysis")
    const selectedPersonalColor = localStorage.getItem("selectedPersonalColor")
    console.log("personalColorAnalysis : ", personalColorAnalysis)
    console.log("selectedPersonalColor : ", selectedPersonalColor)
    console.log("stylingData : ", stylingData)
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
  }, [])

  // 배경 제거 API 호출 함수 (삭제)
  // const removeBackground = useCallback(async (imageDataUrl: string): Promise<string> => { /* ... */ }, [])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true) // Start processing
    setUploadedImage(null) // Clear previous image
    setHasValidResult(true) // 초기화

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/personal/extract-face-image`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to extract face image: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const imageBlob = await response.blob()
      const imageUrl = URL.createObjectURL(imageBlob)
      setUploadedImage(imageUrl)
      setHasValidResult(true) // 성공 시 유효한 결과로 설정

      // 이미지 업로드 시 변형 값 초기화
      setCurrentScale(1)
      setCurrentOffsetX(0)
      setCurrentOffsetY(0)

    } catch (error) {
      console.error("Error uploading image or extracting face:", error)
      setHasValidResult(false) // 실패 시 결과가 없음을 표시
      setUploadedImage(null)
    } finally {
      setIsProcessing(false) // End processing
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
    setUploadedImage(null) // 업로드된 이미지도 초기화
    setHasValidResult(true) // 초기화 시 유효한 상태로 되돌림
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="text-left mb-8">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-[#171212]">
              퍼스널컬러 드레이프 테스트
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-4">다양한 색상을 직접 비교해보며 가장 잘 어울리는 색상을 찾아보세요</p>
          {personalColorResult && (
            <div className="flex justify-center">
              <Badge className="bg-[#F5F2F2] text-[#171212] px-4 py-2 text-sm hover:bg-[#F5F2F2]">
                진단 결과: {stylingData.personalColor}
              </Badge>
            </div>
          )}
        </div>

        {/* 얼굴 추출 실패 시 오류 메시지 */}
        {!hasValidResult && !isProcessing && (
          <div className="text-center py-12 mb-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
              <div className="text-red-500 mb-4">
                <Camera className="h-16 w-16 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-bold text-red-700 mb-2">얼굴을 찾을 수 없습니다</h3>
              <p className="text-red-600 mb-4">
                업로드한 사진에서 얼굴을 인식할 수 없습니다.<br />
                얼굴이 명확하게 보이는 다른 사진을 업로드해주세요.
              </p>
              <Button
                onClick={triggerImageUpload}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2"
              >
                <Upload className="h-4 w-4 mr-2" />
                다른 사진 업로드
              </Button>
            </div>
          </div>
        )}

        {/* 파일 업로드 input - 항상 DOM에 존재해야 함 */}
        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={imageInputRef} />

        {/* 좌우 분할 레이아웃 - 유효한 결과가 있을 때만 표시 */}
        {hasValidResult && (
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
                          className={`w-48 h-48 relative z-10 ${isDragging ? "cursor-grabbing" : "cursor-grab"
                            }`}
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                        >
                          {isProcessing ? (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center animate-pulse">
                              <CustomLoader className="h-12 w-12 text-gray-500" />
                              <p className="text-gray-500 text-sm ml-2">얼굴 추출 중...</p>
                            </div>
                          ) : currentDisplayImage ? (
                            <img
                              ref={faceImageRef}
                              src={currentDisplayImage || "/placeholder.svg"}
                              alt="업로드된 얼굴 사진"
                              className="w-full h-full object-contain absolute top-0 left-0"
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
        )}

        {/* 사용 방법 - 유효한 결과가 있을 때만 표시 */}
        {hasValidResult && (
          <Card className="mt-8 bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg overflow-hidden mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-[#171212] mb-8">사용 방법</h2>

              <div className="flex flex-col items-start space-y-6 mb-8">
                {/* 1단계: 사진 업로드 */}
                <div className="flex items-center space-x-4 w-full max-w-md">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Camera className="h-6 w-6 text-[#171212]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#171212] mb-1">사진을 업로드 해주세요</h3>
                    <p className="text-gray-600 text-sm">자신의 얼굴이 잘 보이도록 밝고 선명한 사진을 선택해주세요.</p>
                  </div>
                </div>

                {/* 연결선 */}
                <div className="ml-6 w-[2px] h-8 bg-[#82696B]"></div>

                {/* 2단계: 배경색 선택 */}
                <div className="flex items-center space-x-4 w-full max-w-md">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Palette className="h-6 w-6 text-[#171212]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#171212] mb-1">배경색을 선택해 주세요</h3>
                    <p className="text-gray-600 text-sm">다양한 색상을 적용해 보고 어떻게 달라지는지 확인하세요.</p>
                  </div>
                </div>

                {/* 연결선 */}
                <div className="ml-6 w-[2px] h-8 bg-[#82696B]"></div>

                {/* 3단계: 결과 확인 */}
                <div className="flex items-center space-x-4 w-full max-w-md">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trophy className="h-6 w-6 text-[#171212]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#171212] mb-1">결과를 확인해 보세요</h3>
                    <p className="text-gray-600 text-sm">나만의 컬러 팔레트와 스타일링 팁을 추천받아보세요.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 bg-[#E8B5B8] rounded-sm mr-3"></div>
                  <h3 className="text-lg font-bold text-[#171212]">드레이프 테스트 팁</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "자연광에서 테스트하는 것이 가장 정확합니다",
                    "얼굴이 칙칙해 보이는 색상은 피하세요",
                    "얼굴이 화사해 보이는 색상을 선택하세요",
                    "여러 색상을 비교해보며 선택하세요",
                    "피부톤이 맑고 생기있어 보이는 색상이 좋습니다",
                    "진단 결과와 비교해보며 확인하세요"
                  ].map((tip, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#E8B5B8] rounded-full flex-shrink-0"></div>
                      <p className="text-[#171212] text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}



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
              className="flex items-center px-8 py-3 bg-[#E8B5B8] hover:bg-[#FFF9EE] text-[#171212]"
            >
              완료
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  )
}