import { Header } from "@/components/ui/Header";
import { Footer } from '@/components/ui/Footer';
import { InteractiveButtons } from "@/components/ui/InteractiveButtons";
import { Palette, Shirt, Heart } from "lucide-react";

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header activePage="home" />

      {/* Hero Image Section */}
      <section className="relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-2xl overflow-hidden shadow-lg relative">
            <img
              src="/images/service-hero.png"
              alt="Fashion Style"
              className="w-full h-96 md:h-[500px] object-cover"
            />
            {/* 클라이언트 컴포넌트로 분리된 인터랙티브 섹션 */}
            <InteractiveButtons />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-left">
            How It Works
          </h2>
          <h2 className="text-md md:text-2xl font text-gray-900 mb-6 text-left">
            우리서비스의 AI 분석이 당신의 특징과 취향을 분석하여 초개인 맞춤형 패션 스타일링 조언을 제공합니다.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Personal Color Analysis */}
            <div
              // onClick={() => handleNavigation("/personal-color-diagnosis")}
              className="bg-white rounded-lg p-8 shadow-sm border border-red-200 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-2 group group-hover:border-purple-400"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
                <Palette className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                퍼스널컬러 진단
              </h3>
              <p className="text-[#82696B] group-hover:text-gray-700 transition-colors duration-300">
                당신의 피부 톤, 헤어 컬러, 눈동자 색을 기반으로 나에게 딱 맞는 퍼스널 컬러 팔레트를 찾아보세요.
              </p>
            </div>

            {/* Style Recommendation */}
            <div
              // onClick={() => handleNavigation("/styling-step1")}
              className="bg-white rounded-lg p-8 shadow-sm border border-red-200 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-2 group group-hover:border-purple-400"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
                <Shirt className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                스타일링 추천
              </h3>
              <p className="text-[#82696B] group-hover:text-gray-700 transition-colors duration-300">
                나만의 스타일에 맞춘 의류 및 액세서리 추천도 함께 제공됩니다.
              </p>
            </div>

            {/* My Style Profile */}
            <div
              // onClick={() => handleNavigation("/my-page?tab=favorites")}
              className="bg-white rounded-lg p-8 shadow-sm border border-red-200 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-2 group group-hover:border-purple-400"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                찜한 아이템
              </h3>
              <p className="text-[#82696B] group-hover:text-gray-700 transition-colors duration-300">
                스타일 취향과 마음에 드는 아이템은 프로필에서 관리하고 저장해보세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-purple-100 p-4">
        <div className="flex justify-around">
          <button
            // onClick={() => handleNavigation("/personal-color-diagnosis")}
            className="flex flex-col items-center space-y-1 text-purple-600"
            style={{ height: '40px', width: '55.2px' }}
          >
            <Palette className="h-5 w-5" />
            <span className="text-xs">퍼스널컬러</span>
          </button>
          <button
            // onClick={() => handleNavigation("/styling-step1")}
            className="flex flex-col items-center space-y-1 text-purple-600"
            style={{ height: '40px', width: '55.2px' }}
          >
            <Shirt className="h-5 w-5" />
            <span className="text-xs">스타일링</span>
          </button>
          <button
            // onClick={() => handleNavigation("/my-page?tab=favorites")}
            className="flex flex-col items-center space-y-1 text-purple-600"
            style={{ height: '40px', width: '55.2px' }}
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs">마이페이지</span>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
