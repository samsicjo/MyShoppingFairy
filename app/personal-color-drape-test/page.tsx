"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/ui/Header";
import { Upload, ArrowLeft, ArrowRight, Camera, RotateCcw } from "lucide-react" // Scissors, Loader2 아이콘 제거

interface ColorSwatch {
  color: string
  title: string
}

interface ColorCategory {
  name: string
  title: string
  colors: ColorSwatch[]
}

const colorCategories: ColorCategory[] = [
  {
    name: "spring-light",
    title: "봄 라이트",
    colors: [
      { color: "#FFFFF0", title: "아이보리" },
      { color: "#FFE4B5", title: "피치" },
      { color: "#FFB6C1", title: "라이트 핑크" },
      { color: "#FFC0CB", title: "핑크" },
      { color: "#98FB98", title: "라이트 그린" },
      { color: "#87CEEB", title: "스카이 블루" },
      { color: "#F5F5DC", title: "베이지" },
      { color: "#FFD700", title: "골드" },
      { color: "#BFFF00", title: "라임" },
      { color: "#90EE90", title: "연두" },
    ],
  },
  {
    name: "spring-bright",
    title: "봄 브라이트",
    colors: [
      { color: "#FFFFFF", title: "브라이트 화이트" },
      { color: "#FF7F50", title: "코랄" },
      { color: "#FF6347", title: "토마토" },
      { color: "#FFD700", title: "옐로우" },
      { color: "#32CD32", title: "라임 그린" },
      { color: "#1E90FF", title: "다저 블루" },
      { color: "#FF69B4", title: "핫 핑크" },
      { color: "#000080", title: "네이비" },
      { color: "#FFA500", title: "오렌지" },
      { color: "#00FF7F", title: "스프링 그린" },
    ],
  },
  {
    name: "summer-light",
    title: "여름 라이트",
    colors: [
      { color: "#F8F8FF", title: "소프트 화이트" },
      { color: "#E6E6FA", title: "라벤더" },
      { color: "#F0F8FF", title: "앨리스 블루" },
      { color: "#FFE4E1", title: "미스티 로즈" },
      { color: "#B0E0E6", title: "파우더 블루" },
      { color: "#D3D3D3", title: "라이트 그레이" },
      { color: "#FADADD", title: "페일 핑크" },
      { color: "#F5F5DC", title: "베이지" },
      { color: "#DDA0DD", title: "플럼" },
      { color: "#87CEEB", title: "스카이 블루" },
    ],
  },
  {
    name: "summer-mute",
    title: "여름 뮤트",
    colors: [
      { color: "#808080", title: "그레이" },
      { color: "#6495ED", title: "뮤트 블루" },
      { color: "#BC8F8F", title: "더스티 로즈" },
      { color: "#D8BFD8", title: "시슬" },
      { color: "#B0C4DE", title: "라이트 스틸 블루" },
      { color: "#DDA0DD", title: "플럼" },
      { color: "#C0C0C0", title: "실버" },
      { color: "#F0E68C", title: "카키" },
      { color: "#9370DB", "title": "미디엄 퍼플" },
      { color: "#778899", title: "라이트 슬레이트 그레이" },
    ],
  },
  {
    name: "autumn-mute",
    title: "가을 뮤트",
    colors: [
      { color: "#C19A6B", title: "카멜" },
      { color: "#808000", title: "올리브" },
      { color: "#8B4513", title: "브라운" },
      { color: "#CD853F", title: "페루" },
      { color: "#D2691E", title: "초콜릿" },
      { color: "#BC8F8F", title: "로지 브라운" },
      { color: "#F4A460", title: "샌디 브라운" },
      { color: "#DEB887", title: "버리우드" },
      { color: "#D2B48C", title: "탄" },
      { color: "#BDB76B", title: "다크 카키" },
    ],
  },
  {
    name: "autumn-deep",
    title: "가을 딥",
    colors: [
      { color: "#654321", title: "딥 브라운" },
      { color: "#800020", title: "버건디" },
      { color: "#228B22", title: "포레스트 그린" },
      { color: "#8B4513", title: "새들 브라운" },
      { color: "#A0522D", title: "시에나" },
      { color: "#800000", title: "마룬" },
      { color: "#556B2F", title: "다크 올리브 그린" },
      { color: "#8B0000", title: "다크 레드" },
      { color: "#2F4F4F", title: "다크 슬레이트 그레이" },
      { color: "#B22222", title: "파이어 브릭" },
    ],
  },
  {
    name: "winter-bright",
    title: "겨울 브라이트",
    colors: [
      { color: "#FFFFFF", title: "퓨어 화이트" },
      { color: "#FF0000", title: "브라이트 레드" },
      { color: "#000000", title: "블랙" },
      { color: "#FF1493", title: "딥 핑크" },
      { color: "#0000FF", title: "블루" },
      { color: "#8A2BE2", title: "블루 바이올렛" },
      { color: "#00FF00", title: "라임" },
      { color: "#FF4500", title: "오렌지 레드" },
      { color: "#DC143C", title: "크림슨" },
      { color: "#4169E1", title: "로얄 블루" },
    ],
  },
  {
    name: "winter-deep",
    title: "겨울 딥",
    colors: [
      { color: "#000000", title: "블랙" },
      { color: "#191970", title: "딥 네이비" },
      { color: "#2F4F4F", title: "다크 그레이" },
      { color: "#000080", title: "네이비" },
      { color: "#800080", title: "퍼플" },
      { color: "#008B8B", title: "다크 시안" },
      { color: "#4B0082", title: "인디고" },
      { color: "#483D8B", title: "다크 슬레이트 블루" },
      { color: "#2E8B57", title: "씨 그린" },
      { color: "#8B008B", title: "다크 마젠타" },
    ],
  },
]

