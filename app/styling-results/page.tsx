import React from 'react'
import { Header } from '@/components/ui/Header'
import { Check } from 'lucide-react'
import StylingResultsFooter from '@/components/StylingResultsFooter'
import StylingResultsPageClient from '@/components/StylingResultsPageClient'

export default async function StylingResults() {

  return (
    <div className="min-h-screen bg-white">
      <Header activePage="styling" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-[#FFF9EE] rounded-full text-[#171212] text-sm font-medium mb-4">
            <Check className="h-4 w-4 mr-2" />
            분석 완료
          </div>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            맞춤 스타일링
            결과
          </h1>
          <p className="text-lg text-gray-600">당신만을 위한 완벽한 코디를 찾아왔어요</p>
        </div>

        <StylingResultsPageClient />

        <StylingResultsFooter />
      </div>
    </div>
  )
}