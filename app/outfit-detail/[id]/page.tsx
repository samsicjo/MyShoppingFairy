"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, ArrowLeft, Share2, Star, Eye } from "lucide-react"

const outfitDetails = {
  1: {
    id: 1,
    title: "데일리 캐주얼 룩",
    description: "편안하면서도 스타일리시한 데일리 캐주얼 룩으로, 일상생활에서 자연스럽게 연출할 수 있는 코디입니다.",
    mainImage: "/placeholder.svg?height=600&width=400&text=데일리캐주얼룩",
    totalPrice: 224000,
    personalColorMatch: 85,
    styleMatch: 88,
    items: [
      {
        id: 1,
        name: "화이트 티셔츠",
        brand: "UNIQLO",
        price: 25000,
        description: "부드러운 코튼 소재의 베이직 화이트 티셔츠",
        image: "/placeholder.svg?height=300&width=250&text=화이트티셔츠",
        rating: 4.5,
        reviews: 128,
        liked: false,
        wearingShots: [
          "/placeholder.svg?height=400&width=300&text=착용샷1",
          "/placeholder.svg?height=400&width=300&text=착용샷2",
          "/placeholder.svg?height=400&width=300&text=착용샷3",
        ],
      },
      {
        id: 2,
        name: "데님 팬츠",
        brand: "ZARA",
        price: 65000,
        description: "슬림핏 스트레치 데님 팬츠",
        image: "/placeholder.svg?height=300&width=250&text=데님팬츠",
        rating: 4.3,
        reviews: 89,
        liked: false,
        wearingShots: [
          "/placeholder.svg?height=400&width=300&text=데님착용샷1",
          "/placeholder.svg?height=400&width=300&text=데님착용샷2",
        ],
      },
      {
        id: 3,
        name: "스니커즈",
        brand: "ADIDAS",
        price: 89000,
        description: "편안한 쿠셔닝의 화이트 스니커즈",
        image: "/placeholder.svg?height=300&width=250&text=스니커즈",
        rating: 4.7,
        reviews: 312,
        liked: false,
        wearingShots: [
          "/placeholder.svg?height=400&width=300&text=신발착용샷1",
          "/placeholder.svg?height=400&width=300&text=신발착용샷2",
          "/placeholder.svg?height=400&width=300&text=신발착용샷3",
          "/placeholder.svg?height=400&width=300&text=신발착용샷4",
        ],
      },
      {
        id: 4,
        name: "크로스백",
        brand: "CHARLES & KEITH",
        price: 45000,
        description: "실용적인 크로스백",
        image: "/placeholder.svg?height=300&width=250&text=크로스백",
        rating: 4.2,
        reviews: 156,
        liked: false,
        wearingShots: [
          "/placeholder.svg?height=400&width=300&text=가방착용샷1",
          "/placeholder.svg?height=400&width=300&text=가방착용샷2",
        ],
      },
    ],
    stylingTips: [
      "화이트 티셔츠는 데님 팬츠에 살짝 넣어서 깔끔한 실루엣을 연출하세요",
      "스니커즈는 전체적인 캐주얼함을 더해주면서도 편안함을 제공합니다",
      "크로스백은 어깨에 메거나 몸에 밀착시켜 활동적인 느낌을 연출하세요",
    ],
    liked: false,
  },
  2: {
    id: 2,
    title: "편안한 주말 룩",
    description: "주말 나들이나 친구들과의 만남에 완벽한 편안하면서도 세련된 룩입니다.",
    mainImage: "/placeholder.svg?height=600&width=400&text=주말룩",
    totalPrice: 200000,
    personalColorMatch: 78,
    styleMatch: 90,
    items: [
      {
        id: 5,
        name: "후드 티셔츠",
        brand: "H&M",
        price: 45000,
        description: "부드러운 기모 안감의 후드 티셔츠",
        image: "/placeholder.svg?height=300&width=250&text=후드티셔츠",
        rating: 4.4,
        reviews: 167,
        liked: false,
        wearingShots: [
          "/placeholder.svg?height=400&width=300&text=후드착용샷1",
          "/placeholder.svg?height=400&width=300&text=후드착용샷2",
        ],
      },
      {
        id: 6,
        name: "조거 팬츠",
        brand: "NIKE",
        price: 35000,
        description: "편안한 조거 팬츠",
        image: "/placeholder.svg?height=300&width=250&text=조거팬츠",
        rating: 4.1,
        reviews: 94,
        liked: false,
        wearingShots: ["/placeholder.svg?height=400&width=300&text=조거착용샷1"],
      },
      {
        id: 7,
        name: "운동화",
        brand: "NEW BALANCE",
        price: 120000,
        description: "쿠셔닝이 뛰어한 운동화",
        image: "/placeholder.svg?height=300&width=250&text=운동화",
        rating: 4.7,
        reviews: 312,
        liked: false,
        wearingShots: [
          "/placeholder.svg?height=400&width=300&text=운동화착용샷1",
          "/placeholder.svg?height=400&width=300&text=운동화착용샷2",
        ],
      },
    ],
    stylingTips: [
      "후드 티셔츠는 조거 팬츠와 함께 편안한 스포티 룩을 연출합니다",
      "운동화는 전체적인 캐주얼함을 완성시켜주는 핵심 아이템입니다",
      "레이어링을 통해 다양한 스타일 변화를 줄 수 있습니다",
    ],
    liked: false,
  },
  3: {
    id: 3,
    title: "캐주얼 외출 룩",
    description: "친구들과의 만남이나 가벼운 외출에 완벽한 캐주얼 스타일입니다.",
    mainImage: "/placeholder.svg?height=600&width=400&text=캐주얼외출룩",
    totalPrice: 263000,
    personalColorMatch: 82,
    styleMatch: 85,
    items: [
      {
        id: 8,
        name: "니트 스웨터",
        brand: "UNIQLO",
        price: 55000,
        description: "부드러운 울 혼방 니트 스웨터",
        image: "/placeholder.svg?height=300&width=250&text=니트스웨터",
        rating: 4.3,
        reviews: 203,
        liked: false,
        wearingShots: [
          "/placeholder.svg?height=400&width=300&text=니트착용샷1",
          "/placeholder.svg?height=400&width=300&text=니트착용샷2",
        ],
      },
      {
        id: 9,
        name: "치노 팬츠",
        brand: "ZARA",
        price: 48000,
        description: "슬림핏 치노 팬츠",
        image: "/placeholder.svg?height=300&width=250&text=치노팬츠",
        rating: 4.2,
        reviews: 156,
        liked: false,
        wearingShots: [
          "/placeholder.svg?height=400&width=300&text=치노착용샷1",
          "/placeholder.svg?height=400&width=300&text=치노착용샷2",
        ],
      },
      {
        id: 10,
        name: "로퍼",
        brand: "CLARKS",
        price: 95000,
        description: "클래식한 가죽 로퍼",
        image: "/placeholder.svg?height=300&width=250&text=로퍼",
        rating: 4.6,
        reviews: 89,
        liked: false,
        wearingShots: [
          "/placeholder.svg?height=400&width=300&text=로퍼착용샷1",
          "/placeholder.svg?height=400&width=300&text=로퍼착용샷2",
        ],
      },
      {
        id: 11,
        name: "토트백",
        brand: "MUJI",
        price: 65000,
        description: "심플한 캔버스 토트백",
        image: "/placeholder.svg?height=300&width=250&text=토트백",
        rating: 4.4,
        reviews: 124,
        liked: false,
        wearingShots: ["/placeholder.svg?height=400&width=300&text=토트백착용샷1"],
      },
    ],
    stylingTips: [
      "니트 스웨터는 치노 팬츠와 함께 깔끔한 캐주얼 룩을 연출합니다",
      "로퍼는 전체적인 룩에 세련된 포인트를 더해줍니다",
      "토트백으로 실용성과 스타일을 동시에 잡을 수 있습니다",
    ],
    liked: false,
  },
  4: {
    id: 4,
    title: "클래식 오피스 룩",
    description: "업무 환경에서 전문적이고 세련된 인상을 주는 비즈니스 스타일입니다.",
    mainImage: "/placeholder.svg?height=600&width=400&text=클래식오피스룩",
    totalPrice: 280000,
    personalColorMatch: 88,
    styleMatch: 92,
    items: [
      {
        id: 12,
        name: "블라우스",
        brand: "THEORY",
        price: 75000,
        description: "실크 혼방 블라우스",
        image: "/placeholder.svg?height=300&width=250&text=블라우스",
        rating: 4.5,
        reviews: 167,
        liked: false,
        wearingShots: [
          "/placeholder.svg?height=400&width=300&text=블라우스착용샷1",
          "/placeholder.svg?height=400&width=300&text=블라우스착용샷2",
        ],
      },
      {
        id: 13,
        name: "슬랙스",
        brand: "BANANA REPUBLIC",
        price: 85000,
        description: "스트레치 슬랙스",
        image: "/placeholder.svg?height=300&width=250&text=슬랙스",
        rating: 4.3,
        reviews: 134,
        liked: false,
        wearingShots: ["/placeholder.svg?height=400&width=300&text=슬랙스착용샷1"],
      },
      {
        id: 14,
        name: "펌프스",
        brand: "STUART WEITZMAN",
        price: 120000,
        description: "클래식 펌프스",
        image: "/placeholder.svg?height=300&width=250&text=펌프스",
        rating: 4.7,
        reviews: 89,
        liked: false,
        wearingShots: [
          "/placeholder.svg?height=400&width=300&text=펌프스착용샷1",
          "/placeholder.svg?height=400&width=300&text=펌프스착용샷2",
        ],
      },
    ],
    stylingTips: [
      "블라우스는 슬랙스에 넣어서 깔끔한 실루엣을 만드세요",
      "펌프스는 다리를 길어 보이게 하는 효과가 있습니다",
      "액세서리는 최소한으로 하여 전문적인 인상을 유지하세요",
    ],
    liked: false,
  },
  5: {
    id: 5,
    title: "모던 비즈니스 룩",
    description: "현대적이고 세련된 비즈니스 룩으로 자신감을 표현하세요.",
    mainImage: "/placeholder.svg?height=600&width=400&text=모던비즈니스룩",
    totalPrice: 425000,
    personalColorMatch: 92,
    styleMatch: 88,
    items: [
      {
        id: 15,
        name: "정장 재킷",
        brand: "HUGO BOSS",
        price: 150000,
        description: "슬림핏 정장 재킷",
        image: "/placeholder.svg?height=300&width=250&text=정장재킷",
        rating: 4.6,
        reviews: 203,
        liked: false,
        wearingShots: [
          "/placeholder.svg?height=400&width=300&text=재킷착용샷1",
          "/placeholder.svg?height=400&width=300&text=재킷착용샷2",
        ],
      },
      {
        id: 16,
        name: "정장 바지",
        brand: "HUGO BOSS",
        price: 95000,
        description: "매칭 정장 바지",
        image: "/placeholder.svg?height=300&width=250&text=정장바지",
        rating: 4.4,
        reviews: 156,
        liked: false,
        wearingShots: ["/placeholder.svg?height=400&width=300&text=정장바지착용샷1"],
      },
      {
        id: 17,
        name: "드레스 슈즈",
        brand: "COLE HAAN",
        price: 180000,
        description: "가죽 드레스 슈즈",
        image: "/placeholder.svg?height=300&width=250&text=드레스슈즈",
        rating: 4.8,
        reviews: 124,
        liked: false,
        wearingShots: [
          "/placeholder.svg?height=400&width=300&text=구두착용샷1",
          "/placeholder.svg?height=400&width=300&text=구두착용샷2",
        ],
      },
    ],
    stylingTips: [
      "재킷과 바지의 핏이 중요합니다. 몸에 맞게 수선하세요",
      "드레스 슈즈는 정장과 같은 톤으로 맞추는 것이 좋습니다",
      "셔츠는 깔끔하게 다림질하여 전문적인 인상을 주세요",
    ],
    liked: false,
  },
  6: {
    id: 6,
    title: "스마트 비즈니스 룩",
    description: "스마트하고 현대적인 비즈니스 캐주얼 스타일입니다.",
    mainImage: "/placeholder.svg?height=600&width=400&text=스마트비즈니스룩",
    totalPrice: 420000,
    personalColorMatch: 90,
    styleMatch: 87,
    items: [
      {
        id: 18,
        name: "셔츠",
        brand: "RALPH LAUREN",
        price: 65000,
        description: "코튼 드레스 셔츠",
        image: "/placeholder.svg?height=300&width=250&text=셔츠",
        rating: 4.5,
        reviews: 189,
        liked: false,
        wearingShots: [
          "/placeholder.svg?height=400&width=300&text=셔츠착용샷1",
          "/placeholder.svg?height=400&width=300&text=셔츠착용샷2",
        ],
      },
      {
        id: 19,
        name: "베스트",
        brand: "BROOKS BROTHERS",
        price: 85000,
        description: "울 혼방 베스트",
        image: "/placeholder.svg?height=300&width=250&text=베스트",
        rating: 4.3,
        reviews: 98,
        liked: false,
        wearingShots: ["/placeholder.svg?height=400&width=300&text=베스트착용샷1"],
      },
      {
        id: 20,
        name: "정장 팬츠",
        brand: "BANANA REPUBLIC",
        price: 110000,
        description: "슬림핏 정장 팬츠",
        image: "/placeholder.svg?height=300&width=250&text=정장팬츠",
        rating: 4.4,
        reviews: 145,
        liked: false,
        wearingShots: ["/placeholder.svg?height=400&width=300&text=정장팬츠착용샷1"],
      },
      {
        id: 21,
        name: "옥스포드 슈즈",
        brand: "JOHNSTON & MURPHY",
        price: 160000,
        description: "클래식 옥스포드 슈즈",
        image: "/placeholder.svg?height=300&width=250&text=옥스포드슈즈",
        rating: 4.7,
        reviews: 167,
        liked: false,
        wearingShots: [
          "/placeholder.svg?height=400&width=300&text=옥스포드착용샷1",
          "/placeholder.svg?height=400&width=300&text=옥스포드착용샷2",
        ],
      },
    ],
    stylingTips: [
      "베스트를 추가하여 레이어드 룩을 연출하세요",
      "셔츠 소매는 재킷에서 1-2cm 정도 나오게 하세요",
      "옥스포드 슈즈는 정장 팬츠와 잘 어울리는 클래식한 선택입니다",
    ],
    liked: false,
  },
  7: {
    id: 7,
    title: "클래식 정장 스타일",
    description: "격식 있는 자리에 완벽한 클래식 정장 스타일입니다.",
    mainImage: "/placeholder.svg?height=600&width=400&text=클래식정장스타일",
    totalPrice: 605000,
    personalColorMatch: 90,
    styleMatch: 95,
    items: [
      {
        id: 22,
        name: "정장 셔츠",
        brand: "ERMENEGILDO ZEGNA",
        price: 65000,
        description: "프리미엄 코튼 셔츠",
        image: "/placeholder.svg?height=300&width=250&text=정장셔츠",
        rating: 4.8,
        reviews: 234,
        liked: false,
        wearingShots: ["/placeholder.svg?height=400&width=300&text=정장셔츠착용샷1"],
      },
      {
        id: 23,
        name: "수트 재킷",
        brand: "ARMANI",
        price: 200000,
        description: "이탈리안 수트 재킷",
        image: "/placeholder.svg?height=300&width=250&text=수트재킷",
        rating: 4.9,
        reviews: 156,
        liked: false,
        wearingShots: [
          "/placeholder.svg?height=400&width=300&text=수트재킷착용샷1",
          "/placeholder.svg?height=400&width=300&text=수트재킷착용샷2",
        ],
      },
      {
        id: 24,
        name: "수트 팬츠",
        brand: "ARMANI",
        price: 120000,
        description: "매칭 수트 팬츠",
        image: "/placeholder.svg?height=300&width=250&text=수트팬츠",
        rating: 4.7,
        reviews: 134,
        liked: false,
        wearingShots: ["/placeholder.svg?height=400&width=300&text=수트팬츠착용샷1"],
      },
      {
        id: 25,
        name: "옥스포드 슈즈",
        brand: "CHURCH'S",
        price: 220000,
        description: "핸드메이드 옥스포드 슈즈",
        image: "/placeholder.svg?height=300&width=250&text=프리미엄옥스포드",
        rating: 4.9,
        reviews: 89,
        liked: false,
        wearingShots: ["/placeholder.svg?height=400&width=300&text=프리미엄옥스포드착용샷1"],
      },
    ],
    stylingTips: [
      "수트는 몸에 완벽하게 맞도록 전문적인 수선을 받으세요",
      "셔츠는 깔끔하게 다림질하고 넥타이와 조화를 이루도록 하세요",
      "구두는 정기적으로 관리하여 광택을 유지하세요",
    ],
    liked: false,
  },
  8: {
    id: 8,
    title: "이벤트 드레스 룩",
    description: "특별한 이벤트나 파티에 완벽한 우아한 드레스 룩입니다.",
    mainImage: "/placeholder.svg?height=600&width=400&text=이벤트드레스룩",
    totalPrice: 415000,
    personalColorMatch: 87,
    styleMatch: 91,
    items: [
      {
        id: 26,
        name: "이브닝 드레스",
        brand: "DIANE VON FURSTENBERG",
        price: 180000,
        description: "실크 이브닝 드레스",
        image: "/placeholder.svg?height=300&width=250&text=이브닝드레스",
        rating: 4.6,
        reviews: 145,
        liked: false,
        wearingShots: [
          "/placeholder.svg?height=400&width=300&text=드레스착용샷1",
          "/placeholder.svg?height=400&width=300&text=드레스착용샷2",
        ],
      },
      {
        id: 27,
        name: "하이힐",
        brand: "JIMMY CHOO",
        price: 150000,
        description: "스틸레토 하이힐",
        image: "/placeholder.svg?height=300&width=250&text=하이힐",
        rating: 4.4,
        reviews: 98,
        liked: false,
        wearingShots: ["/placeholder.svg?height=400&width=300&text=하이힐착용샷1"],
      },
      {
        id: 28,
        name: "클러치백",
        brand: "KATE SPADE",
        price: 85000,
        description: "이브닝 클러치백",
        image: "/placeholder.svg?height=300&width=250&text=클러치백",
        rating: 4.5,
        reviews: 167,
        liked: false,
        wearingShots: ["/placeholder.svg?height=400&width=300&text=클러치백착용샷1"],
      },
    ],
    stylingTips: [
      "드레스의 길이에 맞는 하이힐 높이를 선택하세요",
      "클러치백은 드레스와 대비되는 색상으로 포인트를 주세요",
      "액세서리는 과하지 않게 우아함을 강조하세요",
    ],
    liked: false,
  },
  9: {
    id: 9,
    title: "파티 정장 룩",
    description: "격식 있는 파티나 갈라 이벤트에 완벽한 정장 스타일입니다.",
    mainImage: "/placeholder.svg?height=600&width=400&text=파티정장룩",
    totalPrice: 725000,
    personalColorMatch: 93,
    styleMatch: 96,
    items: [
      {
        id: 29,
        name: "턱시도 재킷",
        brand: "TOM FORD",
        price: 250000,
        description: "블랙 턱시도 재킷",
        image: "/placeholder.svg?height=300&width=250&text=턱시도재킷",
        rating: 4.9,
        reviews: 89,
        liked: false,
        wearingShots: ["/placeholder.svg?height=400&width=300&text=턱시도재킷착용샷1"],
      },
      {
        id: 30,
        name: "턱시도 팬츠",
        brand: "TOM FORD",
        price: 150000,
        description: "매칭 턱시도 팬츠",
        image: "/placeholder.svg?height=300&width=250&text=턱시도팬츠",
        rating: 4.8,
        reviews: 67,
        liked: false,
        wearingShots: ["/placeholder.svg?height=400&width=300&text=턱시도팬츠착용샷1"],
      },
      {
        id: 31,
        name: "보우타이",
        brand: "HERMÈS",
        price: 45000,
        description: "실크 보우타이",
        image: "/placeholder.svg?height=300&width=250&text=보우타이",
        rating: 4.7,
        reviews: 134,
        liked: false,
        wearingShots: ["/placeholder.svg?height=400&width=300&text=보우타이착용샷1"],
      },
      {
        id: 32,
        name: "포멀 슈즈",
        brand: "BERLUTI",
        price: 280000,
        description: "핸드메이드 포멀 슈즈",
        image: "/placeholder.svg?height=300&width=250&text=포멀슈즈",
        rating: 5.0,
        reviews: 45,
        liked: false,
        wearingShots: ["/placeholder.svg?height=400&width=300&text=포멀슈즈착용샷1"],
      },
    ],
    stylingTips: [
      "턱시도는 완벽한 핏이 가장 중요합니다",
      "보우타이는 직접 매는 것이 더욱 격식 있어 보입니다",
      "포멀 슈즈는 광택을 내어 완벽한 마무리를 하세요",
    ],
    liked: false,
  },
}

