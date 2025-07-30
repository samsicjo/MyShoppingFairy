"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { OutfitImageCarousel } from "@/components/OutfitImageCarousel"
import { Header } from '@/components/ui/Header'
import { User, Settings, Heart, ShoppingBag, Shield, Eye, Trash2 } from "lucide-react"
import { CustomLoader } from "@/components/ui/CustomLoader"
import { Item, Look } from "../context/StyleDataContext"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
//`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/user_login`
interface MyPageUserProfile {
  username: string
  name: string
  email: string
  phone?: string // 더미 데이터로 유지
  address?: string // 더미 데이터로 유지
  bio?: string // 더미 데이터로 유지
  budget: number
  occasion: string
  height: number
  gender: string
  top_size: string
  bottom_size: number
  shoe_size: number
  body_feature: string[]
  preferred_styles: string[]
}

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState<MyPageUserProfile>({
    username: "",
    name: "",
    email: "",
    phone: "", // 더미 데이터로 유지
    address: "", // 더미 데이터로 유지
    bio: "", // 더미 데이터로 유지
    budget: 0,
    occasion: "",
    height: 0,
    gender: "",
    top_size: "",
    bottom_size: 0,
    shoe_size: 0,
    body_feature: [],
    preferred_styles: [],
  })

  const [savedOutfits, setSavedOutfits] = useState<Look[]>([])
  const [favoriteItems, setFavoriteItems] = useState<Item[]>([])
  const [isLoadingOutfits, setIsLoadingOutfits] = useState(true) // Add loading state
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true) // Add loading state for favorites
  const router = useRouter()
  const { userId, logout } = useAuth()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {

        router.push("/")
        return
      }
      try {
        // Fetch user profile
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/user_info?user_id=${userId}`)
        let userData = null
        if (userResponse.ok) {
          userData = await userResponse.json()
        } else {
          console.error("Failed to fetch user data:", userResponse.statusText)
        }

        // Fetch styling data
        const stylingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/styling_summary_info?user_id=${userId}`)
        let stylingData = null
        if (stylingResponse.ok) {
          stylingData = await stylingResponse.json()
        } else if (stylingResponse.status === 404) {
          console.log("No styling data found for user (404) in my-page. This is expected for new users.")
          stylingData = null // Explicitly set to null if 404
        } else {
          console.error("Failed to fetch styling data:", stylingResponse.status, stylingResponse.statusText)
        }

        if (userData) { // Check if userData exists
          setUserProfile({
            username: userData.username || "",
            name: userData.name || "",
            email: userData.email || "",
            phone: userProfile.phone || "", // 기존 값 유지 또는 빈 문자열
            address: userProfile.address || "", // 기존 값 유지 또는 빈 문자열
            bio: userProfile.bio || "", // 기존 값 유지 또는 빈 문자열
            budget: stylingData?.budget || 0,
            occasion: stylingData?.occasion || "",
            height: stylingData?.height || 0,
            gender: stylingData?.gender || "",
            top_size: stylingData?.top_size || "",
            bottom_size: stylingData?.bottom_size || 0,
            shoe_size: stylingData?.shoe_size || 0,
            body_feature: stylingData?.body_feature || [],
            preferred_styles: stylingData?.preferred_styles || [],
          })
        }
        //Debug


        // Fetch favorite items
        setIsLoadingFavorites(true) // Set loading to true before fetch
        const favoritesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/favorites?user_id=${userId}`)
        if (favoritesResponse.ok) {
          const favoritesData = await favoritesResponse.json()
          console.log(favoritesData)
          setFavoriteItems(favoritesData)
        } else {
          console.error("Failed to fetch favorite items:", favoritesResponse.statusText)
          setFavoriteItems([]) // Ensure favoriteItems is empty on error
        }
        setIsLoadingFavorites(false) // Set loading to false after fetch

        // Fetch favorite looks
        setIsLoadingOutfits(true) // Set loading to true before fetch
        const looksResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/looks?user_id=${userId}`)
        if (looksResponse.ok) {
          const looksData = await looksResponse.json()
          console.log("Fetched looks:", looksData.looks)
          setSavedOutfits(looksData.looks)
        } else {
          console.error("Failed to fetch favorite looks:", looksResponse.statusText)
          setSavedOutfits([]) // Ensure savedOutfits is empty on error
        }
        setIsLoadingOutfits(false) // Set loading to false after fetch

      } catch (error) {
        console.error("Error fetching data:", error)
        setIsLoadingOutfits(false) // Set loading to false on error
        setIsLoadingFavorites(false) // Set loading to false on error
      }
    }

    fetchUserData()
    console.log(userProfile)
  }, [userId])

  const handleSave = async () => {
    if (!userId) {
      console.error("User not authenticated.")
      return
    }

    try {
      // Update user profile
      const userUpdateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/user_update?user_id=${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userProfile.name,
          email: userProfile.email,
        }),
      })

      if (!userUpdateResponse.ok) {
        console.error("Failed to update user profile:", userUpdateResponse.statusText)
      }

      // Update styling data
      const stylingUpdateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/styling_summary_update?user_id=${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          budget: userProfile.budget,
          occasion: userProfile.occasion,
          height: userProfile.height,
          gender: userProfile.gender,
          top_size: userProfile.top_size,
          bottom_size: userProfile.bottom_size,
          shoe_size: userProfile.shoe_size,
          body_feature: userProfile.body_feature,
          preferred_styles: userProfile.preferred_styles,
        }),
      })

      if (!stylingUpdateResponse.ok) {
        console.error("Failed to update styling data:", stylingUpdateResponse.statusText)
      }

      setIsEditing(false)
    } catch (error) {
      console.error("Error saving data:", error)
    }
  }

  const handleViewOutfit = (look_id: number) => {
    router.push(`/outfit-detail/${look_id}?from=my-page`)
  }

  const handleViewWearingShots = (productId: number) => {
    router.push(`/wearing-shots/${productId}`)
  }

  const handleDeleteOutfit = async (look_id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/looks/${look_id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setSavedOutfits(savedOutfits.filter((outfit) => outfit.look_id !== look_id))
      } else {
        console.error("Failed to delete outfit:", response.statusText)
      }
    } catch (error) {
      console.error("Error deleting outfit:", error)
    }
  }

  const handleDeleteFavorite = async (productId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/favorites/?product_id=${productId}&user_id=${userId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setFavoriteItems(favoriteItems.filter((item) => item.product_id !== productId))
      } else {
        console.error("Failed to delete favorite item:", response.statusText)
      }
    } catch (error) {
      console.error("Error deleting favorite item:", error)
    }
  }

  const handleDeleteAccount = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/user_delete?user_id=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 계정 삭제 성공
        logout();
      } else {
        // 계정 삭제 실패
        console.log('계정 삭제 중 오류 발생.');
      }
    } catch (error) {
      console.error('계정 삭제 중 오류 발생:', error);
      console.log('계정 삭제 중 오류 발생.');
    }
  };

  const occasionLabels: { [key: string]: string } = {
    work: "출근/업무",
    date: "데이트",
    daily: "일상/집",
    party: "파티/행사",
    travel: "여행",
    sports: "운동/액티비티",
  }

  const bodyTypeLabels: { [key: string]: string } = {
    "upper-developed": "상체가 발달한 편",
    "lower-developed": "하체가 발달한 편",
    balanced: "전체적으로 균형잡힌 편",
    slim: "마른 편",
    chubby: "통통한 편",
    tall: "키가 큰 편",
  }

  const styleLabels: { [key: string]: string } = {
    casual: "캐주얼",
    street: "스트릿",
    gorpcore: "고프코어",
    workwear: "워크웨어",
    preppy: "프레피",
    cityboy: "시티보이",
    sporty: "스포티",
    romantic: "로맨틱",
    girlish: "걸리시",
    classic: "클래식",
    minimal: "미니멀",
    chic: "시크",
    retro: "레트로",
    ethnic: "에스닉",
    resort: "리조트",
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="my-page" />


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="text-center mb-8">
              <div className="w-20 h-20 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-gray-600" />
              </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{userProfile.name || "최삼식"}</h2>
                <p className="text-gray-600 text-sm">{userProfile.email}</p>
              </div>

              <nav className="space-y-3">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center px-4 py-3 rounded-full transition-colors ${activeTab === "profile"
                    ? "text-gray-900"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                  style={{ backgroundColor: activeTab === "profile" ? "#E8B5B8" : "transparent" }}
                >
                  <User className="h-5 w-5 mr-3" />
                  프로필
                </button>
                <button
                  onClick={() => setActiveTab("outfits")}
                  className={`w-full flex items-center px-4 py-3 rounded-full transition-colors ${activeTab === "outfits"
                    ? "text-gray-900"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                  style={{ backgroundColor: activeTab === "outfits" ? "#E8B5B8" : "transparent" }}
                >
                  <ShoppingBag className="h-5 w-5 mr-3" />
                  저장된 코디
                </button>
                <button
                  onClick={() => setActiveTab("favorites")}
                  className={`w-full flex items-center px-4 py-3 rounded-full transition-colors ${activeTab === "favorites"
                    ? "text-gray-900"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                  style={{ backgroundColor: activeTab === "favorites" ? "#E8B5B8" : "transparent" }}
                >
                  <Heart className="h-5 w-5 mr-3" />
                  찜한 아이템
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center px-4 py-3 rounded-full transition-colors ${activeTab === "settings"
                    ? "text-gray-900"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                  style={{ backgroundColor: activeTab === "settings" ? "#E8B5B8" : "transparent" }}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  설정
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-gray-900">프로필 정보</CardTitle>
                    {/* <Button
                      onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                      {isEditing ? "저장" : "수정"}
                    </Button> */}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Tabs defaultValue="personal" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="personal">개인정보</TabsTrigger>
                        <TabsTrigger value="security">보안</TabsTrigger>
                      </TabsList>

                      <TabsContent value="personal" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">이름</Label>
                            <Input
                              id="name"
                              value={userProfile.name}
                              onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">이메일</Label>
                            <Input
                              id="email"
                              type="email"
                              value={userProfile.email}
                              onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="height">키 (cm)</Label>
                            <Input
                              id="height"
                              value={userProfile.height}
                              onChange={(e) => setUserProfile({ ...userProfile, height: Number(e.target.value) })}
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <Label htmlFor="gender">성별</Label>
                            <Input
                              id="gender"
                              value={userProfile.gender}
                              disabled
                            />
                          </div>
                          <div>
                            <Label htmlFor="budget">예산 (만원)</Label>
                            <Input
                              id="budget"
                              type="number"
                              value={userProfile.budget}
                              onChange={(e) => setUserProfile({ ...userProfile, budget: Number(e.target.value) })}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div>
                          <Label>사이즈 정보</Label>
                          <div className="grid grid-cols-3 gap-4 mt-2">
                            <div>
                              <Label htmlFor="top_size" className="text-sm">
                                상의
                              </Label>
                              <Input
                                id="top_size"
                                value={userProfile.top_size}
                                onChange={(e) => setUserProfile({ ...userProfile, top_size: e.target.value })}
                                disabled={!isEditing}
                              />
                            </div>
                            <div>
                              <Label htmlFor="bottom_size" className="text-sm">
                                하의
                              </Label>
                              <Input
                                id="bottom_size"
                                value={userProfile.bottom_size}
                                onChange={(e) => setUserProfile({ ...userProfile, bottom_size: Number(e.target.value) })}
                                disabled={!isEditing}
                              />
                            </div>
                            <div>
                              <Label htmlFor="shoe_size" className="text-sm">
                                신발
                              </Label>
                              <Input
                                id="shoe_size"
                                value={userProfile.shoe_size}
                                onChange={(e) => setUserProfile({ ...userProfile, shoe_size: Number(e.target.value) })}
                                disabled={!isEditing}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="occasion">스타일링 요청사항</Label>
                          <Textarea
                            id="occasion"
                            value={userProfile.occasion}
                            onChange={(e) => setUserProfile({ ...userProfile, occasion: e.target.value })}
                            disabled={!isEditing}
                            rows={3}
                          />
                        </div>
                      </TabsContent>




                      <TabsContent value="security" className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword">현재 비밀번호</Label>
                          <Input id="currentPassword" type="password" />
                        </div>
                        <div>
                          <Label htmlFor="newPassword">새 비밀번호</Label>
                          <Input id="newPassword" type="password" />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          비밀번호 변경
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "outfits" && (
              <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">저장된 코디</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingOutfits ? (
                    <div className="text-center py-12">
                      <CustomLoader className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">저장된 코디 불러오는 중...</p>
                    </div>
                  ) : savedOutfits.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">저장된 코디가 없습니다</p>
                      <p className="text-gray-400 text-sm">스타일링 결과에서 마음에 드는 코디를 저장해보세요</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedOutfits.map((outfit, index) => (
                        <Card key={outfit.look_id || `saved-outfit-${index}`} className="border-purple-100 hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <OutfitImageCarousel items={outfit.items} altText={outfit.look_name} />
                            <h3 className="font-semibold text-gray-900 mt-4 mb-2">{outfit.look_name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{outfit.look_description}</p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleViewOutfit(outfit.look_id)}
                                className="flex-1 bg-[#E8B5B8] hover:bg-[#F5E8DA] transition-colors duration-200 rounded-full"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                상세보기
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteOutfit(outfit.look_id)}
                                className="border-[#E8B5B8] text-[#E8B5B8] hover:bg-[#E8B5B8] rounded-full"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "favorites" && (
              <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">찜한 아이템</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingFavorites ? (
                    <div className="text-center py-12">
                      <CustomLoader className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">찜한 아이템 불러오는 중...</p>
                    </div>
                  ) : favoriteItems.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">찜한 아이템이 없습니다</p>
                      <p className="text-gray-400 text-sm">마음에 드는 아이템을 찜해보세요</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteItems.map((item, index) => (
                        <Card key={item.product_id || `favorite-item-${index}`} className="border-purple-100 hover:shadow-lg transition-shadow h-full">
                          <CardContent className="p-4 h-full flex flex-col">
                            <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                              <img
                                src={
                                  item && item.image_url && typeof item.image_url === 'string' && item.image_url.length > 0
                                    ? item.image_url
                                    : "/placeholder.svg?height=200&width=200"
                                }
                                alt={item.product_name || "상품 이미지"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 flex flex-col">
                              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.product_name}</h3>
                              <p className="text-lg font-bold text-purple-600 mb-3">{item.price} 원</p>
                              <div className="flex gap-2 mt-auto">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteFavorite(item.product_id)}
                                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-full"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  삭제
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "settings" && (
              <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">알림 설정</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">새로운 스타일링 추천</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">이메일 뉴스레터</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">개인정보</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Shield className="h-4 w-4 mr-2" />
                        개인정보 처리방침
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            계정 삭제
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>정말 계정을 삭제하시겠습니까?</AlertDialogTitle>
                            <AlertDialogDescription>
                              이 작업은 되돌릴 수 없습니다. 계정을 삭제하면 모든 프로필 정보, 저장된 코디, 찜한 아이템이 영구적으로 사라집니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">삭제</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
