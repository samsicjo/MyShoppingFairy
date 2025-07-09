"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Share2, Download, ZoomIn } from "lucide-react"

// 아이템별 착용샷 데이터
const wearingShotsData: { [key: number]: any } = {
  1: {
    id: 1,
    name: "화이트 티셔츠",
    brand: "UNIQLO",
    price: 25000,
    category: "상의",
    mainImage: "/placeholder.svg?height=400&width=300&text=화이트티셔츠",
    wearingShots: [
      {
        id: 1,
        image: "/placeholder.svg?height=600&width=400&text=착용샷1",
        title: "데일리 캐주얼 룩",
        description: "편안한 일상복으로 완벽한 화이트 티셔츠",
        tags: ["데일리", "캐주얼", "심플"],
        likes: 124,
      },
      {
        id: 2,
        image: "/placeholder.svg?height=600&width=400&text=착용샷2",
        title: "레이어드 스타일링",
        description: "가디건과 함께 레이어드한 스타일링",
        tags: ["레이어드", "가을", "코디"],
        likes: 89,
      },
      {
        id: 3,
        image: "/placeholder.svg?height=600&width=400&text=착용샷3",
        title: "미니멀 룩",
        description: "깔끔하고 미니멀한 스타일링",
        tags: ["미니멀", "깔끔", "베이직"],
        likes: 156,
      },
    ],
  },
  2: {
    id: 2,
    name: "데님 팬츠",
    brand: "ZARA",
    price: 65000,
    category: "하의",
    mainImage: "/placeholder.svg?height=400&width=300&text=데님팬츠",
    wearingShots: [
      {
        id: 1,
        image: "/placeholder.svg?height=600&width=400&text=데님착용샷1",
        title: "클래식 데님 룩",
        description: "언제나 완벽한 클래식 데님 스타일링",
        tags: ["클래식", "데님", "베이직"],
        likes: 203,
      },
      {
        id: 2,
        image: "/placeholder.svg?height=600&width=400&text=데님착용샷2",
        title: "스트릿 스타일",
        description: "스트릿 감성의 데님 코디네이션",
        tags: ["스트릿", "힙합", "캐주얼"],
        likes: 178,
      },
    ],
  },
  3: {
    id: 3,
    name: "스니커즈",
    brand: "ADIDAS",
    price: 89000,
    category: "신발",
    mainImage: "/placeholder.svg?height=400&width=300&text=스니커즈",
    wearingShots: [
      {
        id: 1,
        image: "/placeholder.svg?height=600&width=400&text=신발착용샷1",
        title: "스포티 룩",
        description: "운동복과 함께한 스포티한 스타일링",
        tags: ["스포티", "운동", "액티브"],
        likes: 267,
      },
      {
        id: 2,
        image: "/placeholder.svg?height=600&width=400&text=신발착용샷2",
        title: "캐주얼 데일리",
        description: "일상에서 편안하게 신을 수 있는 스타일링",
        tags: ["데일리", "편안함", "캐주얼"],
        likes: 145,
      },
      {
        id: 3,
        image: "/placeholder.svg?height=600&width=400&text=신발착용샷3",
        title: "스트릿 패션",
        description: "스트릿 패션의 완성, 스니커즈 코디",
        tags: ["스트릿", "패션", "트렌디"],
        likes: 189,
      },
      {
        id: 4,
        image: "/placeholder.svg?height=600&width=400&text=신발착용샷4",
        title: "모던 캐주얼",
        description: "모던하고 세련된 캐주얼 룩",
        tags: ["모던", "세련", "캐주얼"],
        likes: 234,
      },
    ],
  },
}

export default function WearingShots() {
  const params = useParams()
  const router = useRouter()
  const itemId = Number.parseInt(params.id as string)
  const itemData = wearingShotsData[itemId]

  const [selectedShot, setSelectedShot] = useState<any>(null)
  const [likedShots, setLikedShots] = useState<number[]>([])

  if (!itemData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">아이템을 찾을 수 없습니다</h1>
          <Button onClick={() => router.back()}>돌아가기</Button>
        </div>
      </div>
    )
  }

  const toggleLike = (shotId: number) => {
    setLikedShots((prev) => (prev.includes(shotId) ? prev.filter((id) => id !== shotId) : [...prev, shotId]))
  }

  const openLightbox = (shot: any) => {
    setSelectedShot(shot)
  }

  const closeLightbox = () => {
    setSelectedShot(null)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                StyleGenius
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.back()} className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                돌아가기
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 아이템 정보 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <Image
                  src={itemData.mainImage || "/placeholder.svg"}
                  alt={itemData.name}
                  width={120}
                  height={120}
                  className="w-30 h-30 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{itemData.category}</Badge>
                  <Badge className="bg-red-500">
                    <Heart className="h-3 w-3 mr-1 fill-current" />찜
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{itemData.name}</h1>
                <p className="text-gray-600 mb-2">{itemData.brand}</p>
                <p className="text-2xl font-bold text-purple-600">{itemData.price.toLocaleString()}원</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 착용샷 제목 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">착용샷 갤러리</h2>
          <p className="text-gray-600">다양한 스타일링으로 연출된 {itemData.name}의 착용샷을 확인해보세요</p>
        </div>

        {/* 착용샷 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {itemData.wearingShots.map((shot: any) => (
            <Card key={shot.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <Image
                  src={shot.image || "/placeholder.svg"}
                  alt={shot.title}
                  width={400}
                  height={600}
                  className="w-full h-80 object-cover cursor-pointer"
                  onClick={() => openLightbox(shot)}
                />

                {/* 호버 오버레이 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openLightbox(shot)}
                    className="bg-white/90 hover:bg-white"
                  >
                    <ZoomIn className="h-4 w-4 mr-2" />
                    크게 보기
                  </Button>
                </div>

                {/* 좋아요 버튼 */}
                <div className="absolute top-3 right-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${
                      likedShots.includes(shot.id) ? "text-red-500" : "text-white"
                    } hover:text-red-500 bg-black/20 hover:bg-black/40 rounded-full w-8 h-8`}
                    onClick={() => toggleLike(shot.id)}
                  >
                    <Heart className={`h-4 w-4 ${likedShots.includes(shot.id) ? "fill-current" : ""}`} />
                  </Button>
                </div>

                {/* 좋아요 수 */}
                <div className="absolute bottom-3 left-3">
                  <div className="bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <Heart className="h-3 w-3 mr-1 fill-current" />
                    {shot.likes}
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{shot.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{shot.description}</p>

                {/* 태그 */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {shot.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* 액션 버튼 */}
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleLike(shot.id)}
                    className={`${
                      likedShots.includes(shot.id) ? "text-red-500 border-red-500" : "text-gray-600 border-gray-200"
                    } hover:text-red-500 hover:border-red-500`}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${likedShots.includes(shot.id) ? "fill-current" : ""}`} />
                    {likedShots.includes(shot.id) ? "좋아요" : "좋아요"}
                  </Button>
                  <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 bg-transparent">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 관련 아이템 추천 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">이런 아이템은 어떠세요?</h3>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">비슷한 스타일의 다른 아이템들을 확인해보세요</p>
              <Button
                onClick={() => router.push("/styling-results")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                더 많은 아이템 보기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 라이트박스 모달 */}
      {selectedShot && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeLightbox}>
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedShot.image || "/placeholder.svg"}
              alt={selectedShot.title}
              width={800}
              height={1200}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />

            {/* 닫기 버튼 */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
            >
              ✕
            </Button>

            {/* 정보 오버레이 */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">{selectedShot.title}</h3>
              <p className="text-sm mb-2">{selectedShot.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {selectedShot.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
