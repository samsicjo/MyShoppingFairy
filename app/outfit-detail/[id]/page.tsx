'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useStyleData, Look, Item } from '@/app/context/StyleDataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/ui/Header';
import { Heart, Share2, Loader2 } from 'lucide-react';

export default function OutfitDetail() {
  const params = useParams();
  const router = useRouter();
  const { recommendations, isInitializing, error } = useStyleData();

  const [likedItems, setLikedItems] = useState<number[]>([]);

  useEffect(() => {
    const savedLikedItems = localStorage.getItem('likedItems');
    if (savedLikedItems) {
      setLikedItems(JSON.parse(savedLikedItems));
    }
  }, []);

  const toggleItemLike = (productId: number) => {
    const newLikedItems = likedItems.includes(productId)
      ? likedItems.filter((id) => id !== productId)
      : [...likedItems, productId];
    setLikedItems(newLikedItems);
    localStorage.setItem('likedItems', JSON.stringify(newLikedItems));
  };

  if (isInitializing) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
        <p className="ml-4 text-lg">코디 정보를 불러오는 중...</p>
      </div>
    );
  }

  const lookName = params.id ? decodeURIComponent(params.id as string) : null;
  const look = recommendations.find((l) => l.look_name === lookName) || null;

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
                src={mainImageUrl}
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
                  {allItems.map(([category, item]) => (
                    <div key={item.product_id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex gap-4">
                        <div className="relative flex-shrink-0">
                          <Image
                            src={item.image_url}
                            alt={item.product_name}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-lg bg-white"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-lg">{category}</h4>
                              <p className="text-sm text-gray-600 truncate">{item.product_name}</p>
                              <p className="text-md font-semibold text-gray-800 mt-1">₩{item.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mb-3">
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => window.open(`https://store.musinsa.com/app/goods/${item.product_id}`, '_blank')}>
                              구매하기
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleItemLike(item.product_id)}
                              className={likedItems.includes(item.product_id) ? 'text-red-500 border-red-500' : ''}
                            >
                              <Heart className={`h-4 w-4 mr-1 ${likedItems.includes(item.product_id) ? 'fill-current' : ''}`} />
                              찜하기
                            </Button>
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
