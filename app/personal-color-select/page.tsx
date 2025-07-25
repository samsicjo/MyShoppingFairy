"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useModal } from "@/app/context/ModalContext";
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/ui/Header";
import { Palette } from "lucide-react"
import { personalColorTypes } from "@/lib/personalColorData"
import { useStyling } from "@/app/context/StylingContext"
import { useAuth } from '@/app/context/AuthContext'

export default function PersonalColorSelect() {
  const { setStylingData } = useStyling()
  const { userId } = useAuth(); // userId 가져오기
  const { openModal } = useModal();
  const [selectedColor, setSelectedColor] = useState<string>("")
  const router = useRouter()

  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId)
  }

  const handleNext = async () => {
    if (selectedColor) {
      const selectedColorData = personalColorTypes.find((color) => color.id === selectedColor)
      if (selectedColorData) {
        // API 호출
        if (userId) {
          const encodedColorName = encodeURIComponent(selectedColorData.nameForDB);
          try {
            const response = await fetch(`http://127.0.0.1:8000/users/user_personal_color_update?user_id=${userId}&personal_color_name=${encodedColorName}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              const errorData = await response.json();
              console.error("Failed to update personal color:", errorData);
              openModal("오류", "퍼스널 컬러 업데이트에 실패했습니다.");
              return;
            }
            console.log("Personal color updated successfully!");
          } catch (error) {
            console.error("Error updating personal color:", error);
            openModal("오류", "퍼스널 컬러 업데이트 중 오류가 발생했습니다.");
            return;
          }
        } else {
          openModal("로그인 필요", "로그인이 필요합니다.");
          router.push("/login");
          return;
        }

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
        <div className="text-left mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[#171212]">
            나에게 어울리는 퍼스널 컬러를 선택해주세요
          </h1>
          <p className="text-lg text-[#82696B]">
            8가지 퍼스널 컬러 중 본인에게 가장 어울리는 컬러를 선택하시면, 맞춤형 스타일링을 제공해드립니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {personalColorTypes.map((colorType) => (
            <Card
              key={colorType.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white/80 backdrop-blur-sm ${
                selectedColor === colorType.id
                  ? "ring-2 ring-[#E3DEDE] shadow-xl scale-105 bg-[#F5F2F2]"
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
                      <div className="w-1.5 h-1.5 bg-[#E3DEDE] rounded-full mr-2"></div>
                      {char}
                    </div>
                  ))}
                </div>

                {selectedColor === colorType.id && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center px-3 py-1 bg-[#E8B5B8] text-white text-xs font-medium rounded-full">
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
            className="bg-[#E8B5B8] hover:bg-[#d8a5a8] text-white px-12 py-4 text-lg font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
          >
            다음 단계로 →
          </Button>
        </div>

        {/* 정보 박스 */}
        <div className="p-4 mt-6 bg-white border border-gray-300 rounded-lg flex items-start gap-3">
              <Palette className="h-5 w-5 text-gray-600 mt-1" />
              <div>
                <h4 className="font-bold text-base mb-1">퍼스널 컬러란?</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  개인의 피부톤, 눈동자, 머리카락 색상과 조화를 이루어 가장 아름답게 보이게 하는 색상 그룹입니다.
                  올바른 퍼스널컬러를 찾으면 더욱 생기 있고 매력적인 모습을 연출할 수 있어요
                </p>
              </div>
            </div>
      </div>
    </div>
  )
}
