'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { OutfitImageCarousel } from '@/components/OutfitImageCarousel'
import { useStyleData, Look, Item } from '@/app/context/StyleDataContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/ui/Header'
import { ArrowLeft } from 'lucide-react'
import { CustomLoader } from '@/components/ui/CustomLoader'
import { FavoriteButton } from '@/components/FavoriteButton'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

export default function OutfitDetail() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { recommendations } = useStyleData()
  const [look, setLook] = useState<Look | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalForProductId, setModalForProductId] = useState<string | null>(null)
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [isFetchingPreview, setIsFetchingPreview] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)

  const fetchPreviewImages = async (productId: string) => {
    setIsFetchingPreview(true)
    setPreviewError(null)
    try {
      const response = await fetch(`http://127.0.0.1:8000/crawling/${productId}/snap`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.snap_img_url && Array.isArray(data.snap_img_url)) {
        const validImages = data.snap_img_url.filter((url: string) => url && url.length > 0)
        setPreviewImages(validImages.slice(0, 3))
      } else {
        setPreviewImages([])
      }
    } catch (e: any) {
      setPreviewError(e.message)
      setPreviewImages([])
    } finally {
      setIsFetchingPreview(false)
    }
  }

  useEffect(() => {
    const id = params.id ? decodeURIComponent(params.id as string) : null
    if (!id) {
      setError('유효하지 않은 ID입니다.')
      setIsLoading(false)
      return
    }

    const isNumericId = !isNaN(Number(id))

    if (isNumericId) {
      const fetchLookDetail = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/users/looks/${id}`)
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.detail || '코디 정보를 불러오는 데 실패했습니다.')
          }
          const data = await response.json()
          setLook(data)
        } catch (e: any) {
          setError(e.message)
        } finally {
          setIsLoading(false)
        }
      }
      fetchLookDetail()
    } else {
      const existingLook = recommendations.find(r => r.look_name === id)
      if (existingLook) {
        setLook(existingLook)
      } else {
        setError('해당 코디 정보를 찾을 수 없습니다.')
      }
      setIsLoading(false)
    }
  }, [params.id, recommendations])

  if (isLoading) {
    return (
      
      <div className="flex justify-center items-center min-h-screen">
        <CustomLoader className="h-16 w-16" />
        <p className="ml-4 text-lg">코디 정보를 불러오는 중...</p>  
      </div>
    
    )
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
    )
  }

  const allItems: [string, Item][] = Object.entries(look.items).filter((entry): entry is [string, Item] => entry[1] !== null)

  const activeHeaderPage = searchParams.get('from') === 'my-page' ? 'my-page' : 'styling'

  const handleBackClick = () => {
    const fromPage = searchParams.get('from')
    if (fromPage === 'my-page') {
      router.push('/my-page?tab=outfits')
    } else {
      router.push('/styling-results')
    }
  }

  return (
    <div className="min-h-screen bg-white w-full">
      <Header activePage={activeHeaderPage as 'my-page' | 'styling'} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleBackClick}
            className="flex items-center gap-2 px-4 py-2 rounded-full border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            뒤로가기
          </Button>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{look.look_name}</h1>
          <p className="text-gray-600 mb-4">{look.look_description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 왼쪽: 메인 이미지와 설명 */}
          <div className="space-y-6">
            <div className="bg-gray-100 rounded-2xl overflow-hidden">
              <OutfitImageCarousel items={look.items} altText={look.look_name} className="w-full aspect-square" />
            </div>
            <div className="px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">찜한 아이템</h2>
              <p className="text-gray-600">내가 좋아하는(찜)한 아이템들을 한눈에 볼 수 있는 곳이에요.</p>
            </div>
          </div>

          {/* 오른쪽: 아이템 목록 */}
          <div className="space-y-4">
            {allItems.map(([category, item]) => (
              <div key={category} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex gap-4">
                  <div className="relative flex-shrink-0">
                    <Image
                      src={item.image_url && item.image_url.length > 0 ? item.image_url : "/placeholder.svg"}
                      alt={item.product_name || '상품 이미지'}
                      width={60}
                      height={60}
                      className="w-15 h-15 object-cover rounded-lg bg-white"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-base mb-1">{item.product_name}</h4>
                    <p className="text-sm font-medium text-gray-800 mb-4">₩{item.price.toLocaleString()}</p>
                    <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                      {item.product_id && (
                        <Dialog
                          open={modalForProductId === String(item.product_id)}
                          onOpenChange={(isOpen) => {
                            if (isOpen) {
                              setModalForProductId(String(item.product_id))
                              fetchPreviewImages(String(item.product_id))
                            } else {
                              setModalForProductId(null)
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="px-3 py-2 text-xs sm:text-sm border-gray-300 text-gray-600 hover:bg-gray-50 rounded-full flex-shrink-0"
                              disabled={isFetchingPreview && modalForProductId === String(item.product_id)}
                            >
                              {isFetchingPreview && modalForProductId === String(item.product_id) ? '로딩 중...' : '착용샷'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl p-0">
                            <DialogTitle className="sr-only">미리보기 이미지</DialogTitle>
                            <DialogDescription className="sr-only">미리보기 이미지를 보여주는 모달입니다.</DialogDescription>
                            {isFetchingPreview && (
                              <div className="flex justify-center items-center h-full">
                    <CustomLoader className="h-8 w-8" />
                  </div>
                            )}
                            {previewError && (
                              <div className="p-4 text-center text-red-500">
                                {previewError}
                              </div>
                            )}
                            {!isFetchingPreview && !previewError && previewImages.length > 0 && (
                              <Carousel className="w-full max-w-sm mx-auto">
                                <CarouselContent>
                                  {previewImages.map((imgSrc, index) => (
                                    <CarouselItem key={index}>
                                      <div className="p-1">
                                        <Card>
                                          <CardContent className="flex aspect-square items-center justify-center p-6">
                                            <Image
                                              src={imgSrc}
                                              alt={`미리보기 이미지 ${index + 1}`}
                                              width={500}
                                              height={500}
                                              className="object-contain max-h-[500px]"
                                            />
                                          </CardContent>
                                        </Card>
                                      </div>
                                    </CarouselItem>
                                  ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                              </Carousel>
                            )}
                            {!isFetchingPreview && !previewError && previewImages.length === 0 && (
                              <div className="p-4 text-center text-gray-500">
                                해당 제품의 스냅/후기 사진이 없습니다.
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      )}
                      <div className="flex-shrink-0">
                        <FavoriteButton item={item} />
                      </div>
                      <Button
                        size="sm"
                        className="px-3 py-2 text-xs sm:text-sm bg-[#E8B5B8] hover:bg-[#F5E8DA] text-gray-900 rounded-full transition-colors duration-200 flex-shrink-0"
                        onClick={() => window.open(`https://store.musinsa.com/app/goods/${item.product_id}`, '_blank')}
                      >
                        구매하기
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}