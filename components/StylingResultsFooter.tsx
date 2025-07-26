"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RefreshCw, Heart } from 'lucide-react';
import { useStyleData } from '@/app/context/StyleDataContext';

export default function StylingResultsFooter() {
  const router = useRouter();
  const { resetFetchAttempt } = useStyleData();

  return (
    <div className="flex justify-between mt-12">
      <Button variant="outline" onClick={() => {
        router.push('/styling-step1');
      }} className="flex items-center px-6 py-3 bg-transparent border-gray-200"><RefreshCw className="h-4 w-4 mr-2" />다시 진단하기</Button>
      <Button onClick={() => router.push('/my-page')} className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"><Heart className="h-4 w-4 mr-2" />저장된 코디 보기</Button>
    </div>
  );
}