export default function PersonalColorDrapeTest() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  // const [processedImage, setProcessedImage] = useState<string | null>(null) // 삭제
  // const [useProcessedImage, setUseProcessedImage] = useState(false) // 삭제
  // const [isProcessing, setIsProcessing] = useState(false) // 삭제
  const [backgroundColor, setBackgroundColor] = useState("#e0e0e0")
  const [currentScale, setCurrentScale] = useState(1)
  const [currentOffsetX, setCurrentOffsetX] = useState(0)
  const [currentOffsetY, setCurrentOffsetY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [personalColorResult, setPersonalColorResult] = useState<string | null>(null)

  const imageInputRef = useRef<HTMLInputElement>(null)
  const faceImageRef = useRef<HTMLImageElement>(null)
  const router = useRouter()

  useEffect(() => {
    // 퍼스널컬러 진단 결과 불러오기
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
  }, [])

  // 배경 제거 API 호출 함수 (삭제)
  // const removeBackground = useCallback(async (imageDataUrl: string): Promise<string> => { /* ... */ }, [])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      const imageDataUrl = e.target?.result as string
      setUploadedImage(imageDataUrl)
      // setProcessedImage(null) // 삭제
      // setUseProcessedImage(false) // 삭제

      // 이미지 업로드 시 변형 값 초기화
      setCurrentScale(1)
      setCurrentOffsetX(0)
      setCurrentOffsetY(0)
    }
    reader.readAsDataURL(file)
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

  const handleColorSelect = (color: string) => {
    setBackgroundColor(color)
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
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              퍼스널컬러 드레이프 테스트
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-4">다양한 색상을 직접 비교해보며 가장 잘 어울리는 색상을 찾아보세요</p>
          {personalColorResult && (
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 text-sm">
              진단 결과: {personalColorResult}
            </Badge>
          )}
        </div>

        {/* Image Upload Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">얼굴 사진 업로드</h3>
              <p className="text-gray-600">드레이프 테스트를 위해 얼굴이 잘 보이는 사진을 업로드해주세요</p>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div className="flex gap-4">
                <Button
                  onClick={triggerImageUpload}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  사진 업로드
                </Button>

                {uploadedImage && (
                  <>
                    {/* "배경 제거" 버튼 삭제됨 */}
                    {/* "초기화" 버튼은 유지 (업로드된 이미지와 변형 초기화) */}
                    <Button onClick={resetImage} variant="outline" className="px-6 py-3 bg-transparent">
                      <RotateCcw className="h-5 w-5 mr-2" />
                      초기화
                    </Button>
                  </>
                )}
              </div>

              {/* 이미지 선택 옵션 (배경 제거 이미지 선택 라디오 버튼) 삭제됨 */}

              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={imageInputRef} />

              {/* Face Container with Background */}
              <div
                className="relative rounded-2xl shadow-xl overflow-hidden"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  height: "300px",
                  backgroundColor: backgroundColor,
                  transition: "background-color 0.5s ease-in-out",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={`w-48 h-48 rounded-full overflow-hidden relative z-10 ${
                      isDragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {currentDisplayImage ? (
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
                <div className="w-full max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">사이즈 조절 (확대/축소)</label>
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

        {/* Color Palette Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">배경색 선택</h3>
              <p className="text-gray-600">다양한 색상을 클릭하여 어떤 색이 가장 잘 어울리는지 확인해보세요</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {colorCategories.map((category) => (
                <div key={category.name} className="bg-white p-4 rounded-xl shadow-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">{category.title}</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {category.colors.map((colorSwatch, index) => (
                      <button
                        key={index}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform duration-200 cursor-pointer"
                        style={{ backgroundColor: colorSwatch.color }}
                        onClick={() => handleColorSelect(colorSwatch.color)}
                        title={colorSwatch.title}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-white/60 backdrop-blur-sm border-purple-100 mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 드레이프 테스트 팁</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  자연광에서 테스트하는 것이 가장 정확합니다
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  얼굴이 화사해 보이는 색상을 선택하세요
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  피부톤이 맑고 생기있어 보이는 색상이 좋습니다
                </div>
                {/* 배경 제거 관련 팁 삭제됨 */}
                {/* <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  배경 제거 기능으로 더 정확한 테스트가 가능합니다
                </div> */}
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  얼굴이 칙칙해 보이는 색상은 피하세요
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  여러 색상을 비교해보며 선택하세요
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  진단 결과와 비교해보며 확인하세요
                </div>
                {/* 배경 제거 관련 팁 삭제됨 */}
                {/* <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  원본과 배경 제거 이미지를 비교해보세요
                </div> */}
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
              variant="outline"
              onClick={handleSkip}
              className="flex items-center px-6 py-3 bg-transparent border-gray-200"
            >
              건너뛰기
            </Button>
            <Button
              onClick={handleComplete}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
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
