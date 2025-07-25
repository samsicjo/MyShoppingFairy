"use client"

import type React from "react"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Eye, EyeOff, Lock } from "lucide-react"

import { useAuth } from "@/app/context/AuthContext";
import { useModal } from "@/app/context/ModalContext";

function LoginContent() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSignupSuccessMessage, setShowSignupSuccessMessage] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState(''); // 아이디 오류 메시지 상태 추가
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(''); // 비밀번호 오류 메시지 상태 추가
  const router = useRouter()
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { openModal } = useModal();

  useEffect(() => {
    if (searchParams.get('signupSuccess') === 'true') {
      setShowSignupSuccessMessage(true);
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // 입력 변경 시 관련 오류 메시지 초기화
    if (field === 'username') {
      setUsernameErrorMessage('');
    }
    if (field === 'password') {
      setPasswordErrorMessage('');
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(formData.username, formData.password);
    } catch (error: any) {
      let errorMessage = error.message || '로그인 중 알 수 없는 오류가 발생했습니다.';

      if (errorMessage.includes("사용자를 찾을 수 없습니다.")) {
        setUsernameErrorMessage('사용자를 찾을 수 없습니다.');
      } else if (errorMessage.includes("비밀번호가 일치하지 않습니다.")) {
        setPasswordErrorMessage('비밀번호가 일치하지 않습니다.');
      } else {
        // 그 외의 오류는 모달으로 표시
        openModal("로그인 오류", errorMessage);
      }
      console.error("Login failed in LoginPage:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4 cursor-pointer" onClick={() => router.push('/')}>
            
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <img src='/favicon.ico'></img>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              My Shopping Fairy
            </span>
          </div>
          <p className="text-gray-600">나만의 퍼스널 스타일링 서비스</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-xl">
          {showSignupSuccessMessage && (
            <div className="bg-green-100 text-green-800 p-3 text-center rounded-t-lg font-medium">
              회원가입이 완료되었습니다! 환영해요!
            </div>
          )}
          <CardHeader className="text-center pb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4 mx-auto">
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">로그인</h1>
            <p className="text-gray-600">계정에 로그인하여 개인화된 스타일링을 받아보세요</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* 아이디 입력 */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
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
                    className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
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
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
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
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
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
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>

            {/* 링크들 */}
            <div className="text-center space-y-4">
              <div className="flex justify-center items-center space-x-4 text-sm">
                <button className="text-purple-600 hover:text-purple-700 hover:underline">아이디 찾기</button>
                <span className="text-gray-400">|</span>
                <button className="text-purple-600 hover:text-purple-700 hover:underline">비밀번호 찾기</button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-gray-600 mb-3">아직 계정이 없으신가요?</p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/signup")}
                  className="w-full h-12 border-2 border-purple-200 text-purple-600 hover:bg-purple-50 font-medium rounded-lg bg-transparent"
                >
                  회원가입
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
