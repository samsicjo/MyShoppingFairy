"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStyling } from '@/app/context/StylingContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Palette, Sparkles, Camera } from 'lucide-react'
import Image from 'next/image'
import { getFlexibleColorPalette } from '@/components/data/personalColorData'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface StylingResultsClientWrapperProps {
  // 필요한 경우 서버 컴포넌트로부터 props를 받을 수 있습니다.
}

export default function StylingResultsClientWrapper(props: StylingResultsClientWrapperProps) {
  const { stylingData } = useStyling()
  const router = useRouter()

  const [isMounted, setIsMounted] = useState(false)
  const [drapeTestImage, setDrapeTestImage] = useState<string | null>(null)
  const [backgroundColor, setBackgroundColor] = useState('#e0e0e0')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', message: '' })

  const openModal = (title: string, message: string) => {
    setModalContent({ title, message })
    setIsModalOpen(true)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('이미지 업로드 시작')
    const file = event.target.files?.[0]
    if (file) {
      console.log('파일 선택됨:', file.name, file.type)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        console.log('이미지 로드 완료')
        setDrapeTestImage(result)
        // 로컬 스토리지에도 저장
        localStorage.setItem('drapeTestImage', result)
      }
      reader.onerror = (e) => {
        console.error('이미지 로드 실패:', e)
      }
      reader.readAsDataURL(file)
    } else {
      console.log('파일이 선택되지 않음')
    }
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const savedImage = localStorage.getItem('drapeTestImage')
    if (savedImage) {
      setDrapeTestImage(savedImage)
    }
  }, [])

  const handleColorSelect = (color: string) => {
    setBackgroundColor(color)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '나의 퍼스널컬러 & 스타일링 결과',
        text: `퍼스널컬러: ${stylingData.personalColor || ''}\n스타일: ${stylingData.preferred_styles?.join(', ') || ''}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      openModal('알림', '링크가 복사되었습니다!')
    }
  }

  const handleSave = () => {
    const results = {
      personalColor: stylingData.personalColor,
      description: stylingData.description,
      recommendedColors: stylingData.recommendedColors,
      preferred_styles: stylingData.preferred_styles,
      drapeTestImage: drapeTestImage,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('savedStylingResultsSummary', JSON.stringify(results))
    openModal('성공', '결과가 저장되었습니다!')
  }

  const recommendedColorsFromStylingData = stylingData.recommendedColors ? stylingData.recommendedColors.slice(0, 3) : []

  return (
    <>
      <div className="mb-8">
        {/* 상단 3개 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 퍼스널컬러 카드 */}
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                  <Palette className="h-5 w-5 text-[#171212]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">퍼스널컬러</h3>
              </div>

              {stylingData.personalColor ? (
                <div className="space-y-4">
                  <div>
                    <Badge className="bg-[#FFF9EE] text-[#171212] shadow-lg mb-2 pointer-events-none">
                      {stylingData.personalColor}
                    </Badge>
                    <p className="text-sm text-gray-600">{stylingData.description}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">추천 색상 팔레트</p>
                    <div className="flex flex-wrap gap-3">
                      {(() => {
                        if (!stylingData.personalColor) {
                          return <span className="text-gray-500">퍼스널컬러 정보가 없습니다</span>
                        }

                        const colorPalette = getFlexibleColorPalette(stylingData.personalColor)
                        const selectedColors = colorPalette.slice(0, 3) // 3가지 색상만 선택

                        if (selectedColors.length === 0) {
                          return <span className="text-gray-500">추천 색상이 없습니다</span>
                        }

                        return selectedColors.map((colorSwatch, index) => (
                          <div key={index} className="text-center w-16 flex flex-col items-center">
                            <div
                              className="w-8 h-8 rounded-full border-2 border-white shadow-md mb-1"
                              style={{ backgroundColor: colorSwatch.color }}
                              title={colorSwatch.title}
                            />
                            <span className="text-xs text-gray-600 text-center leading-tight">
                              {colorSwatch.title}
                            </span>
                          </div>
                        ))
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">퍼스널컬러 진단을 완료해주세요</p>
                  <Button
                    onClick={() => router.push('/personal-color-diagnosis')}
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
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                  <Sparkles className="h-5 w-5 text-[#171212]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">선호 스타일</h3>
              </div>

              {stylingData.preferred_styles && stylingData.preferred_styles.length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">선택한 스타일</p>
                    <div className="flex flex-wrap gap-2">
                      {stylingData.preferred_styles.map((style, styleIndex) => (
                        <Badge
                          key={styleIndex}
                          variant="outline"
                          className="bg-[#FFF9EE] text-[#171212] shadow-lg mb-2 pointer-events-none"
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
                    onClick={() => router.push('/styling-step1')}
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
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                  <Palette className="h-5 w-5 text-[#171212]" />
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
              </div>
            </CardContent>
          </Card>
        </div>
        {/* 하단 드레이프 테스트 카드 (전체 폭) */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                <Camera className="h-5 w-5 text-[#171212]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">미니 드레이프 테스트</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 이미지 영역 */}
              {/* <div className="flex justify-center"> */}
              <div
                className="relative rounded-2xl shadow-xl overflow-hidden mx-auto"
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  height: '250px',
                  backgroundColor: backgroundColor,
                  transition: 'background-color 0.5s ease-in-out',
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden relative z-10">
                    {drapeTestImage ? (
                      <Image
                        src={drapeTestImage || '/placeholder.svg'}
                        alt="드레이프 테스트 이미지"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
                        <label className="cursor-pointer w-full h-full flex items-center justify-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <Camera className="h-12 w-12 text-gray-400 hover:text-gray-600 transition-colors" />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 색상 선택 영역 */}
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-6">배경색 선택</h4>

                <div className="grid grid-cols-4 gap-4 max-w-xs mx-auto">
                  {(() => {
                    if (!stylingData.personalColor) {
                      // 기본 색상들
                      return [
                        '#C8A2C8', '#87CEEB', '#DDA0DD', '#F0E68C',
                        '#BC8F8F', '#B0C4DE', '#D8BFD8', '#FFEAA7',
                        '#9370DB', '#6495ED', '#DDA0DD', '#F7DC6F'
                      ].map((color, index) => (
                        <button
                          key={index}
                          className="w-12 h-12 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform duration-200"
                          style={{ backgroundColor: color }}
                          onClick={() => handleColorSelect(color)}
                          title={`색상 ${index + 1}`}
                        />
                      ))
                    }

                    const colorPalette = getFlexibleColorPalette(stylingData.personalColor)
                    const selectedColors = colorPalette.slice(0, 12) // 12가지 색상 선택

                    return selectedColors.map((colorSwatch, index) => (
                      <button
                        key={index}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform duration-200"
                        style={{ backgroundColor: colorSwatch.color }}
                        onClick={() => handleColorSelect(colorSwatch.color)}
                        title={colorSwatch.title}
                      />
                    ))
                  })()}
                </div>

                {/* 전체 드레이프 테스트 버튼 */}
                <div className="mt-8">
                  <Button
                    onClick={() => router.push('/personal-color-drape-test')}
                    className="bg-[#E8B5B8] hover:bg-[#CE8CA5] text-white rounded-full px-8 py-3 font-medium transition-colors duration-200"
                  >
                    전체 드레이프 테스트 하러가기
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{modalContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {modalContent.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsModalOpen(false)}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}