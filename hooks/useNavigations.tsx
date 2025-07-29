

"use client"

import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { useModal } from '@/app/context/ModalContext'

export const useNavigation = () => {
    const router = useRouter()
    const { isLoggedIn } = useAuth()
    const { openModal } = useModal()

    const handleNavigation = (path: string) => {
    if (!isLoggedIn) {
      openModal('로그인 필요', '로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.', () => {
        router.push('/login')
      })
      return
    }
    router.push(path)
  }
  return {handleNavigation}
}