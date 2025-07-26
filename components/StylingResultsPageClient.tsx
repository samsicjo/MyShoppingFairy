"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import RecommendationsLoading from '@/components/RecommendationsLoading';

const StylingResultsClientWrapper = dynamic(() => import('@/components/StylingResultsClientWrapper'), { 
  ssr: false,
  // 필요하다면 로딩 스켈레톤을 추가할 수 있습니다.
  // loading: () => <div>Loading User Info...</div>, 
});

const RecommendationsClient = dynamic(() => import('@/components/RecommendationsClient'), { 
  ssr: false,
  loading: () => <RecommendationsLoading />,
});

export default function StylingResultsPageClient() {
  return (
    <>
      <StylingResultsClientWrapper />
      <RecommendationsClient />
    </>
  );
}
