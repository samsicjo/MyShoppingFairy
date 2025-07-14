"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useStyling } from "@/app/context/StylingContext"
import { useStyleData, StyleRecommendation, Look } from "@/app/context/StyleDataContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/Header";
import { Badge } from "@/components/ui/badge"
import { Heart, RefreshCw, Share2, Loader2, Check, Palette, Sparkles, Camera } from "lucide-react"

export default function StylingResults() {
  const { stylingData } = useStyling();
  const { recommendations, isLoading, error, fetchRecommendationsByStyles } = useStyleData();
  const router = useRouter();

  const [likedLooks, setLikedLooks] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState("all");
  const [drapeTestImage, setDrapeTestImage] = useState<string | null>(null)
  const [backgroundColor, setBackgroundColor] = useState("#e0e0e0")

  useEffect(() => {
    const preferredStyles = stylingData.userPreferredStyle;
    if (preferredStyles && preferredStyles.length > 0) {
      fetchRecommendationsByStyles(preferredStyles);
    }
  }, [stylingData.userPreferredStyle, fetchRecommendationsByStyles]);

  useEffect(() => {
    const savedLooks = localStorage.getItem("savedLooks");
    if (savedLooks) {
      setLikedLooks(JSON.parse(savedLooks));
    }
    const savedImage = localStorage.getItem("drapeTestImage")
    if (savedImage) {
      setDrapeTestImage(savedImage)
    }
  }, []);

  const toggleLike = (lookName: string, styleName: string) => {
    const newLikedLooks = likedLooks.includes(lookName)
      ? likedLooks.filter((name) => name !== lookName)
      : [...likedLooks, lookName];

    setLikedLooks(newLikedLooks);
    localStorage.setItem("savedLooks", JSON.stringify(newLikedLooks));

    if (newLikedLooks.includes(lookName)) {
        alert(`${styleName} 스타일의 ${lookName}이(가) 저장되었습니다!`);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // 헤더 높이 등을 고려한 오프셋
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleColorSelect = (color: string) => {
    setBackgroundColor(color)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "나의 퍼스널컬러 & 스타일링 결과",
        text: `퍼스널컬러: ${stylingData.personalColor || ''}
스타일: ${stylingData.userPreferredStyle?.join(", ") || ''}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("링크가 복사되었습니다!")
    }
  }

  const handleSave = () => {
    const results = {
      personalColor: stylingData.personalColor,
      description: stylingData.description,
      recommendedColors: stylingData.recommendedColors,
      userPreferredStyle: stylingData.userPreferredStyle,
      drapeTestImage: drapeTestImage,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("savedStylingResultsSummary", JSON.stringify(results))
    alert("결과가 저장되었습니다!")
  }

  const recommendedColorsFromStylingData = stylingData.recommendedColors?.slice(0, 3) || ["#FFB6C1", "#98FB98", "#87CEEB"];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
        <p className="ml-4 text-lg">스타일링 결과를 분석 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">오류: {error}</p>
        <Button onClick={() => router.push("/styling-step1")} className="mt-4">다시 시도하기</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header activePage="styling" />

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
                                    backgroundColor: backgroundColor,
                                    transition: "background-color 0.5s ease-in-out",
                                }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-32 h-32 rounded-full overflow-hidden relative z-10">
                                        {drapeTestImage ? (
                                            <Image
                                                src={drapeTestImage || "/placeholder.svg"}
                                                alt="드레이프 테스트 이미지"
                                                width={128}
                                                height={128}
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
                                            onClick={() => handleColorSelect(color)}
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
            <Button variant={activeSection === "all" ? "default" : "outline"} size="sm" onClick={() => scrollToSection("all-styles")} className={`transition-all duration-200 ${activeSection === "all" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-white text-gray-600 hover:text-purple-600"}`}>VIEW ALL</Button>
            {recommendations.map(rec => (
                 <Button key={rec.style_name} variant={activeSection === rec.style_name ? "default" : "outline"} size="sm" onClick={() => scrollToSection(rec.style_name)} className={`transition-all duration-200 ${activeSection === rec.style_name ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-white text-gray-600 hover:text-purple-600"}`}>{rec.style_name}</Button>
            ))}
          </div>
        </div>

        {/* 맞춤 코디 추천 */}
        <div id="all-styles" className="space-y-8">
          {recommendations.map((rec: StyleRecommendation) => (
            <div key={rec.style_name} id={rec.style_name}>
              <Card className="border-gray-200 shadow-lg">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{rec.style_name} 스타일</h4>
                    <p className="text-gray-600">{`당신을 위한 ${rec.style_name} 스타일 코디 3가지를 추천해드려요`}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {rec.looks.map((look: Look, index: number) => (
                      <Card key={look.look_name} className="overflow-hidden hover:shadow-lg transition-shadow bg-white cursor-pointer border-gray-200" onClick={() => router.push(`/outfit-detail/${look.look_name}`)}>
                        <div className="relative">
                          <div className="absolute top-3 left-3 z-10"><div className="bg-white rounded-full px-2 py-1 text-xs font-bold text-gray-900">#{index + 1}</div></div>
                          <div className="absolute top-3 right-3 z-10">
                            <Button variant="ghost" size="icon" className={`hover:text-red-500 bg-white/80 hover:bg-white/90 rounded-full w-8 h-8 ${likedLooks.includes(look.look_name) ? "text-red-500" : "text-gray-400"}`} onClick={(e) => { e.stopPropagation(); toggleLike(look.look_name, rec.style_name); }}>
                              <Heart className={`h-4 w-4 ${likedLooks.includes(look.look_name) ? "fill-current" : ""}`} />
                            </Button>
                          </div>
                          <div className="relative h-48 bg-gray-200">
                            <Image src={"https://image.msscdn.net/thumbnails/snap/images/2025/06/19/cfe45705dd1d4a7390ba14d7e0ca043e.jpg"} alt={look.look_name} width={250} height={300} className="w-full h-full object-cover" />
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="mb-3"><h5 className="font-bold text-lg text-gray-900 mb-1">{look.look_name}</h5><p className="text-sm text-gray-600">{look.look_description}</p></div>
                          <div className="mb-4"><span className="text-sm font-medium text-gray-700 block mb-2">구성 아이템</span><div className="space-y-1">{Object.values(look.items).filter(item => item).map((item, itemIndex) => (<div key={itemIndex} className="flex justify-between items-center text-sm"><span className="text-gray-600">{item!.category}</span><span className="font-medium text-gray-800">{item!.color}</span></div>))}</div></div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className={`hover:text-red-500 hover:border-red-500 rounded-lg px-3 py-1.5 h-auto ${likedLooks.includes(look.look_name) ? "text-red-500 border-red-500" : "text-gray-600 border-gray-200"}`} onClick={(e) => { e.stopPropagation(); toggleLike(look.look_name, rec.style_name); }}><Heart className={`h-4 w-4 mr-1 ${likedLooks.includes(look.look_name) ? "fill-current" : ""}`} />{likedLooks.includes(look.look_name) ? "저장됨" : "저장하기"}</Button>
                            <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 hover:text-purple-600 hover:border-purple-600 rounded-lg px-2 py-1.5 h-auto bg-transparent" onClick={(e) => e.stopPropagation()}><Share2 className="h-4 w-4" /></Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-12">
          <Button variant="outline" onClick={() => router.push("/styling-step1")} className="flex items-center px-6 py-3 bg-transparent border-gray-200"><RefreshCw className="h-4 w-4 mr-2" />다시 진단하기</Button>
          <Button onClick={() => router.push("/my-page")} className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"><Heart className="h-4 w-4 mr-2" />저장된 코디 보기</Button>
        </div>
      </div>
    </div>
  )
}
