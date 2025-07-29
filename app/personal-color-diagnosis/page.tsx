"use client"


import { useEffect } from 'react'
import { useRouter } from "next/navigation"
import { Header } from "@/components/ui/Header"
import { Footer } from '@/components/ui/Footer'
import { Palette } from "lucide-react"
import { useStyleData } from '../context/StyleDataContext'

export default function PersonalColorDiagnosis() {
  const router = useRouter()
  const { clearRecommendations } = useStyleData()

  useEffect(() => {
    // 진단 프로세스의 첫 단계이므로, 이전 추천 데이터를 모두 초기화합니다.
    clearRecommendations()
  }, []) // 페이지가 처음 마운트될 때 한 번만 실행합니다.

  const handleAIDiagnosis = () => {
    router.push("/personal-color-image-upload")
  }

  const handleDirectSelection = () => {
    router.push("/personal-color-select")
  }

  return (
    <div className="min-h-screen bg-white">
      <Header activePage="personal-color" />

      <div className="px-4 py-6 md:px-40 md:py-10 flex justify-center">
        <div className="w-full max-w-5xl">
          <div className="px-4 md:px-0">
            <h1 className="text-[#171212] text-2xl md:text-4xl font-extrabold mb-4">퍼스널 컬러 진단</h1>
            <h2 className="text-[#171212] text-lg md:text-xl font-bold mb-6">진단 방법을 선택해주세요</h2>

            {/* AI 진단 카드 */}
            <div
              onClick={handleAIDiagnosis}
              className="border border-gray-300 rounded-lg bg-white p-6 mb-6 cursor-pointer transition-shadow duration-300 hover:shadow-lg hover:border-[#82696B]"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="md:flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-2">AI 분석으로 간편하게 진단</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    사진 한 장으로, 나만의 컬러를 찾아드립니다<br /><br /></p>
                  <ul className="list-disc list-inside ml-4 space-y-1 flex-grow">
                    <li>정확한 AI 분석</li>
                    <li>빠른 결과 확인</li>
                    <li>객관적인 진단</li>
                  </ul>

                  <div className="mt-auto pt-4">
                    <button
                      onClick={handleAIDiagnosis}
                      className="bg-[#E8B5B8] rounded-xl px-6 py-2 cursor-pointer transition-colors duration-200 hover:bg-[#E3DEDE] text-white font-semibold"
                      type="button"
                    >
                      사진으로 시작하기
                    </button>
                  </div>
                </div>
                <img
                  src="/images/ai diagnosis.png"
                  alt="AI 진단"
                  className="w-full max-w-xs md:max-w-[318px] rounded-xl object-cover"
                />
              </div>
            </div>

            {/* 직접 선택 카드 */}
            <div
              onClick={handleDirectSelection}
              className="border border-gray-300 rounded-lg bg-white p-6 mb-6 cursor-pointer transition-shadow duration-300 hover:shadow-lg hover:border-[#82696B]"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="md:flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-2">퍼스널 컬러 직접 선택</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    이미 알고 있는 퍼스널 컬러가 있다면 선택해보세요<br /><br /></p>
                  <ul className="list-disc list-inside ml-4 space-y-1 flex-grow">
                    <li>8가지 타입 중 선택</li>
                    <li>즉시 결과 확인</li>
                    <li>간편한 선택</li>
                  </ul>

                  <div className="mt-auto pt-4">
                    <button
                      onClick={handleDirectSelection}
                      className="bg-[#E8B5B8] rounded-xl px-6 py-2 cursor-pointer transition-colors duration-200 hover:bg-[#E3DEDE] text-white font-semibold"
                      type="button"
                    >
                      직접 선택하기
                    </button>
                  </div>
                </div>
                <img
                  src="/images/select.png"
                  alt="직접 선택"
                  className="w-full max-w-xs md:max-w-[318px] rounded-xl object-cover"
                />
              </div>
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
      </div>
      {/* Footer */}
      <Footer />
    </div>
  )
}
