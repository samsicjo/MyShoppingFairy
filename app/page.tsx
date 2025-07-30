import { Header } from "@/components/ui/Header"
import { Footer } from '@/components/ui/Footer'
import { InteractiveButtons } from "@/components/ui/InteractiveButtons"
import { NavigationButtons } from "@/components/NavigationButtons"

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

      <NavigationButtons />

      <Footer />
    </div>
  )
}
