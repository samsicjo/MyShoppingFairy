"use client"

import { useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useStyling } from './StylingContext'

export default function AuthStylingSync() {
  const { userId } = useAuth();
  const { clearStylingData } = useStyling();

  useEffect(() => {
    // userId가 변경될 때마다 stylingData를 초기화
    // userId가 null이 되거나, 다른 사용자로 변경될 때 초기화
    console.log("AuthStylingSync: userId changed, triggering clearStylingData.", userId);
    clearStylingData();
  }, [userId, clearStylingData]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않고 로직만 수행합니다.
}
