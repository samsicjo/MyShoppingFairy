'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { OutfitImageCarousel } from '@/components/OutfitImageCarousel';
import { useStyleData, Look, Item } from '@/app/context/StyleDataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/ui/Header';
import { Share2, Loader2 } from 'lucide-react';
import { FavoriteButton } from '@/components/FavoriteButton';
import Image from 'next/image';

export default function OutfitDetail() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams(); // Add this line
  const { recommendations } = useStyleData();
  const [look, setLook] = useState<Look | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id ? decodeURIComponent(params.id as string) : null;
    if (!id) {
      setError('유효하지 않은 ID입니다.');
      setIsLoading(false);
      return;
    }

    // ID가 숫자로 변환 가능한지 확인
    const isNumericId = !isNaN(Number(id));

    if (isNumericId) {
      // my-page에서 온 경우: API로 데이터 요청
      const fetchLookDetail = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/users/looks/${id}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '코디 정보를 불러오는 데 실패했습니다.');
          }
          const data = await response.json();
          setLook(data);
        } catch (e: any) {
          setError(e.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchLookDetail();
    } else {
      // styling-results에서 온 경우: 컨텍스트에서 데이터 검색
      const existingLook = recommendations.find(r => r.look_name === id);
      if (existingLook) {
        setLook(existingLook);
      } else {
        setError('해당 코디 정보를 찾을 수 없습니다.');
      }
      setIsLoading(false);
    }
  }, [params.id, recommendations]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
        <p className="ml-4 text-lg">코디 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !look) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">코디를 찾을 수 없습니다</h1>
          <p className="text-red-500 mb-4">{error || '요청한 코디 정보를 찾을 수 없거나, 이전 페이지에서 데이터가 전달되지 않았습니다.'}</p>
          <Button onClick={() => router.back()}>이전 페이지로 돌아가기</Button>
        </div>
      </div>
    );
  }

  const allItems: [string, Item][] = Object.entries(look.items).filter((entry): entry is [string, Item] => entry[1] !== null);
  const mainImageUrl = allItems.length > 0 ? allItems[0][1].image_url : '/placeholder.svg';

  const activeHeaderPage = searchParams.get('from') === 'my-page' ? 'my-page' : 'styling';

  return (
    <div className="min-h-screen bg-white">
      <Header activePage={activeHeaderPage as 'my-page' | 'styling'} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{look.look_name}</h1>
          <p className="text-gray-600 mb-4">{look.look_description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <OutfitImageCarousel items={look.items} altText={look.look_name} className="w-full" />
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">구성 아이템</h3>
                <div className="space-y-6">
                  {allItems.map(([category, item]) => (
                    <div key={category} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex gap-4">
                        <div className="relative flex-shrink-0">
                          <Image
                            src={item.image_url && item.image_url.length > 0 ? item.image_url : "/placeholder.svg"}
                            alt={item.product_name || '상품 이미지'}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-lg bg-white"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-lg">{item.product_name}</h4>
                              <p className="text-sm text-gray-600 truncate">{}</p>
                              {/* category */}
                              <p className="text-md font-semibold text-gray-800 mt-1">₩{item.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mb-3">
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => window.open(`https://store.musinsa.com/app/goods/${item.product_id}`, '_blank')}>
                              구매하기
                            </Button>
                            <FavoriteButton item={item} />
                          </div>
                        </div>
                      </div>
                    </div>
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
  );
}
