"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/Header";
import { Brain, Shirt, Heart, Star, TrendingUp, ArrowRight } from "lucide-react"
import { useAuth } from "./context/AuthContext";

export default function HomePage() {
  const router = useRouter()
  const { isLoggedIn } = useAuth();

  const handleNavigation = (path: string) => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    router.push(path)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="home" />

      {/* Hero - Services Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI가 찾아주는
            </span>
            <br />
            <span className="text-gray-900">당신만의 완벽한 스타일</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            퍼스널컬러 진단부터 맞춤 코디 추천까지, My Shopping Fairy와 함께 새로운 나를 발견해보세요
          </p>
          <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 퍼스널컬러 진단 */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">퍼스널컬러 진단</h3>
                <p className="text-gray-600 mb-6">AI가 찾아주는 당신만의 완벽한 스타일</p>
                <Button
                  onClick={() => handleNavigation("/personal-color-diagnosis")}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full"
                >
                  시작하기
                </Button>
              </CardContent>
            </Card>

            {/* 스타일링 추천 */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shirt className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">스타일링 추천</h3>
                <p className="text-gray-600 mb-6">취향과 상황에 맞는 맞춤 코디</p>
                <Button
                  onClick={() => handleNavigation("/styling-step1")}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full"
                >
                  시작하기
                </Button>
              </CardContent>
            </Card>

            {/* 찜한 아이템 */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">찜한 아이템</h3>
                <p className="text-gray-600 mb-6">마음에 든 코디와 아이템 모음</p>
                <Button
                  onClick={() => handleNavigation("/my-page")}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full"
                >
                  시작하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 overflow-hidden">
            <CardContent className="p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">지금 바로 시작해보세요!</h2>
              <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                몇 분만 투자하여 평생 써먹을 스타일 가이드를 얻을 수 있어요
              </p>
              <Button
                onClick={() => handleNavigation("/personal-color-diagnosis")}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                무료로 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>  

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-purple-100 p-4">
        <div className="flex justify-around">
          <button
            onClick={() => handleNavigation("/personal-color-diagnosis")}
            className="flex flex-col items-center space-y-1 text-purple-600"
            style={{height: '40px', width: '55.2px'}}
          >
            <Brain className="h-5 w-5" />
            <span className="text-xs">진단</span>
          </button>
          <button
            onClick={() => handleNavigation("/styling-step1")}
            className="flex flex-col items-center space-y-1 text-purple-600"
            style={{height: '40px', width: '55.2px'}}
          >
            <Shirt className="h-5 w-5" />
            <span className="text-xs">스타일링</span>
          </button>
          <button
            onClick={() => handleNavigation("/my-page")}
            className="flex flex-col items-center space-y-1 text-purple-600"
            style={{height: '40px', width: '55.2px'}}
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs">마이페이지</span>
          </button>
        </div>
      </div>
    </div>
  )
}
