"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OutfitImageCarousel } from '@/components/OutfitImageCarousel';
import { useStyling } from '@/app/context/StylingContext';
import { useStyleData, Look } from '@/app/context/StyleDataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/ui/Header';
import { Badge } from '@/components/ui/badge';
import { Heart, RefreshCw, Share2, Loader2, Check, Palette, Sparkles, Camera } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const categoryNames = ["아우터", "상의", "하의", "신발"];

export default function StylingResults() {
  const { stylingData } = useStyling();
  const { recommendations, isLoading, error, fetchRecommendations, resetFetchAttempt } = useStyleData();
  const { userId } = useAuth();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [likedLooks, setLikedLooks] = useState<Array<{ look_name: string; look_id: number; }>>([]);
  const [savingLooks, setSavingLooks] = useState<string[]>([]);
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
    const timer = setTimeout(() => {
      fetchRecommendations();
      console.log('recommendtaions : ', recommendations)
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const savedLooks = localStorage.getItem('savedLooks');
      if (savedLooks) {
        try {
          const parsedLooks = JSON.parse(savedLooks);
          if (Array.isArray(parsedLooks) && parsedLooks.every(item => typeof item === 'object' && item !== null && 'look_name' in item && 'look_id' in item)) {
            setLikedLooks(parsedLooks);
          } else {
            console.warn("Saved looks data format is invalid or old, clearing.");
            setLikedLooks([]);
          }
        } catch (e) {
          console.error("Failed to parse saved looks from localStorage", e);
          setLikedLooks([]);
        }
      }
      const savedImage = localStorage.getItem('drapeTestImage');
      if (savedImage) {
        setDrapeTestImage(savedImage);
      }
    }
  }, [isMounted]);

  const toggleLike = async (look: Look) => {
    const lookName = look.look_name;
    const isLiked = likedLooks.some(item => item.look_name === lookName);

    if (savingLooks.includes(lookName)) {
      return;
    }

    if (isLiked) {
      const itemToRemove = likedLooks.find(item => item.look_name === lookName);
      if (itemToRemove) {
        const newLikedLooks = likedLooks.filter((item) => item.look_name !== lookName);
        setLikedLooks(newLikedLooks);
        localStorage.setItem('savedLooks', JSON.stringify(newLikedLooks));
        openModal('알림', `${lookName}이(가) 찜 목록에서 제거되었습니다.`);
        deleteLookFromDb(itemToRemove.look_id);
      }
    } else {
      setSavingLooks(prev => [...prev, lookName]);
      try {
        const savedLookId = await saveLookToDb(look);
        const newLikedLooks = [...likedLooks, { look_name: lookName, look_id: savedLookId }];
        setLikedLooks(newLikedLooks);
        localStorage.setItem('savedLooks', JSON.stringify(newLikedLooks));
        openModal('성공', "룩이 성공적으로 저장되었습니다!");
      } catch (error) {
        console.error("룩 저장 오류:", error);
        openModal('오류', `룩 저장 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setSavingLooks(prev => prev.filter(name => name !== lookName));
      }
    }
  };

  const saveLookToDb = async (look: Look): Promise<number> => {
    if (!userId) {
      openModal("오류", "로그인이 필요합니다.");
      throw new Error("User not logged in");
    }

    console.log("API 요청!!!!!!!!!!!!!!!!!!!!!")
    const response = await fetch(`http://127.0.0.1:8000/users/looks/create?user_id=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(look),
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = '룩 저장에 실패했습니다.';
      if (errorData && errorData.detail) {
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map((err: any) => err.msg).join(', ');
        } else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else {
          errorMessage = JSON.stringify(errorData.detail);
        }
      }
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    console.log('responseData : ', responseData)
    console.log('responseData.id : ', responseData.id)
    console.log(typeof(responseData.id))
    const savedLookId = responseData.id
    
    if (typeof savedLookId === 'number') {
      return savedLookId;
    } else {
      throw new Error("저장된 룩의 ID를 받지 못했습니다.");
    }
  };

  const deleteLookFromDb = async (lookId: number) => {
    if (!userId) {
      openModal("오류", "로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/users/looks/${lookId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = '룩 삭제에 실패했습니다.';
        if (errorData && errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((err: any) => err.msg).join(', ');
          } else if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          } else {
            errorMessage = JSON.stringify(errorData.detail);
          }
        }
        throw new Error(errorMessage);
      }

      console.log(`Look ${lookId} deleted successfully from DB.`);
    } catch (error) {
      console.error("룩 삭제 오류:", error);
      openModal('오류', `룩 삭제 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

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

  if (isLoading || !isMounted) {
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
        <Button onClick={() => router.push('/styling-step1')} className="mt-4">다시 시도하기</Button>
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
            </span>{' '}
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 맞춤 코디 추천 */}
        <div id="all-styles" className="space-y-8 mt-8">
          <Card className="border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <div className="mb-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">맞춤 코디 추천</h4>
                <p className="text-gray-600">당신을 위한 스타일 코디 {recommendations.length}가지를 추천해드려요</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((look: Look, index: number) => (
                  <Card key={look.look_name} className="overflow-hidden hover:shadow-lg transition-shadow bg-white cursor-pointer border-gray-200" onClick={() => router.push(`/outfit-detail/${encodeURIComponent(look.look_name)}?from=styling-results`)}>
                    <div className="relative">
                      <div className="absolute top-3 left-3 z-10"><div className="bg-white rounded-full px-2 py-1 text-xs font-bold text-gray-900">#{index + 1}</div></div>
                      <div className="absolute top-3 right-3 z-10">
                        <Button variant="ghost" size="icon" className={`hover:text-red-500 bg-white/80 hover:bg-white/90 rounded-full w-8 h-8 ${likedLooks.some(item => item.look_name === look.look_name) ? 'text-red-500' : 'text-gray-400'}`} onClick={(e) => { e.stopPropagation(); toggleLike(look); }}>
                          <Heart className={`h-4 w-4 ${likedLooks.some(item => item.look_name === look.look_name) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                      <div className="relative h-48 bg-gray-200">
                        <OutfitImageCarousel items={look.items} altText={look.look_name} className="w-full h-full" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-3"><h5 className="font-bold text-lg text-gray-900 mb-1">{look.look_name}</h5><p className="text-sm text-gray-600">{look.look_description}</p></div>
                      <div className="mb-4"><span className="text-sm font-medium text-gray-700 block mb-2">구성 아이템</span><div className="space-y-1">
                        {
                          Object.entries(look.items).map(([category, item]) => 
                          (item && <div key={category} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 whitespace-nowrap mr-4">{category}</span>
                          <span className="font-medium text-gray-800 truncate">{item.product_name}</span>
                          </div>))
                          
                        }
                        </div></div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className={
                            `hover:text-red-500 hover:border-red-500 rounded-lg px-3 py-1.5 h-auto
                            ${likedLooks.some(item => item.look_name === look.look_name) ? 
                            'text-red-500 border-red-500' : 'text-gray-600 border-gray-200'}`}
                            onClick={(e) => { e.stopPropagation(); toggleLike(look); }}
                            disabled={savingLooks.includes(look.look_name)}>
                            {savingLooks.includes(look.look_name) ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Heart className={`h-4 w-4 mr-1 ${likedLooks.some(item => item.look_name === look.look_name) ? 'fill-current' : ''}`} />}
                            {likedLooks.some(item => item.look_name === look.look_name) ? '저장됨' : (savingLooks.includes(look.look_name) ? '저장중...' : '저장하기')}
                        </Button>
                        <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 hover:text-purple-600 hover:border-purple-600 rounded-lg px-2 py-1.5 h-auto bg-transparent" onClick={(e) => e.stopPropagation()}><Share2 className="h-4 w-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between mt-12">
          <Button variant="outline" onClick={() => {
            resetFetchAttempt(); // Reset the fetch flag
            router.push('/styling-step1');
          }} className="flex items-center px-6 py-3 bg-transparent border-gray-200"><RefreshCw className="h-4 w-4 mr-2" />다시 진단하기</Button>
          <Button onClick={() => router.push('/my-page')} className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"><Heart className="h-4 w-4 mr-2" />저장된 코디 보기</Button>
        </div>
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

    </div>
  );
}