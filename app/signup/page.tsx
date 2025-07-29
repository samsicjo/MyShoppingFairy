"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useModal } from "@/app/context/ModalContext"


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
  const [usernameCheckMessage, setUsernameCheckMessage] = useState('')
  const [usernameCheckStatus, setUsernameCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'error'>('idle')
  const [emailErrorMessage, setEmailErrorMessage] = useState('') // 이메일 오류 메시지 상태 추가
  const router = useRouter()
  const { openModal } = useModal()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === 'username') {
      setUsernameCheckMessage('') // 아이디 변경 시 메시지 초기화
      setUsernameCheckStatus('idle')
    }
    if (field === 'email') {
      setEmailErrorMessage('') // 이메일 변경 시 메시지 초기화
    }
  }

  const handleAgreementChange = (field: string, checked: boolean) => {
    setAgreements((prev) => ({ ...prev, [field]: checked }))
  }

  const handleUsernameCheck = async () => {
    if (!formData.username) {
      setUsernameCheckMessage('아이디를 입력해주세요.')
      setUsernameCheckStatus('error')
      return
    }

    setUsernameCheckStatus('checking')
    setUsernameCheckMessage('')

    try {
      const response = await fetch(`http://127.0.0.1:8000/users/user_create_check?username=${formData.username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const isAvailable = await response.json()
        if (isAvailable === true) {
          setUsernameCheckMessage('사용할 수 있는 아이디입니다.')
          setUsernameCheckStatus('available')
        } else {
          // Should not happen based on API spec, but for safety
          setUsernameCheckMessage('아이디 확인 중 알 수 없는 오류가 발생했습니다.')
          setUsernameCheckStatus('error')
        }
      } else if (response.status === 400) {
        const errorData = await response.json()
        if (errorData.detail === "이미 존재하는 아이디입니다.") {
          setUsernameCheckMessage('이미 존재하는 아이디입니다.')
          setUsernameCheckStatus('taken')
        } else {
          setUsernameCheckMessage(`아이디 확인 중 오류가 발생했습니다: ${errorData.detail || response.statusText}`)
          setUsernameCheckStatus('error')
        }
      } else {
        setUsernameCheckMessage(`아이디 확인 중 오류가 발생했습니다: ${response.statusText}`)
        setUsernameCheckStatus('error')
      }
    } catch (error) {
      console.error('아이디 확인 실패:', error)
      setUsernameCheckMessage('네트워크 오류 또는 서버에 연결할 수 없습니다.')
      setUsernameCheckStatus('error')
    } finally {
      // No need to set loading state to false here, as status handles it
    }
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
      agreements.privacy &&
      usernameCheckStatus === 'available' // 아이디 확인 상태 추가
    )
  }

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i
    return re.test(String(email).toLowerCase())
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(formData.email)) {
      setEmailErrorMessage('올바른 이메일 형식이 아닙니다.')
      return
    }

    if (!isFormValid()) return

    setIsLoading(true)

    try {
      const response = await fetch(`http://127.0.0.1:8000/users/user_create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        let errorMessage = '회원가입 실패'
        if (errorData && errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((err: any) => err.msg).join(', ')
          } else if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail
          }
        }

        // 이메일 중복 오류 처리
        if (errorMessage.includes("이미 존재하는 사용자명 또는 이메일입니다.")) {
          setEmailErrorMessage('이미 존재하는 이메일입니다!')
          return // alert 대신 필드 옆에 메시지 표시
        }

        throw errorMessage // Error 객체 대신 메시지 문자열 자체를 던집니다.
      }

      router.push("/login?signupSuccess=true") // 회원가입 성공 후 로그인 페이지로 이동
    } catch (error: any) {
      openModal("회원가입 오류", error)
      console.error('Signup failed:', error)
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

      {/* 중앙 회원가입 폼 */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-left mb-12">
            <h1 className="text-5xl font-bold text-black mb-4">회원가입</h1>
            <p className="text-gray-500">My Shopping Fairy에 가입하여 맞춤형 스타일링을 받아보세요</p>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSignup} className="space-y-6">
              {/* 아이디 입력 */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-black">
                  아이디 <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-grow">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="아이디를 입력하세요"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="pl-10 h-14 border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg bg-[#FFF6F4] w-full"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleUsernameCheck}
                    disabled={usernameCheckStatus === 'checking' || !formData.username}
                    className="h-14 px-4 py-2 text-white rounded-full text-sm"
                    style={{ backgroundColor: '#E8B5B8 !important' }}
                  >
                    {usernameCheckStatus === 'checking' ? '확인 중...' : '아이디 확인'}
                  </Button>
                </div>
                {usernameCheckMessage && (
                  <p
                    className={`text-sm ${usernameCheckStatus === 'available' ? 'text-green-600' : 'text-red-500'}`}
                  >
                    {usernameCheckMessage}
                  </p>
                )}
              </div>

              {/* 이름 입력 */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-black">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-14 border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg bg-[#FFF6F4]"
                  required
                />
              </div>

              {/* 이메일 입력 */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-black">
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
                    className="pl-10 h-14 border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg bg-[#FFF6F4]"
                    required
                  />
                </div>
                {emailErrorMessage && (
                  <p className="text-red-500 text-sm mt-1">
                    {emailErrorMessage}
                  </p>
                )}
              </div>

              {/* 비밀번호 입력 */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-black">
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
              </div>

              {/* 비밀번호 확인 */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-black">
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
                    className="pl-10 pr-10 h-14 border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg bg-[#FFF6F4]"
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
                  <Label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                    이용약관에 동의합니다
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={agreements.privacy}
                    onCheckedChange={(checked) => handleAgreementChange("privacy", checked as boolean)}
                  />
                  <Label htmlFor="privacy" className="text-sm text-gray-600 cursor-pointer">
                    개인정보처리방침에 동의합니다
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketing"
                    checked={agreements.marketing}
                    onCheckedChange={(checked) => handleAgreementChange("marketing", checked as boolean)}
                  />
                  <Label htmlFor="marketing" className="text-sm text-gray-600 cursor-pointer">
                    마케팅 정보 수신에 동의합니다 (선택)
                  </Label>
                </div>
              </div>

              {/* 회원가입 버튼 */}
              <Button
                type="submit"
                disabled={isLoading || !isFormValid()}
                className="w-full h-14 text-white font-medium rounded-full transition-all duration-300 mt-8"
                style={{ backgroundColor: '#E8B5B8 !important' }}
              >
                {isLoading ? "회원가입 중..." : "회원가입"}
              </Button>
            </form>

            {/* 로그인 링크 */}
            <div className="text-center pt-6">
              <p className="text-gray-500 mb-3">이미 계정이 있으신가요?
                <button
                  onClick={() => router.push("/login")}
                  className="text-blue-500 hover:underline ml-1"
                >
                  로그인
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}