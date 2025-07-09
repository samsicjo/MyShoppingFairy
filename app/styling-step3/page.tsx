"use client"

import { useState, useEffect } from "react"
import { useStyling, PreferredStyle } from '../context/StylingContext'
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Header } from "@/components/ui/Header";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react"

const styleOptions = [
  {id: PreferredStyle.Casual, name: "캐주얼", emoji: "👕",description: "편안하고 자유로운 일상 스타일"},
  {id: PreferredStyle.Street, name: "스트릿",    emoji: "🛹",    description: "개성 있고 트렌디한 거리 패션 스타일",  },
  {id: PreferredStyle.Gorpcore, name: "고프코어",    emoji: "🏔️",    description: "기능성과 실용성을 중시하는 아웃도어 스타일",  },
  {id: PreferredStyle.Workwear, name: "워크웨어",    emoji: "👔",    description: "직장에서 영감을 받은 실용적인 스타일",  },
  {id: PreferredStyle.Preppy, name: "프레피",    emoji: "🎓",    description: "품위있고 단정한 아이비리그 스타일",  },
  {id: PreferredStyle.CityBoy, name: "시티보이",    emoji: "🏙️",    description: "도시적이고 세련된 남성적 스타일",  },
  {id: PreferredStyle.Sporty, name: "스포티",    emoji: "⚽",    description: "활동적이고 운동복 느낌의 편안한 스타일",  },
  {id: PreferredStyle.Romantic, name: "로맨틱",    emoji: "🌸",    description: "부드럽고 여성스러운 우아한 스타일",  },
  {id: PreferredStyle.Girlish, name: "걸리시",    emoji: "💪",    description: "중성적이고 보이시한 매력적 스타일",  },
  {id: PreferredStyle.Classic, name: "클래식",    emoji: "👗",    description: "시대를 초월한 정통적이고 격식 있는 스타일",  },
  {id: PreferredStyle.Minimal, name: "미니멀",    emoji: "⚪",    description: "단순하고 깔끔한 절제미 있는 스타일",  },
  {id: PreferredStyle.Chic, name: "시크",    emoji: "🖤",    description: "세련되고 도시적인 모던한 스타일",  },
  {id: PreferredStyle.Retro, name: "레트로",    emoji: "📻",    description: "과거 시대의 향수를 담은 빈티지 스타일",  },
  {id: PreferredStyle.Ethnic, name: "에스닉",emoji: "🌍",description: "전통적이고 민족적인 문화 요소가 담긴 스타일",},
  {id: PreferredStyle.Resort, name: "리조트", emoji: "🏖️", description: "휴양지에서 편안하고 여유로운 스타일",},
]

export default function StylingStep3() {

  const { stylingData, setStylingData } = useStyling()
  const [preferredStyles, setPreferredStyles] = useState<PreferredStyle[]>([]);
  const router = useRouter()

  useEffect(() => {
    // 방어 로직: step2에서 저장했어야 할 데이터(예: userTopSize)가 없으면
    // 이전 페이지로 돌려보냅니다.
    if (!stylingData.userTopSize) {
      alert('이전 단계의 정보가 없습니다. 2단계부터 다시 진행해주세요.');
      router.push('/styling-step2');
      return; // useEffect 실행을 중단합니다.
    }

    // 콘솔에 최종적으로 누적된 모든 데이터를 객체 형태로 출력합니다.
    console.log('✅ styling-step3 페이지에서 최종 확인한 데이터:' , stylingData);

  }, [stylingData, router]);

  // 선호 스타일 체크박스 선택을 처리하는 핸들러 함수입니다.
  const handleStyleToggle = (style: PreferredStyle) => {
    setPreferredStyles(prev => prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]// 이미 있으면 제거 ? 없으면 추가
  )}

  // '결과 보기' 버튼을 눌렀을 때 Context에 최종 데이터를 저장하고 결과 페이지로 이동합니다.
  const handleComplete = () => {
    setStylingData(prevData => ({
      ...prevData, // step1, step2에서 저장한 모든 데이터를 보존
      userPreferredStyle: preferredStyles,
    }))
    router.push("/styling-summary");
  }
  const handlePrevious = () => {
    router.push("/styling-step2");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="styling" />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
            {/* Step 1 - Completed */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">
                1
              </div>
              <span className="ml-3 text-gray-600">기본 정보</span>
            </div>

            {/* Step 2 - Completed */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">
                2
              </div>
              <span className="ml-3 text-gray-600">예산 & 사이즈</span>
            </div>

            {/* Step 3 - Active */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <span className="ml-3 text-purple-600 font-medium">스타일 선호도</span>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-600 text-sm font-medium mb-4">
            <span className="mr-2">✨</span>
            3/3 선택완료
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            선호하는{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">스타일</span>을
            선택해주세요
          </h1>
          <p className="text-lg text-gray-600">마음에 드는 스타일을 모두 선택해주세요 (복수 선택 가능)</p>
        </div>

        

        {/* Style Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {styleOptions.map((style) => {
            const isSelected = preferredStyles.includes(style.id)
            return (
              <Card
                key={style.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isSelected
                    ? "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 shadow-lg"
                    : "bg-white/80 backdrop-blur-sm border-purple-100 hover:border-purple-200"
                }`}
                onClick={() => handleStyleToggle(style.id)}
              >
                <CardContent className="p-6 text-center relative">
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}

                  <div className="text-4xl mb-3">{style.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{style.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{style.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
        {/* Selected Styles */}
        {preferredStyles.length > 0 && (
          <div className="mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">선택된 스타일</h3>
                <div className="flex flex-wrap gap-2">
                  {preferredStyles.map((styleId) => {
                    const style = styleOptions.find((s) => s.id === styleId)
                    return (
                      <Badge
                        key={styleId}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 text-sm"
                      >
                        {style?.emoji} {style?.name}
                      </Badge>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} className="flex items-center px-6 py-3 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            이전 단계
          </Button>
          <Button
            onClick={handleComplete}
            disabled={preferredStyles.length === 0}
            className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            입력 완료
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
