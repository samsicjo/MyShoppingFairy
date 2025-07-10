"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStyling } from "@/app/context/StylingContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/ui/Header";
import { personalColorTypes } from "@/lib/personalColorData"

export default function PersonalColorSelect() {
  const { setStylingData } = useStyling()
  const [selectedColor, setSelectedColor] = useState<string>("")
  const router = useRouter()

  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId)
  }

  const handleNext = () => {
    if (selectedColor) {
      const selectedColorData = personalColorTypes.find((color) => color.id === selectedColor)
      if (selectedColorData) {
        setStylingData(prevData => ({
          ...prevData,
          personalColor: selectedColorData.name,
          description: selectedColorData.description,
          recommendedColors: selectedColorData.colors,
          colorNames: selectedColorData.colorsName,
        }));
      }
      router.push("/personal-color-drape-test")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="personal-color" />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            나에게 어울리는{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              퍼스널 컬러
            </span>
            를 선택해주세요
          </h1>
          <p className="text-lg text-gray-600">
            8가지 퍼스널 컬러 중 본인에게 가장 어울리는 컬러를 선택하시면, 맞춤형 스타일링을 제공해드립니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {personalColorTypes.map((colorType) => (
            <Card
              key={colorType.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white/80 backdrop-blur-sm ${
                selectedColor === colorType.id
                  ? "ring-2 ring-purple-500 shadow-xl scale-105 bg-gradient-to-br from-purple-50 to-pink-50"
                  : "hover:shadow-lg border-purple-100"
              }`}
              onClick={() => handleColorSelect(colorType.id)}
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Badge
                    variant="secondary"
                    className={`mb-3 px-3 py-1 ${
                      colorType.season === "봄"
                        ? "bg-green-100 text-green-800"
                        : colorType.season === "여름"
                          ? "bg-blue-100 text-blue-800"
                          : colorType.season === "가을"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {colorType.season}
                  </Badge>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{colorType.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{colorType.description}</p>
                </div>

                <div className="flex justify-center gap-2 mb-6">
                  {colorType.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  {colorType.characteristics.map((char, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                      {char}
                    </div>
                  ))}
                </div>

                {selectedColor === colorType.id && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium rounded-full">
                      ✓ 선택됨
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleNext}
            disabled={!selectedColor}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
          >
            다음 단계로 →
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <Card className="bg-white/60 backdrop-blur-sm border-purple-100 shadow-lg max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💡 퍼스널 컬러란?</h3>
              <p className="text-gray-600 leading-relaxed">
                퍼스널 컬러는 개인의 피부톤, 눈동자, 머리카락 색상과 조화를 이루는 색상을 말합니다. 본인에게 맞는 퍼스널
                컬러를 알면 더욱 생기있고 세련된 스타일링이 가능합니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
