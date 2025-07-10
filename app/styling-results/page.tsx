"use client"


import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useStyling } from "@/app/context/StylingContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/ui/Header";
import { Heart, Check, RefreshCw, ChevronLeft, ChevronRight, Share2, Palette, Sparkles, Camera } from "lucide-react"

const outfitRecommendations = [
  // This mock data is kept for UI prototyping purposes.
  // 캐주얼 스타일 3개
  {
    id: 1,
    title: "데일리 캐주얼 룩",
    category: "캐주얼",
    matchRate: 85,
    images: [
      "/placeholder.svg?height=300&width=250&text=데일리룩1",
      "/placeholder.svg?height=300&width=250&text=데일리룩2",
      "/placeholder.svg?height=300&width=250&text=데일리룩3",
    ],
    items: [
      { name: "화이트 티셔츠", price: 25000, image: "/placeholder.svg?height=200&width=150&text=티셔츠" },
      { name: "데님 팬츠", price: 65000, image: "/placeholder.svg?height=200&width=150&text=데님" },
      { name: "스니커즈", price: 89000, image: "/placeholder.svg?height=200&width=150&text=신발" },
      { name: "크로스백", price: 45000, image: "/placeholder.svg?height=200&width=150&text=가방" },
    ],
    liked: false,
  },
  {
    id: 2,
    title: "편안한 주말 룩",
    category: "캐주얼",
    matchRate: 78,
    images: [
      "/placeholder.svg?height=300&width=250&text=주말룩1",
      "/placeholder.svg?height=300&width=250&text=주말룩2",
      "/placeholder.svg?height=300&width=250&text=주말룩3",
    ],
    items: [
      { name: "후드 티셔츠", price: 45000, image: "/placeholder.svg?height=200&width=150&text=후드" },
      { name: "조거 팬츠", price: 35000, image: "/placeholder.svg?height=200&width=150&text=조거" },
      { name: "운동화", price: 120000, image: "/placeholder.svg?height=200&width=150&text=운동화" },
    ],
    liked: false,
  },
  {
    id: 3,
    title: "캐주얼 외출 룩",
    category: "캐주얼",
    matchRate: 82,
    images: [
      "/placeholder.svg?height=300&width=250&text=외출룩1",
      "/placeholder.svg?height=300&width=250&text=외출룩2",
      "/placeholder.svg?height=300&width=250&text=외출룩3",
    ],
    items: [
      { name: "니트 스웨터", price: 55000, image: "/placeholder.svg?height=200&width=150&text=니트" },
      { name: "치노 팬츠", price: 48000, image: "/placeholder.svg?height=200&width=150&text=치노" },
      { name: "로퍼", price: 95000, image: "/placeholder.svg?height=200&width=150&text=로퍼" },
      { name: "토트백", price: 65000, image: "/placeholder.svg?height=200&width=150&text=토트백" },
    ],
    liked: false,
  },
  // 비즈니스 스타일 3개
  {
    id: 4,
    title: "클래식 오피스 룩",
    category: "비즈니스",
    matchRate: 88,
    images: [
      "/placeholder.svg?height=300&width=250&text=오피스룩1",
      "/placeholder.svg?height=300&width=250&text=오피스룩2",
      "/placeholder.svg?height=300&width=250&text=오피스룩3",
    ],
    items: [
      { name: "블라우스", price: 75000, image: "/placeholder.svg?height=200&width=150&text=블라우스" },
      { name: "슬랙스", price: 85000, image: "/placeholder.svg?height=200&width=150&text=슬랙스" },
      { name: "펌프스", price: 120000, image: "/placeholder.svg?height=200&width=150&text=펌프스" },
    ],
    liked: false,
  },
  {
    id: 5,
    title: "모던 비즈니스 룩",
    category: "비즈니스",
    matchRate: 92,
    images: [
      "/placeholder.svg?height=300&width=250&text=모던룩1",
      "/placeholder.svg?height=300&width=250&text=모던룩2",
      "/placeholder.svg?height=300&width=250&text=모던룩3",
    ],
    items: [
      { name: "정장 재킷", price: 150000, image: "/placeholder.svg?height=200&width=150&text=재킷" },
      { name: "정장 바지", price: 95000, image: "/placeholder.svg?height=200&width=150&text=정장바지" },
      { name: "드레스 슈즈", price: 180000, image: "/placeholder.svg?height=200&width=150&text=구두" },
    ],
    liked: false,
  },
  {
    id: 6,
    title: "스마트 비즈니스 룩",
    category: "비즈니스",
    matchRate: 90,
    images: [
      "/placeholder.svg?height=300&width=250&text=스마트룩1",
      "/placeholder.svg?height=300&width=250&text=스마트룩2",
      "/placeholder.svg?height=300&width=250&text=스마트룩3",
    ],
    items: [
      { name: "셔츠", price: 65000, image: "/placeholder.svg?height=200&width=150&text=셔츠" },
      { name: "베스트", price: 85000, image: "/placeholder.svg?height=200&width=150&text=베스트" },
      { name: "정장 팬츠", price: 110000, image: "/placeholder.svg?height=200&width=150&text=정장팬츠" },
      { name: "옥스포드 슈즈", price: 160000, image: "/placeholder.svg?height=200&width=150&text=옥스포드" },
    ],
    liked: false,
  },
  // 포멀 스타일 3개
  {
    id: 7,
    title: "클래식 정장 스타일",
    category: "포멀",
    matchRate: 90,
    images: [
      "/placeholder.svg?height=300&width=250&text=정장룩1",
      "/placeholder.svg?height=300&width=250&text=정장룩2",
      "/placeholder.svg?height=300&width=250&text=정장룩3",
    ],
    items: [
      { name: "정장 셔츠", price: 65000, image: "/placeholder.svg?height=200&width=150&text=셔츠" },
      { name: "수트 재킷", price: 200000, image: "/placeholder.svg?height=200&width=150&text=수트" },
      { name: "수트 팬츠", price: 120000, image: "/placeholder.svg?height=200&width=150&text=수트팬츠" },
      { name: "옥스포드 슈즈", price: 220000, image: "/placeholder.svg?height=200&width=150&text=옥스포드" },
    ],
    liked: false,
  },
  {
    id: 8,
    title: "이벤트 드레스 룩",
    category: "포멀",
    matchRate: 87,
    images: [
      "/placeholder.svg?height=300&width=250&text=드레스룩1",
      "/placeholder.svg?height=300&width=250&text=드레스룩2",
      "/placeholder.svg?height=300&width=250&text=드레스룩3",
    ],
    items: [
      { name: "이브닝 드레스", price: 180000, image: "/placeholder.svg?height=200&width=150&text=드레스" },
      { name: "하이힐", price: 150000, image: "/placeholder.svg?height=200&width=150&text=하이힐" },
      { name: "클러치백", price: 85000, image: "/placeholder.svg?height=200&width=150&text=클러치" },
    ],
    liked: false,
  },
  {
    id: 9,
    title: "파티 정장 룩",
    category: "포멀",
    matchRate: 93,
    images: [
      "/placeholder.svg?height=300&width=250&text=파티룩1",
      "/placeholder.svg?height=300&width=250&text=파티룩2",
      "/placeholder.svg?height=300&width=250&text=파티룩3",
    ],
    items: [
      { name: "턱시도 재킷", price: 250000, image: "/placeholder.svg?height=200&width=150&text=턱시도" },
      { name: "턱시도 팬츠", price: 150000, image: "/placeholder.svg?height=200&width=150&text=턱시도팬츠" },
      { name: "보우타이", price: 45000, image: "/placeholder.svg?height=200&width=150&text=보우타이" },
      { name: "포멀 슈즈", price: 280000, image: "/placeholder.svg?height=200&width=150&text=포멀슈즈" },
    ],
    liked: false,
  },
]

