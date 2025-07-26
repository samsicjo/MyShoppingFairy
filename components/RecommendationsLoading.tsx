import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecommendationsLoading() {
  return (
    <div className="space-y-8 mt-8">
      <Card className="border-gray-200 shadow-lg">
        <CardContent className="p-8">
          <div className="mb-6">
            <h4 className="text-2xl font-bold text-gray-900 mb-2">맞춤 코디 추천</h4>
            <p className="text-gray-600">스타일 코디를 불러오는 중입니다...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => ( // Show 3 skeleton cards
              <Card key={index} className="overflow-hidden bg-white border-gray-200">
                <div className="relative">
                  <Skeleton className="w-full h-48" />
                </div>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="space-y-1 mb-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
