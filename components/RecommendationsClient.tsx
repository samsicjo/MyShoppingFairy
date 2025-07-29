"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { OutfitImageCarousel } from '@/components/OutfitImageCarousel'
import { useStyling } from '@/app/context/StylingContext'
import { useStyleData, Look } from '@/app/context/StyleDataContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Loader2, Share2 } from 'lucide-react'
import { useAuth } from '@/app/context/AuthContext'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function RecommendationsClient() {
  const { stylingData } = useStyling()
  const { recommendations, isLoading, error, fetchRecommendations } = useStyleData()
  const { userId } = useAuth()
  const router = useRouter()

  const [isMounted, setIsMounted] = useState(false)
  const [likedLooks, setLikedLooks] = useState<Array<{ look_name: string; look_id: number }>>([])
  const [savingLooks, setSavingLooks] = useState<string[]>([])
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', message: '' })

  const openModal = (title: string, message: string) => {
    setModalContent({ title, message })
    setIsModalOpen(true)
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const savedLooks = localStorage.getItem('savedLooks')
    if (savedLooks) {
      try {
        const parsedLooks = JSON.parse(savedLooks)
        if (Array.isArray(parsedLooks) && parsedLooks.every(item => typeof item === 'object' && item !== null && 'look_name' in item && 'look_id' in item)) {
          setLikedLooks(parsedLooks)
        } else {
          console.warn("Saved looks data format is invalid or old, clearing.")
          setLikedLooks([])
        }
      } catch (e) {
        console.error("Failed to parse saved looks from localStorage", e)
        setLikedLooks([])
      }
    }
    // Trigger fetchRecommendations on mount
    fetchRecommendations()
  }, [fetchRecommendations]) // Add fetchRecommendations to dependency array

  const toggleLike = async (look: Look) => {
    const lookName = look.look_name
    const isLiked = likedLooks.some(item => item.look_name === lookName)

    if (savingLooks.includes(lookName)) {
      return
    }

    if (isLiked) {
      const itemToRemove = likedLooks.find(item => item.look_name === lookName)
      if (itemToRemove) {
        const newLikedLooks = likedLooks.filter((item) => item.look_name !== lookName)
        setLikedLooks(newLikedLooks)
        localStorage.setItem('savedLooks', JSON.stringify(newLikedLooks))
        openModal('알림', `${lookName}이(가) 찜 목록에서 제거되었습니다.`)
        deleteLookFromDb(itemToRemove.look_id)
      }
    } else {
      setSavingLooks(prev => [...prev, lookName])
      try {
        const savedLookId = await saveLookToDb(look)
        const newLikedLooks = [...likedLooks, { look_name: lookName, look_id: savedLookId }]
        setLikedLooks(newLikedLooks)
        localStorage.setItem('savedLooks', JSON.stringify(newLikedLooks))
        openModal('성공', "룩이 성공적으로 저장되었습니다!")
      } catch (error) {
        console.error("룩 저장 오류:", error)
        openModal('오류', `룩 저장 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`)
      } finally {
        setSavingLooks(prev => prev.filter(name => name !== lookName))
      }
    }
  }

  const saveLookToDb = async (look: Look): Promise<number> => {
    if (!userId) {
      openModal("오류", "로그인이 필요합니다.")
      throw new Error("User not logged in")
    }

    console.log("API 요청!!!!!!!!!!!!!!!!!!!!!")
    const response = await fetch(`http://127.0.0.1:8000/users/looks/create?user_id=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(look),
    })

    if (!response.ok) {
      const errorData = await response.json()
      let errorMessage = '룩 저장에 실패했습니다.'
      if (errorData && errorData.detail) {
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map((err: any) => err.msg).join(', ')
        } else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail
        } else {
          errorMessage = JSON.stringify(errorData.detail)
        }
      }
      throw new Error(errorMessage)
    }

    const responseData = await response.json()
    console.log('responseData : ', responseData)
    console.log('responseData.id : ', responseData.id)
    console.log(typeof(responseData.id))
    const savedLookId = responseData.id
    
    if (typeof savedLookId === 'number') {
      return savedLookId
    } else {
      throw new Error("저장된 룩의 ID를 받지 못했습니다.")
    }
  }

  const deleteLookFromDb = async (lookId: number) => {
    if (!userId) {
      openModal("오류", "로그인이 필요합니다.")
      return
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/users/looks/${lookId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        let errorMessage = '룩 삭제에 실패했습니다.'
        if (errorData && errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((err: any) => err.msg).join(', ')
          } else if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail
          } else {
            errorMessage = JSON.stringify(errorData.detail)
          }
        }
        throw new Error(errorMessage)
      }

      console.log(`Look ${lookId} deleted successfully from DB.`)
    } catch (error) {
      console.error("룩 삭제 오류:", error)
      openModal('오류', `룩 삭제 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
        <p className="ml-4 text-lg">추천 코디를 불러오는 중입니다...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[200px]">
        <p className="text-red-500 text-lg">오류: {error}</p>
        <Button onClick={() => fetchRecommendations()} className="mt-4">다시 시도하기</Button>
      </div>
    )
  }

  return (
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
                    <Button variant="ghost" size="icon" className={`hover:text-red-500 bg-white/80 hover:bg-white/90 rounded-full w-8 h-8 ${likedLooks.some(item => item.look_name === look.look_name) ? 'text-red-500' : 'text-gray-400'}`} onClick={(e) => { e.stopPropagation(); toggleLike(look) }}>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(look) }
                        }
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
  )
}
