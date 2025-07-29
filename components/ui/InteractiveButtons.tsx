'use client'

import { Button } from '@/components/ui/button'
import { Palette, Shirt } from 'lucide-react'
import { useNavigation } from '@/hooks/useNavigations'

export function InteractiveButtons() {
  const { handleNavigation } = useNavigation()
  

  return (
    <div className="absolute inset-0 flex flex-col justify-end items-end text-right p-8 pr-6 pb-12">
      <h1 className="text-3xl font-bold text-[#171212] mb-3 drop-shadow-lg">
        Find Your Perfect Style
      </h1>
      <p className="text-base text-[#171212]/90 mb-6 drop-shadow-md max-w-md">
        AI가 찾아주는 당신만의 완벽한 스타일
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() => handleNavigation('/personal-color-diagnosis')}
          className="bg-[#F8B8D2] hover:bg-[#f5a6c6] text-white hover:text-[#171212] px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Palette className="h-5 w-5 mr-2" />
          퍼스널컬러 진단
        </Button>
        <Button
          onClick={() => handleNavigation('/styling-step1')}
          className="bg-[#A8958F] hover:bg-[#A8958F] text-white hover:text-[#171212] px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Shirt className="h-5 w-5 mr-2" />
          스타일링 추천
        </Button>
      </div>
    </div>
  )
}