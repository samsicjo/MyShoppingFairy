"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useStyling } from "@/app/context/StylingContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/ui/Header";
import { Check, User, DollarSign, Heart, Edit, Database, Sparkles, Loader2 } from "lucide-react"
import { useAuth } from "@/app/context/AuthContext";

export default function StylingSummary() {
  const { stylingData, setStylingData } = useStyling()
  const { userId } = useAuth();
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const saveStylingSummaryToDatabase = async (): Promise<any | null> => {
    if (userId === null) {
      alert("로그인이 필요합니다.");
      return null;
    }

    setIsSaving(true);

    const dataToSave = {
      budget: stylingData.budget || 0,
      occasion: stylingData.occasion || '',
      height: stylingData.height || 0,
      gender: stylingData.gender || "",
      top_size: stylingData.top_size || "",
      bottom_size: stylingData.bottom_size || 0,
      shoe_size: stylingData.shoe_size || 0,
      body_feature: stylingData.body_feature || [],
      preferred_styles: stylingData.preferred_styles || [],
      user_situation: stylingData.user_situation || [], // 이 줄을 추가합니다.
    };

    try {
      const checkResponse = await fetch(`http://127.0.0.1:8000/users/styling_summary_info?user_id=${userId}`);

      let method: 'POST' | 'PATCH';
      let url: string;

      if (checkResponse.ok) {
        method = 'PATCH';
        url = `http://127.0.0.1:8000/users/styling_summary_update?user_id=${userId}`;
      } else if (checkResponse.status === 404) {
        method = 'POST';
        url = `http://127.0.0.1:8000/users/styling_summary_create?user_id=${userId}`;
      } else {
        const errorData = await checkResponse.json();
        throw new Error(errorData.detail || '스타일 정보 확인에 실패했습니다.');
      }

      const saveResponse = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        let errorMessage = '스타일 정보 저장에 실패했습니다.';
        if (errorData && errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((err: any) => err.msg).join(', ');
          } else if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          } else {
            errorMessage = JSON.stringify(errorData.detail);
          }
        }
        throw errorMessage; // Error 객체 대신 메시지 문자열 자체를 던집니다.
      }

      const savedData = await saveResponse.json();
      console.log(`Styling summary successfully ${method === 'PATCH' ? 'updated' : 'saved'}!`);
      return savedData; // Return the saved data
    } catch (error: any) {
      console.error("스타일 정보 저장/업데이트 실패:", error);
      alert(`스타일 정보 저장/업데이트 중 오류가 발생했습니다: ${error}`);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartAnalysis = async () => {
    const savedData = await saveStylingSummaryToDatabase();
    if (savedData) {
      // Update the context with the latest data from the server
      setStylingData(prevData => ({ 
        ...prevData, 
        budget: savedData.budget,
        occasion: savedData.occasion.split(', ').map((s: string) => s.trim()),
        height: savedData.height,
        gender: savedData.gender,
        top_size: savedData.top_size,
        bottom_size: savedData.bottom_size,
        shoe_size: savedData.shoe_size,
        body_feature: savedData.body_feature,
        preferred_styles: savedData.preferred_styles,
      }));
      router.push("/styling-results");
    }
  };

  const handleEdit = () => {
    router.push("/styling-step1")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="styling" />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step Indicator */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-600 text-sm font-medium mb-4">
            <Check className="h-4 w-4 mr-2" />
            입력 완료
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            입력하신{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">정보</span>를
            확인해주세요
          </h1>
          <p className="text-lg text-gray-600">아래 정보가 맞다면 분석을 시작하겠습니다</p>
        </div>

        <div className="space-y-6">
          {isClient ? (
            <>
              {/* 퍼스널컬러 */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">퍼스널컬러</h3>
                  </div>
                  <p className="text-gray-600 mb-4">진단 또는 선택하신 퍼스널컬러 정보</p>

                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{stylingData.personalColor || "정보 없음"}</h4>
                    <p className="text-gray-600 text-sm mb-4">{stylingData.description || "정보 없음"}</p>
                  </div>

                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">추천 색상</h5>
                    <div className="flex flex-wrap gap-3">
                      {stylingData.recommendedColors?.map((color, index) => (
                        <div key={index} className="text-center">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm mb-1"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs text-gray-600">
                            {stylingData.colorNames?.[index] || `색상${index + 1}`}
                          </span>
                        </div>
                      )) || <span className="text-gray-500">추천 색상이 없습니다</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 기본 정보 */}
              <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">기본 정보</h3>
                  </div>
                  <p className="text-gray-600 mb-4">입력하신 기본 정보</p>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm font-medium text-gray-700">키</span>
                      <p className="text-lg font-semibold text-gray-900">{stylingData.height || "-"}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">성별</span>
                      <p className="text-lg font-semibold text-gray-900">{stylingData.gender || "-"}</p>
                    </div>
                  </div>

                  {stylingData.occasion && (
                    <div className="mt-4">
                      <span className="text-sm font-medium text-gray-700 block mb-2">스타일링 요청사항</span>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{stylingData.occasion}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 예산 및 사이즈 */}
              <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">예산 및 사이즈</h3>
                  </div>
                  <p className="text-gray-600 mb-4">설정하신 예산과 사이즈 정보</p>

                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">예산</span>
                      <p className="text-2xl font-bold text-green-600">{Number(stylingData.budget) / 10000 || 0}만원</p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-700 block mb-2">사이즈 정보</span>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center bg-gray-50 p-3 rounded-lg">
                          <span className="text-xs text-gray-500 block">상의</span>
                          <p className="font-semibold text-lg">{stylingData.top_size || "-"}</p>
                        </div>
                        <div className="text-center bg-gray-50 p-3 rounded-lg">
                          <span className="text-xs text-gray-500 block">하의(허리)</span>
                          <p className="font-semibold text-lg">{stylingData.bottom_size || "-"} inch</p>
                        </div>
                        <div className="text-center bg-gray-50 p-3 rounded-lg">
                          <span className="text-xs text-gray-500 block">신발</span>
                          <p className="font-semibold text-lg">{stylingData.shoe_size || "-"} mm</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-700 block mb-2">주요 스타일 상황</span>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(stylingData.user_situation) ? stylingData.user_situation : []).map((user_situation) => (
                          <Badge key={user_situation} variant="secondary" className="bg-blue-100 text-blue-800">
                            {user_situation}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {stylingData.body_feature && stylingData.body_feature.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-700 block mb-2">체형 특징</span>
                        <div className="flex flex-wrap gap-2">
                          {stylingData.body_feature.map((bodyType) => (
                            <Badge key={bodyType} variant="outline" className="border-gray-300">
                              {bodyType}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 스타일 선호도 */}
              <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                      <Heart className="h-4 w-4 text-pink-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">스타일 선호도</h3>
                  </div>
                  <p className="text-gray-600 mb-4">선택하신 선호 스타일</p>

                  <div className="flex flex-wrap gap-2">
                    {stylingData.preferred_styles?.map((style) => (
                      <Badge key={style} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2">
                        {style}
                      </Badge>
                    )) || <span className="text-gray-500">선택된 스타일이 없습니다</span>}
                  </div>
                </CardContent>
              </Card>

              {/* 데이터 저장 안내 */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Database className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">데이터베이스 저장</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    위 정보들이 데이터베이스에 저장되어 개인화된 스타일링 추천에 활용됩니다.
                  </p>
                  <div className="bg-white/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">저장될 정보:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 퍼스널컬러 진단 결과</li>
                      <li>• 기본 정보 (키, 성별, 요청사항)</li>
                      <li>• 예산 및 사이즈 정보</li>
                      <li>• 스타일 선호도</li>
                      <li>• 저장 시간 및 사용자 ID</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center text-gray-500">데이터를 불러오는 중...</div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          <Button variant="outline" onClick={handleEdit} className="flex items-center px-6 py-3 bg-transparent">
            <Edit className="h-4 w-4 mr-2" />
            수정하기
          </Button>
          <Button
            onClick={handleStartAnalysis}
            disabled={isSaving}
            className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Database className="h-4 w-4 mr-2" />
            )}
            {isSaving ? "분석 중..." : "분석 시작하기"}
          </Button>
        </div>
      </div>
    </div>
  )
}

