"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStyling } from '@/app/context/StylingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Palette, Sparkles, Camera } from 'lucide-react';
import Image from 'next/image';
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
  const { stylingData } = useStyling();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [drapeTestImage, setDrapeTestImage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#e0e0e0');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  const openModal = (title: string, message: string) => {
    setModalContent({ title, message });
    setIsModalOpen(true);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const savedImage = localStorage.getItem('drapeTestImage');
    if (savedImage) {
      setDrapeTestImage(savedImage);
    }
  }, []);

  const handleColorSelect = (color: string) => {
    setBackgroundColor(color);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '나의 퍼스널컬러 & 스타일링 결과',
        text: `퍼스널컬러: ${stylingData.personalColor || ''}\n스타일: ${stylingData.preferred_styles?.join(', ') || ''}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      openModal('알림', '링크가 복사되었습니다!');
    }
  };

  const handleSave = () => {
    const results = {
      personalColor: stylingData.personalColor,
      description: stylingData.description,
      recommendedColors: stylingData.recommendedColors,
      preferred_styles: stylingData.preferred_styles,
      drapeTestImage: drapeTestImage,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('savedStylingResultsSummary', JSON.stringify(results));
    openModal('성공', '결과가 저장되었습니다!');
  };

  const recommendedColorsFromStylingData = stylingData.recommendedColors ? stylingData.recommendedColors.slice(0, 3) : [];

  return (
    <>
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
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <Sparkles className="h-5 w-5 text-white" />
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
                    저장
                  </Button>
                  <Button
                    onClick={handleShare}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-pink-200 text-pink-700 bg-transparent"
                  >
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
              {/* <div className="flex justify-center"> */}
                <div
                  className="relative rounded-2xl shadow-xl overflow-hidden"
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

                {/* 색상 선택 영역 */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">배경색 변경</h4>
                  <div className="grid grid-cols-6 gap-3">
                    {(stylingData.recommendedColors || [])
                      .concat([
                        '#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
                        '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
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
                      onClick={() => router.push('/personal-color-drape-test')}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                    >
                      전체 드레이프 테스트 하기
                    </Button>
                  </div>
                </div>
              {/* </div> */}
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
  );
}