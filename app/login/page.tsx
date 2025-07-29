"use client"

import type React from "react"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Eye, EyeOff, Lock } from "lucide-react"
import { useAuth } from "@/app/context/AuthContext"
import { useModal } from "@/app/context/ModalContext"


function LoginContent() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSignupSuccessMessage, setShowSignupSuccessMessage] = useState(false)
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('') // 아이디 오류 메시지 상태 추가
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('') // 비밀번호 오류 메시지 상태 추가
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const { openModal } = useModal()

  useEffect(() => {
    if (searchParams.get('signupSuccess') === 'true') {
      setShowSignupSuccessMessage(true)
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // 입력 변경 시 관련 오류 메시지 초기화
    if (field === 'username') {
      setUsernameErrorMessage('')
    }
    if (field === 'password') {
      setPasswordErrorMessage('')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(formData.username, formData.password)
    } catch (error: any) {
      let errorMessage = error.message || '로그인 중 알 수 없는 오류가 발생했습니다.'

      if (errorMessage.includes("사용자를 찾을 수 없습니다.")) {
        setUsernameErrorMessage('사용자를 찾을 수 없습니다.')
      } else if (errorMessage.includes("비밀번호가 일치하지 않습니다.")) {
        setPasswordErrorMessage('비밀번호가 일치하지 않습니다.')
      } else {
        // 그 외의 오류는 모달으로 표시
        openModal("로그인 오류", errorMessage)
      }
      console.error("Login failed in LoginPage:", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 간단한 헤더 - 로고만 표시 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img
                  src="/favicon2.PNG"
                  alt="로고"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <span className="text-[#171212] font-bold">
                My Shopping Fairy
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 중앙 로그인 폼 */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-left mb-12">
            <h1 className="text-5xl font-bold text-black mb-4">로그인</h1>
            <p className="text-gray-500">계정에 로그인하여 개인화된 스타일링을 받아보세요</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            {showSignupSuccessMessage && (
              <div className="bg-green-100 text-green-800 p-3 text-center rounded-lg font-medium">
                회원가입이 완료되었습니다! 환영해요!
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* 아이디 입력 */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-black">
                  아이디
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="아이디를 입력하세요"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className="pl-10 h-14 border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg bg-[#FFF6F4]"
                    required
                  />
                </div>
                {usernameErrorMessage && (
                  <p className="text-red-500 text-sm mt-1">
                    {usernameErrorMessage}
                  </p>
                )}
              </div>

              {/* 비밀번호 입력 */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-black">
                  비밀번호
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10 h-14 border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg bg-[#FFF6F4]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordErrorMessage && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordErrorMessage}
                  </p>
                )}
              </div>

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                disabled={isLoading || !formData.username || !formData.password}
                className="w-full h-14 text-white font-medium rounded-full transition-all duration-300 mt-8"
                style={{ backgroundColor: '#E8B5B8' }}
              >
                {isLoading ? "로그인 중..." : "로그인 →"}
              </Button>
            </form>

            {/* 링크들 */}
            <div className="text-center space-y-4 mt-8">
              <div className="flex justify-center items-center space-x-4 text-sm">
                <button className="text-gray-500 hover:text-gray-700 hover:underline">아이디 찾기</button>
                <span className="text-gray-400">|</span>
                <button className="text-gray-500 hover:text-gray-700 hover:underline">비밀번호 찾기</button>
              </div>

              <div className="pt-6">
                <p className="text-gray-500 mb-3">아직 계정이 없으신가요?
                  <button
                    onClick={() => router.push("/signup")}
                    className="text-blue-500 hover:underline ml-1"
                  >
                    회원가입
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