export default function StylingResults() {
  const { stylingData } = useStyling()
  const [outfits, setOutfits] = useState(outfitRecommendations)
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({})
  const router = useRouter()

  // --- 추가된 상태 변수들 ---
  const [drapeTestImage, setDrapeTestImage] = useState<string | null>(null)
  const [backgroundColor, setBackgroundColor] = useState("#e0e0e0")
  // ---
  const [activeSection, setActiveSection] = useState("all")
  const businessRef = useRef<HTMLDivElement>(null)
  const casualRef = useRef<HTMLDivElement>(null)
  const formalRef = useRef<HTMLDivElement>(null)
  const recommendationsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load liked outfits from localStorage
    const savedOutfits = localStorage.getItem("savedOutfits")
    if (savedOutfits) {
      const savedOutfitIds = JSON.parse(savedOutfits)
      setOutfits((prev) =>
        prev.map((outfit) => ({
          ...outfit,
          liked: savedOutfitIds.includes(outfit.id),
        })),
      )
    }
    // --- drapeTestImage 로드 로직 추가 ---
    const savedImage = localStorage.getItem("drapeTestImage")
    if (savedImage) {
      setDrapeTestImage(savedImage)
    }
    // ---
  }, [])

  // --- 추가된 함수들 ---
  const handleColorSelect = (color: string) => {
    setBackgroundColor(color)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "나의 퍼스널컬러 & 스타일링 결과",
        text: `퍼스널컬러: ${stylingData.personalColor || ''}\n스타일: ${stylingData.userPreferredStyle?.join(", ") || ''}`, // stylingData 사용
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("링크가 복사되었습니다!")
    }
  }

  const handleSave = () => {
    const results = {
      personalColor: stylingData.personalColor, // stylingData 사용
      description: stylingData.description,
      recommendedColors: stylingData.recommendedColors,
      userPreferredStyle: stylingData.userPreferredStyle,
      drapeTestImage: drapeTestImage, // drapeTestImage 상태 사용
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("savedStylingResultsSummary", JSON.stringify(results)) // 새로운 키 사용
    alert("결과가 저장되었습니다!")
  }
  // ---

  const toggleLike = (outfitId: number) => {
    const outfit = outfits.find((o) => o.id === outfitId)
    if (!outfit) return

    const newLikedState = !outfit.liked
    setOutfits((prev) => prev.map((o) => (o.id === outfitId ? { ...o, liked: newLikedState } : o)))

    const savedOutfits = localStorage.getItem("savedOutfits")
    let savedOutfitIds = savedOutfits ? JSON.parse(savedOutfits) : []

    if (newLikedState) {
      if (!savedOutfitIds.includes(outfitId)) {
        savedOutfitIds.push(outfitId)
        const savedOutfitDetails = localStorage.getItem("savedOutfitDetails")
        const outfitDetails = savedOutfitDetails ? JSON.parse(savedOutfitDetails) : {}
        outfitDetails[outfitId] = { ...outfit, liked: true, savedAt: new Date().toISOString().split("T")[0] }
        localStorage.setItem("savedOutfitDetails", JSON.stringify(outfitDetails))
      }
    } else {
      savedOutfitIds = savedOutfitIds.filter((id: number) => id !== outfitId)
      const savedOutfitDetails = localStorage.getItem("savedOutfitDetails")
      if (savedOutfitDetails) {
        const outfitDetails = JSON.parse(savedOutfitDetails)
        delete outfitDetails[outfitId]
        localStorage.setItem("savedOutfitDetails", JSON.stringify(outfitDetails))
      }
    }
    localStorage.setItem("savedOutfits", JSON.stringify(savedOutfitIds))
    if (newLikedState) {
      alert("코디가 저장되었습니다! 마이페이지에서 확인할 수 있어요.")
    }
  }

  const handleRetryDiagnosis = () => {
    router.push("/styling-step1")
  }

  const handleViewLikedOutfits = () => {
    router.push("/my-page")
  }

  const nextImage = (outfitId: number, images: string[]) => {
    setCurrentImageIndex((prev) => ({ ...prev, [outfitId]: ((prev[outfitId] || 0) + 1) % images.length }))
  }

  const prevImage = (outfitId: number, images: string[]) => {
    setCurrentImageIndex((prev) => ({ ...prev, [outfitId]: ((prev[outfitId] || 0) - 1 + images.length) % images.length }))
  }

  const scrollToSection = (section: string) => {
    setActiveSection(section)

    if (section === 'all') {
      recommendationsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      return;
    }

    const ref = section === 'business' ? businessRef : section === 'casual' ? casualRef : formalRef;
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }
  
  // recommendedColors를 stylingData에서 가져오거나 기본값 사용
  const recommendedColorsFromStylingData = stylingData.recommendedColors?.slice(0, 3) || ["#FFB6C1", "#98FB98", "#87CEEB"];


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="styling" />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-600 text-sm font-medium mb-4">
            <Check className="h-4 w-4 mr-2" />
            분석 완료
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              맞춤 스타일링
            </span>{" "}
            결과
          </h1>
          <p className="text-lg text-gray-600">당신만을 위한 완벽한 코디를 찾아왔어요</p>
        </div>
        <div className="mb-8">
            {/* 상단 3개 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* 퍼스널컬러 카드 */}
                <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                                <Palette className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">퍼스널컬러</h3>
                        </div>

                        {stylingData.personalColor ? (
                            <div className="space-y-4">
                                <div>
                                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white mb-2">
                                        {stylingData.personalColor}
                                    </Badge>
                                    <p className="text-sm text-gray-600">{stylingData.description}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">추천 색상 팔레트</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(stylingData.recommendedColors || []).map((color, index) => (
                                            <div
                                                key={index}
                                                className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                                                style={{ backgroundColor: color }}
                                                title={`색상 ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500">퍼스널컬러 진단을 완료해주세요</p>
                                <Button
                                    onClick={() => router.push("/personal-color-diagnosis")}
                                    className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                    size="sm"
                                >
                                    진단하기
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
                {/* 선호 스타일 카드 */}
                <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">선호 스타일</h3>
                        </div>

                        {stylingData.userPreferredStyle && stylingData.userPreferredStyle.length > 0 ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">선택한 스타일</p>
                                    <div className="flex flex-wrap gap-2">
                                        {stylingData.userPreferredStyle.map((style, styleIndex) => (
                                            <Badge
                                                key={styleIndex}
                                                variant="outline"
                                                className="border-blue-200 text-blue-700 bg-blue-50"
                                            >
                                                {style}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500">스타일링 진단을 완료해주세요</p>
                                <Button
                                    onClick={() => router.push("/styling-step1")}
                                    className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                    size="sm"
                                >
                                    진단하기
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
                {/* 추천 색 매치 카드 */}
                <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                                <Palette className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">추천 색 매치</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-3">핵심 3색상</p>
                                <div className="flex justify-center gap-3">
                                    {recommendedColorsFromStylingData.map((color, index) => (
                                        <div key={index} className="text-center">
                                            <div
                                                className="w-12 h-12 rounded-full border-3 border-white shadow-lg mx-auto mb-1"
                                                style={{ backgroundColor: color }}
                                            />
                                            <p className="text-xs text-gray-500">색상 {index + 1}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSave}
                                    size="sm"
                                    className="flex-1 bg-gradient-to-r from-pink-600 to-red-600 text-white"
                                >
                                    <Heart className="h-4 w-4 mr-1" />
                                    저장
                                </Button>
                                <Button
                                    onClick={handleShare}
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 border-pink-200 text-pink-700 bg-transparent"
                                >
                                    <Share2 className="h-4 w-4 mr-1" />
                                    공유
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* 하단 드레이프 테스트 카드 (전체 폭) */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
                <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                            <Camera className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">미니 드레이프 테스트</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* 이미지 영역 */}
                        <div className="flex justify-center">
                            <div
                                className="relative rounded-2xl shadow-xl overflow-hidden"
                                style={{
                                    width: "100%",
                                    maxWidth: "400px",
                                    height: "250px",
                                    backgroundColor: backgroundColor, // backgroundColor 상태 사용
                                    transition: "background-color 0.5s ease-in-out",
                                }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-32 h-32 rounded-full overflow-hidden relative z-10">
                                        {drapeTestImage ? (
                                            <Image
                                                src={drapeTestImage || "/placeholder.svg"}
                                                alt="드레이프 테스트 이미지"
                                                width={128} // w-32 (128px) 에 맞춤
                                                height={128} // h-32 (128px) 에 맞춤
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <div className="text-center">
                                                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                                                    <p className="text-gray-500 text-xs">사진 없음</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 색상 선택 영역 */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">배경색 변경</h4>
                            <div className="grid grid-cols-6 gap-3">
                                {(stylingData.recommendedColors || [])
                                    .concat([
                                        "#FFFFFF", "#000000", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
                                        "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
                                    ])
                                    .map((color, index) => (
                                        <button
                                            key={index}
                                            className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform duration-200"
                                            style={{ backgroundColor: color }}
                                            onClick={() => handleColorSelect(color)} // handleColorSelect 함수 사용
                                            title={`색상 ${index + 1}`}
                                        />
                                    ))}
                            </div>
                            <div className="mt-6">
                                <Button
                                    onClick={() => router.push("/personal-color-drape-test")}
                                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                                >
                                    전체 드레이프 테스트 하기
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        
        {/* Style Navigation Bar */}
        <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 py-4 mb-8">
          <div className="flex items-center justify-start gap-2">
            <Button variant={activeSection === "all" ? "default" : "outline"} size="sm" onClick={() => scrollToSection("all")} className={`transition-all duration-200 ${activeSection === "all" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-white text-gray-600 hover:text-purple-600"}`}>VIEW ALL</Button>
            <Button variant={activeSection === "business" ? "default" : "outline"} size="sm" onClick={() => scrollToSection("business")} className={`transition-all duration-200 ${activeSection === "business" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-white text-gray-600 hover:text-purple-600"}`}>비즈니스</Button>
            <Button variant={activeSection === "casual" ? "default" : "outline"} size="sm" onClick={() => scrollToSection("casual")} className={`transition-all duration-200 ${activeSection === "casual" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-white text-gray-600 hover:text-purple-600"}`}>캐주얼</Button>
            <Button variant={activeSection === "formal" ? "default" : "outline"} size="sm" onClick={() => scrollToSection("formal")} className={`transition-all duration-200 ${activeSection === "formal" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-white text-gray-600 hover:text-purple-600"}`}>포멀</Button>
          </div>
        </div>

        {/* 맞춤 코디 추천 */}
        <div className="space-y-8" ref={recommendationsRef}>
          {/* 비즈니스 스타일 섹션 */}
          <Card ref={businessRef} className="border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <div className="mb-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">비즈니스 스타일</h4>
                <p className="text-gray-600">업무에서 이용하는 비즈니스 스타일 코디 3가지를 추천해드려요</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {outfits.filter((outfit) => outfit.category === "비즈니스").map((outfit, index) => (
                  <Card key={outfit.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white cursor-pointer border-gray-200" onClick={() => router.push(`/outfit-detail/${outfit.id}`)}>
                    <div className="relative">
                      <div className="absolute top-3 left-3 z-10"><div className="bg-white rounded-full px-2 py-1 text-xs font-bold text-gray-900">#{index + 1}</div></div>
                      <div className="absolute top-3 right-12 z-10"><div className="bg-green-500 text-white rounded-full px-2 py-1 text-xs font-bold">매치 {outfit.matchRate}%</div></div>
                      <div className="absolute top-3 right-3 z-10">
                        <Button variant="ghost" size="icon" className={`hover:text-red-500 bg-white/80 hover:bg-white/90 rounded-full w-8 h-8 ${outfit.liked ? "text-red-500" : "text-gray-400"}`} onClick={(e) => { e.stopPropagation(); toggleLike(outfit.id); }}>
                          <Heart className={`h-4 w-4 ${outfit.liked ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                      <div className="relative h-48 bg-gray-200">
                        <Image src={"https://image.msscdn.net/thumbnails/snap/images/2025/06/19/cfe45705dd1d4a7390ba14d7e0ca043e.jpg"} alt={outfit.title} width={250} height={300} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-3"><h5 className="font-bold text-lg text-gray-900 mb-1">{outfit.title}</h5><p className="text-sm text-gray-600">{outfit.category} 스타일의 완벽한 코디를 추천해드려요</p></div>
                      <div className="mb-4"><span className="text-sm font-medium text-gray-700 block mb-2">구성 아이템 ({outfit.items.length}개)</span><div className="space-y-1">{outfit.items.map((item, itemIndex) => (<div key={itemIndex} className="flex justify-between items-center text-sm"><span className="text-gray-600">{item.name}</span><span className="font-medium">{item.price.toLocaleString()}원</span></div>))}</div></div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className={`hover:text-red-500 hover:border-red-500 rounded-lg px-3 py-1.5 h-auto ${outfit.liked ? "text-red-500 border-red-500" : "text-gray-600 border-gray-200"}`} onClick={(e) => { e.stopPropagation(); toggleLike(outfit.id); }}><Heart className={`h-4 w-4 mr-1 ${outfit.liked ? "fill-current" : ""}`} />{outfit.liked ? "저장됨" : "저장하기"}</Button>
                        <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 hover:text-purple-600 hover:border-purple-600 rounded-lg px-2 py-1.5 h-auto bg-transparent" onClick={(e) => e.stopPropagation()}><Share2 className="h-4 w-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 캐주얼 스타일 섹션 */}
          <Card ref={casualRef} className="border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <div className="mb-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">캐주얼 스타일</h4>
                <p className="text-gray-600">편안하고 자유로운 캐주얼 스타일 코디 3가지를 추천해드려요</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {outfits.filter((outfit) => outfit.category === "캐주얼").map((outfit, index) => (
                  <Card key={outfit.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white cursor-pointer border-gray-200" onClick={() => router.push(`/outfit-detail/${outfit.id}`)}>
                    <div className="relative">
                      <div className="absolute top-3 left-3 z-10"><div className="bg-white rounded-full px-2 py-1 text-xs font-bold text-gray-900">#{index + 1}</div></div>
                      <div className="absolute top-3 right-12 z-10"><div className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs font-bold">매치 {outfit.matchRate}%</div></div>
                      <div className="absolute top-3 right-3 z-10">
                        <Button variant="ghost" size="icon" className={`hover:text-red-500 bg-white/80 hover:bg-white/90 rounded-full w-8 h-8 ${outfit.liked ? "text-red-500" : "text-gray-400"}`} onClick={(e) => { e.stopPropagation(); toggleLike(outfit.id); }}>
                          <Heart className={`h-4 w-4 ${outfit.liked ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                      <div className="relative h-48 bg-gray-200">
                        <Image src={outfit.images[currentImageIndex[outfit.id] || 0] || "/placeholder.svg"} alt={outfit.title} width={250} height={300} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-3"><h5 className="font-bold text-lg text-gray-900 mb-1">{outfit.title}</h5><p className="text-sm text-gray-600">{outfit.category} 스타일의 완벽한 코디를 추천해드려요</p></div>
                      <div className="mb-4"><span className="text-sm font-medium text-gray-700 block mb-2">구성 아이템 ({outfit.items.length}개)</span><div className="space-y-1">{outfit.items.map((item, itemIndex) => (<div key={itemIndex} className="flex justify-between items-center text-sm"><span className="text-gray-600">{item.name}</span><span className="font-medium">{item.price.toLocaleString()}원</span></div>))}</div></div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className={`hover:text-red-500 hover:border-red-500 rounded-lg px-3 py-1.5 h-auto ${outfit.liked ? "text-red-500 border-red-500" : "text-gray-600 border-gray-200"}`} onClick={(e) => { e.stopPropagation(); toggleLike(outfit.id); }}><Heart className={`h-4 w-4 mr-1 ${outfit.liked ? "fill-current" : ""}`} />{outfit.liked ? "저장됨" : "저장하기"}</Button>
                        <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 hover:text-purple-600 hover:border-purple-600 rounded-lg px-2 py-1.5 h-auto bg-transparent" onClick={(e) => e.stopPropagation()}><Share2 className="h-4 w-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 포멀 스타일 섹션 */}
          <Card ref={formalRef} className="border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <div className="mb-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">포멀 스타일</h4>
                <p className="text-gray-600">특별한 날을 위한 포멀 스타일 코디 3가지를 추천해드려요</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {outfits.filter((outfit) => outfit.category === "포멀").map((outfit, index) => (
                  <Card key={outfit.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white cursor-pointer border-gray-200" onClick={() => router.push(`/outfit-detail/${outfit.id}`)}>
                    <div className="relative">
                      <div className="absolute top-3 left-3 z-10"><div className="bg-white rounded-full px-2 py-1 text-xs font-bold text-gray-900">#{index + 1}</div></div>
                      <div className="absolute top-3 right-12 z-10"><div className="bg-purple-500 text-white rounded-full px-2 py-1 text-xs font-bold">매치 {outfit.matchRate}%</div></div>
                      <div className="absolute top-3 right-3 z-10">
                        <Button variant="ghost" size="icon" className={`hover:text-red-500 bg-white/80 hover:bg-white/90 rounded-full w-8 h-8 ${outfit.liked ? "text-red-500" : "text-gray-400"}`} onClick={(e) => { e.stopPropagation(); toggleLike(outfit.id); }}>
                          <Heart className={`h-4 w-4 ${outfit.liked ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                      <div className="relative h-48 bg-gray-200">
                        <Image src={outfit.images[currentImageIndex[outfit.id] || 0] || "/placeholder.svg"} alt={outfit.title} width={250} height={300} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-3"><h5 className="font-bold text-lg text-gray-900 mb-1">{outfit.title}</h5><p className="text-sm text-gray-600">{outfit.category} 스타일의 완벽한 코디를 추천해드려요</p></div>
                      <div className="mb-4"><span className="text-sm font-medium text-gray-700 block mb-2">구성 아이템 ({outfit.items.length}개)</span><div className="space-y-1">{outfit.items.map((item, itemIndex) => (<div key={itemIndex} className="flex justify-between items-center text-sm"><span className="text-gray-600">{item.name}</span><span className="font-medium">{item.price.toLocaleString()}원</span></div>))}</div></div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className={`hover:text-red-500 hover:border-red-500 rounded-lg px-3 py-1.5 h-auto ${outfit.liked ? "text-red-500 border-red-500" : "text-gray-600 border-gray-200"}`} onClick={(e) => { e.stopPropagation(); toggleLike(outfit.id); }}><Heart className={`h-4 w-4 mr-1 ${outfit.liked ? "fill-current" : ""}`} />{outfit.liked ? "저장됨" : "저장하기"}</Button>
                        <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 hover:text-purple-600 hover:border-purple-600 rounded-lg px-2 py-1.5 h-auto bg-transparent" onClick={(e) => e.stopPropagation()}><Share2 className="h-4 w-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between mt-12">
          <Button variant="outline" onClick={handleRetryDiagnosis} className="flex items-center px-6 py-3 bg-transparent border-gray-200"><RefreshCw className="h-4 w-4 mr-2" />다시 진단하기</Button>
          <Button onClick={handleViewLikedOutfits} className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"><Heart className="h-4 w-4 mr-2" />저장된 코디 보기</Button>
        </div>
      </div>
    </div>
  )
}