export default function OutfitDetail() {
  const params = useParams()
  const router = useRouter()
  const outfitId = Number.parseInt(params.id as string)
  const outfit = outfitDetails[outfitId as keyof typeof outfitDetails]

  const [liked, setLiked] = useState(outfit?.liked || false)
  const [likedItems, setLikedItems] = useState<number[]>([])
  const [selectedWearingShots, setSelectedWearingShots] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    // 찜한 아이템 목록 불러오기
    const savedLikedItems = localStorage.getItem("likedItems")
    if (savedLikedItems) {
      setLikedItems(JSON.parse(savedLikedItems))
    }
  }, [])

  if (!outfit) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">코디를 찾을 수 없습니다</h1>
          <Button onClick={() => router.back()}>돌아가기</Button>
        </div>
      </div>
    )
  }

  const toggleOutfitLike = () => {
    setLiked(!liked)
  }

  const toggleItemLike = (itemId: number) => {
    const newLikedItems = likedItems.includes(itemId)
      ? likedItems.filter((id) => id !== itemId)
      : [...likedItems, itemId]

    setLikedItems(newLikedItems)
    localStorage.setItem("likedItems", JSON.stringify(newLikedItems))
  }

  const viewWearingShot = (itemId: number, shotIndex: number) => {
    setSelectedWearingShots((prev) => ({ ...prev, [itemId]: shotIndex }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
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
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleOutfitLike}
                  className={liked ? "text-red-500" : ""}
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 제목 및 기본 정보 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="secondary">베스트</Badge>
            <Badge variant="secondary">추천</Badge>
            <Badge variant="secondary">코디</Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{outfit.title}</h1>
          <p className="text-gray-600 mb-4">{outfit.description}</p>
          <div className="text-3xl font-bold text-purple-600 mb-6">총 {outfit.totalPrice.toLocaleString()}원</div>
        </div>

        {/* 매칭 분석 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-4">
              <span className="text-lg font-semibold text-gray-900">🎯 매칭 분석</span>
            </div>
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">퍼스널컬러 매칭</span>
                  <span className="text-sm font-bold text-purple-600">{outfit.personalColorMatch}%</span>
                </div>
                <Progress value={outfit.personalColorMatch} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">스타일 매칭</span>
                  <span className="text-sm font-bold text-purple-600">{outfit.styleMatch}%</span>
                </div>
                <Progress value={outfit.styleMatch} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 메인 이미지 + 스타일링 팁 */}
          <div className="space-y-6">
            {/* 메인 이미지 */}
            <Card className="overflow-hidden">
              <Image
                src={outfit.mainImage || "/placeholder.svg"}
                alt={outfit.title}
                width={500}
                height={600}
                className="w-full h-[600px] object-cover"
              />
            </Card>

            {/* 스타일링 팁 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-lg font-bold text-gray-900">⭐ 스타일링 팁</span>
                </div>
                <div className="space-y-3">
                  {outfit.stylingTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-600 text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 구성 아이템 */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">구성 아이템</h3>
                <div className="space-y-6">
                  {outfit.items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex gap-4">
                        <div className="relative flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-lg bg-white"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                              <p className="text-sm text-gray-600">{item.brand}</p>
                              <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-lg font-bold text-gray-900">{item.price.toLocaleString()}원</div>
                              <div className="text-xs text-gray-500">무료배송</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600 ml-1">
                                {item.rating} ({item.reviews})
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 mb-3">
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                              구매하기
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleItemLike(item.id)}
                              className={likedItems.includes(item.id) ? "text-red-500 border-red-500" : ""}
                            >
                              <Heart className={`h-4 w-4 mr-1 ${likedItems.includes(item.id) ? "fill-current" : ""}`} />
                              찜하기
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              착용샷
                            </Button>
                          </div>

                          {/* 착용샷 미리보기 */}
                          {item.wearingShots && item.wearingShots.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto">
                              {item.wearingShots.slice(0, 4).map((shot, index) => (
                                <div
                                  key={index}
                                  className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => viewWearingShot(item.id, index)}
                                >
                                  <Image
                                    src={shot || "/placeholder.svg"}
                                    alt={`${item.name} 착용샷 ${index + 1}`}
                                    width={50}
                                    height={50}
                                    className="w-12 h-12 object-cover rounded border-2 border-gray-200 hover:border-purple-400 bg-white"
                                  />
                                </div>
                              ))}
                              {item.wearingShots.length > 4 && (
                                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded border-2 border-gray-200 flex items-center justify-center">
                                  <span className="text-xs text-gray-500">+{item.wearingShots.length - 4}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 전체 구매 버튼 */}
            <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg font-medium">
              전체 구매하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
