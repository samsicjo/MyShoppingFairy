"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { useStyleData, Look } from "@/app/context/StyleDataContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/Header";
import { Heart, Share2, Loader2 } from "lucide-react"

export default function OutfitDetail() {
  const params = useParams();
  const router = useRouter();
  const { recommendations, isInitializing, error } = useStyleData();

  const [likedItems, setLikedItems] = useState<string[]>([]);

  useEffect(() => {
    const savedLikedItems = localStorage.getItem("likedItems");
    if (savedLikedItems) {
      setLikedItems(JSON.parse(savedLikedItems));
    }
    console.log('recommand : ', recommendations)
  }, []);

  const toggleItemLike = (itemCode: string) => {
    const newLikedItems = likedItems.includes(itemCode)
      ? likedItems.filter((code) => code !== itemCode)
      : [...likedItems, itemCode];
    setLikedItems(newLikedItems);
    localStorage.setItem("likedItems", JSON.stringify(newLikedItems));
  };

  // 로딩 및 초기화 상태 먼저 확인
  if (isInitializing) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
            <p className="ml-4 text-lg">코디 정보를 불러오는 중...</p>
        </div>
    );
  }

  // 렌더링 시점에 직접 look을 찾습니다.
  const lookName = params.id ? decodeURIComponent(params.id as string) : null;
  let look: Look | null = null;
  if (recommendations.length > 0 && lookName) {
    for (const rec of recommendations) {
      const targetLook = rec.looks.find(l => l.look_name === lookName);
      console.log("Finding Look Data", targetLook)
      console.log("rec : ", rec)
      if (targetLook) {
        look = targetLook;
        console.log("Find Look Data")
        break;
      }
    }
  }

  // 에러 또는 look을 찾지 못한 경우 처리
  if (error || !look) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">코디를 찾을 수 없습니다</h1>
          <p className="text-red-500 mb-4">{error || "요청한 코디 정보를 찾을 수 없거나, 이전 페이지에서 데이터가 전달되지 않았습니다."}</p>
          <Button onClick={() => router.back()}>이전 페이지로 돌아가기</Button>
        </div>
      </div>
    )
  }

  const allItems = Object.values(look.items).filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <Header activePage="styling" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{look.look_name}</h1>
          <p className="text-gray-600 mb-4">{look.look_description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <Image
                src={"https://image.msscdn.net/thumbnails/snap/images/2025/06/19/cfe45705dd1d4a7390ba14d7e0ca043e.jpg"}
                alt={look.look_name}
                width={500}
                height={600}
                className="w-full h-[600px] object-cover"
              />
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">구성 아이템</h3>
                <div className="space-y-6">
                  {allItems.map((item) => (
                    item && (
                        <div key={item.item_code} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex gap-4">
                            <div className="relative flex-shrink-0">
                            <Image
                                src={"https://image.msscdn.net/thumbnails/snap/images/2025/06/19/cfe45705dd1d4a7390ba14d7e0ca043e.jpg"}
                                alt={item.category}
                                width={80}
                                height={80}
                                className="w-20 h-20 object-cover rounded-lg bg-white"
                            />
                            </div>
                            <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg">{item.category}</h4>
                                <p className="text-sm text-gray-600">{item.color}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mb-3">
                                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                                구매하기
                                </Button>
                                <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleItemLike(item.item_code)}
                                className={likedItems.includes(item.item_code) ? "text-red-500 border-red-500" : ""}
                                >
                                <Heart className={`h-4 w-4 mr-1 ${likedItems.includes(item.item_code) ? "fill-current" : ""}`} />
                                찜하기
                                </Button>
                            </div>
                            </div>
                        </div>
                        </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg font-medium">
              전체 구매하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
