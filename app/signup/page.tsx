"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Eye, EyeOff, Lock, Mail } from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAgreementChange = (field: string, checked: boolean) => {
    setAgreements((prev) => ({ ...prev, [field]: checked }))
  }

  const isFormValid = () => {
    return (
      formData.username &&
      formData.name &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      agreements.terms &&
      agreements.privacy
    )
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid()) return

    setIsLoading(true)

    // 간단한 회원가입 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          username: formData.username,
          name: formData.name,
          email: formData.email,
        }),
      )
      setIsLoading(false)
      router.push("/")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4  cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              My Shopping Fairy
            </span>
          </div>
          <p className="text-gray-600">나만의 퍼스널 스타일링 서비스</p>
        </div>

        {/* Signup Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4 mx-auto">
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">회원가입</h1>
            <p className="text-gray-600">My Shopping Fairy에 가입하여 맞춤형 스타일링을 받아보세요</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSignup} className="space-y-4">
              {/* 아이디 입력 */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  아이디 <span className="text-red-500">*</span>
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
              </div>

              {/* 이름 입력 */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              {/* 이메일 입력 */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  이메일 <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              {/* 비밀번호 입력 */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  비밀번호 <span className="text-red-500">*</span>
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
              </div>

              {/* 비밀번호 확인 */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-500 text-xs">비밀번호가 일치하지 않습니다.</p>
                )}
              </div>

              {/* 약관 동의 */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreements.terms}
                    onCheckedChange={(checked) => handleAgreementChange("terms", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                    이용약관에 동의합니다 <span className="text-red-500">*</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={agreements.privacy}
                    onCheckedChange={(checked) => handleAgreementChange("privacy", checked as boolean)}
                  />
                  <Label htmlFor="privacy" className="text-sm text-gray-700 cursor-pointer">
                    개인정보처리방침에 동의합니다 <span className="text-red-500">*</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketing"
                    checked={agreements.marketing}
                    onCheckedChange={(checked) => handleAgreementChange("marketing", checked as boolean)}
                  />
                  <Label htmlFor="marketing" className="text-sm text-gray-700 cursor-pointer">
                    마케팅 정보 수신에 동의합니다 (선택)
                  </Label>
                </div>
              </div>

              {/* 회원가입 버튼 */}
              <Button
                type="submit"
                disabled={isLoading || !isFormValid()}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 mt-6"
              >
                {isLoading ? "회원가입 중..." : "회원가입"}
              </Button>
            </form>

            {/* 로그인 링크 */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 mb-3">이미 계정이 있으신가요?</p>
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="w-full h-12 border-2 border-purple-200 text-purple-600 hover:bg-purple-50 font-medium rounded-lg bg-transparent"
              >
                로그인
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
