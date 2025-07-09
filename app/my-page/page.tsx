"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { User, Settings, Heart, ShoppingBag, Bell, Shield, Edit, Save, Eye, Trash2, Camera } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  phone: string
  address: string
  bio: string
  height: string
  gender: string
  stylingRequest: string
  budget: number
  topSize: string
  bottomSize: string
  shoeSize: string
  occasions: string[]
  bodyTypes: string[]
  selectedStyles: string[]
}

interface SavedOutfit {
  id: string
  title: string
  items: Array<{
    name: string
    price: string
    image: string
  }>
  savedAt: string
  matchRate: number
  category: string
}

interface FavoriteItem {
  id: string
  name: string
  brand: string
  price: string
  image: string
  category: string
  savedAt: string
}

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    height: "",
    gender: "",
    stylingRequest: "",
    budget: 0,
    topSize: "",
    bottomSize: "",
    shoeSize: "",
    occasions: [],
    bodyTypes: [],
    selectedStyles: [],
  })

  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([])
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([])
  const router = useRouter()

  useEffect(() => {
    // Load user data from localStorage
    const signupData = localStorage.getItem("signupData")
    const step1Data = localStorage.getItem("stylingStep1Data")
    const step2Data = localStorage.getItem("stylingStep2Data")
    const step3Data = localStorage.getItem("stylingStep3Data")
    const savedOutfitsData = localStorage.getItem("savedOutfits")
    const favoriteItemsData = localStorage.getItem("favoriteItems")

    if (signupData) {
      const signup = JSON.parse(signupData)
      setUserProfile((prev) => ({
        ...prev,
        name: signup.name || "",
        email: signup.email || "",
      }))
    }

    if (step1Data) {
      const step1 = JSON.parse(step1Data)
      setUserProfile((prev) => ({
        ...prev,
        height: step1.height || "",
        gender: step1.gender || "",
        stylingRequest: step1.stylingRequest || "",
      }))
    }

    if (step2Data) {
      const step2 = JSON.parse(step2Data)
      setUserProfile((prev) => ({
        ...prev,
        budget: step2.budget?.[0] || 0,
        topSize: step2.topSize || "",
        bottomSize: step2.bottomSize || "",
        shoeSize: step2.shoeSize || "",
        occasions: step2.occasions || [],
        bodyTypes: step2.bodyTypes || [],
      }))
    }

    if (step3Data) {
      const step3 = JSON.parse(step3Data)
      setUserProfile((prev) => ({
        ...prev,
        selectedStyles: step3.selectedStyles || [],
      }))
    }

    if (savedOutfitsData) {
      setSavedOutfits(JSON.parse(savedOutfitsData))
    }

    if (favoriteItemsData) {
      setFavoriteItems(JSON.parse(favoriteItemsData))
    }
  }, [])

  const handleSave = () => {
    // Save updated profile to localStorage
    const signupData = {
      name: userProfile.name,
      email: userProfile.email,
    }

    const step1Data = {
      height: userProfile.height,
      gender: userProfile.gender,
      stylingRequest: userProfile.stylingRequest,
    }

    const step2Data = {
      budget: [userProfile.budget],
      topSize: userProfile.topSize,
      bottomSize: userProfile.bottomSize,
      shoeSize: userProfile.shoeSize,
      occasions: userProfile.occasions,
      bodyTypes: userProfile.bodyTypes,
    }

    const step3Data = {
      selectedStyles: userProfile.selectedStyles,
    }

    localStorage.setItem("signupData", JSON.stringify(signupData))
    localStorage.setItem("stylingStep1Data", JSON.stringify(step1Data))
    localStorage.setItem("stylingStep2Data", JSON.stringify(step2Data))
    localStorage.setItem("stylingStep3Data", JSON.stringify(step3Data))

    setIsEditing(false)
  }

  const handleViewOutfit = (outfitId: string) => {
    router.push(`/outfit-detail/${outfitId}`)
  }

  const handleViewWearingShots = (itemId: string) => {
    router.push(`/wearing-shots/${itemId}`)
  }

  const handleDeleteOutfit = (outfitId: string) => {
    const updatedOutfits = savedOutfits.filter((outfit) => outfit.id !== outfitId)
    setSavedOutfits(updatedOutfits)
    localStorage.setItem("savedOutfits", JSON.stringify(updatedOutfits))
  }

  const handleDeleteFavorite = (itemId: string) => {
    const updatedFavorites = favoriteItems.filter((item) => item.id !== itemId)
    setFavoriteItems(updatedFavorites)
    localStorage.setItem("favoriteItems", JSON.stringify(updatedFavorites))
  }

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                StyleGenius
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => router.push("/personal-color-diagnosis")}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                퍼스널컬러
              </button>
              <button
                onClick={() => router.push("/styling-step1")}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                스타일링
              </button>
              <button className="text-purple-600 font-medium">마이페이지</button>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="border-purple-200 text-purple-600 bg-transparent"
              >
                로그아웃
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{userProfile.name || "사용자"}</h2>
                  <p className="text-gray-600">{userProfile.email}</p>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === "profile"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "text-gray-600 hover:bg-purple-50"
                    }`}
                  >
                    <User className="h-5 w-5 mr-3" />
                    프로필
                  </button>
                  <button
                    onClick={() => setActiveTab("outfits")}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === "outfits"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "text-gray-600 hover:bg-purple-50"
                    }`}
                  >
                    <ShoppingBag className="h-5 w-5 mr-3" />
                    저장된 코디
                  </button>
                  <button
                    onClick={() => setActiveTab("favorites")}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === "favorites"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "text-gray-600 hover:bg-purple-50"
                    }`}
                  >
                    <Heart className="h-5 w-5 mr-3" />
                    찜한 아이템
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === "settings"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "text-gray-600 hover:bg-purple-50"
                    }`}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    설정
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-gray-900">프로필 정보</CardTitle>
                    <Button
                      onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                      {isEditing ? "저장" : "수정"}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Tabs defaultValue="personal" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="personal">개인정보</TabsTrigger>
                        <TabsTrigger value="styling">스타일링</TabsTrigger>
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
                          <div>
                            <Label htmlFor="phone">전화번호</Label>
                            <Input
                              id="phone"
                              value={userProfile.phone}
                              onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <Label htmlFor="address">주소</Label>
                            <Input
                              id="address"
                              value={userProfile.address}
                              onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="bio">자기소개</Label>
                          <Textarea
                            id="bio"
                            value={userProfile.bio}
                            onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                            disabled={!isEditing}
                            rows={3}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="styling" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="height">키 (cm)</Label>
                            <Input
                              id="height"
                              value={userProfile.height}
                              onChange={(e) => setUserProfile({ ...userProfile, height: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <Label htmlFor="gender">성별</Label>
                            <Input
                              id="gender"
                              value={
                                userProfile.gender === "male"
                                  ? "남성"
                                  : userProfile.gender === "female"
                                    ? "여성"
                                    : userProfile.gender === "other"
                                      ? "기타"
                                      : ""
                              }
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
                              <Label htmlFor="topSize" className="text-sm">
                                상의
                              </Label>
                              <Input
                                id="topSize"
                                value={userProfile.topSize}
                                onChange={(e) => setUserProfile({ ...userProfile, topSize: e.target.value })}
                                disabled={!isEditing}
                              />
                            </div>
                            <div>
                              <Label htmlFor="bottomSize" className="text-sm">
                                하의
                              </Label>
                              <Input
                                id="bottomSize"
                                value={userProfile.bottomSize}
                                onChange={(e) => setUserProfile({ ...userProfile, bottomSize: e.target.value })}
                                disabled={!isEditing}
                              />
                            </div>
                            <div>
                              <Label htmlFor="shoeSize" className="text-sm">
                                신발
                              </Label>
                              <Input
                                id="shoeSize"
                                value={userProfile.shoeSize}
                                onChange={(e) => setUserProfile({ ...userProfile, shoeSize: e.target.value })}
                                disabled={!isEditing}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="stylingRequest">스타일링 요청사항</Label>
                          <Textarea
                            id="stylingRequest"
                            value={userProfile.stylingRequest}
                            onChange={(e) => setUserProfile({ ...userProfile, stylingRequest: e.target.value })}
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
                  {savedOutfits.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">저장된 코디가 없습니다</p>
                      <p className="text-gray-400 text-sm">스타일링 결과에서 마음에 드는 코디를 저장해보세요</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedOutfits.map((outfit, index) => (
                        <Card key={`${outfit.id}-${index}`} className="border-purple-100 hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                              {outfit.items && outfit.items.length > 0 ? (
                                <img src={outfit.items[0].image} alt={outfit.title} className="w-full h-full object-cover"/>
                              ) : (
                                // 그렇지 않으면 (배열이 비어있거나 없으면) 플레이스홀더를 보여줍니다.
                                <img src="/placeholder.svg?height=200&width=200" alt="No image available"
                                className="w-full h-full object-cover"/>
                              )}
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{outfit.title}</h3>
                            <div className="flex items-center justify-between mb-3">
                              <Badge
                                className={
                                  outfit.category === "business"
                                    ? "bg-green-100 text-green-800"
                                    : outfit.category === "casual"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-purple-100 text-purple-800"
                                }
                              >
                                {outfit.category}
                              </Badge>
                              <span className="text-sm text-gray-500">{outfit.matchRate}% 매치</span>
                            </div>
                            <p className="text-xs text-gray-400 mb-3">
                              저장일: {new Date(outfit.savedAt).toLocaleDateString()}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleViewOutfit(outfit.id)}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                상세보기
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteOutfit(outfit.id)}
                                className="border-red-200 text-red-600 hover:bg-red-50"
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
                  {favoriteItems.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">찜한 아이템이 없습니다</p>
                      <p className="text-gray-400 text-sm">마음에 드는 아이템을 찜해보세요</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteItems.map((item) => (
                        <Card key={item.id} className="border-purple-100 hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                              <img
                                src={item.image || "/placeholder.svg?height=200&width=200"}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                            <p className="text-lg font-bold text-purple-600 mb-3">{item.price}</p>
                            <p className="text-xs text-gray-400 mb-3">
                              찜한 날: {new Date(item.savedAt).toLocaleDateString()}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleViewWearingShots(item.id)}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                              >
                                <Camera className="h-4 w-4 mr-1" />
                                착용샷
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteFavorite(item.id)}
                                className="border-red-200 text-red-600 hover:bg-red-50"
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
                        <span className="text-gray-700">세일 정보</span>
                        <input type="checkbox" className="toggle" />
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
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Bell className="h-4 w-4 mr-2" />
                        데이터 다운로드
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        계정 삭제
                      </Button>
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
