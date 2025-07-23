// 퍼스널 컬러 타입 정의
export interface ColorSwatch {
  color: string
  title: string
}

export interface ColorCategory {
  name: string
  title: string
  colors: ColorSwatch[]
}

// 드레이프 테스트에서 사용하는 컬러 팔레트 데이터
export const colorCategories: ColorCategory[] = [
  {
    name: "spring-light",
    title: "봄 라이트",
    colors: [
      { color: "#FFB6C1", title: "라이트 핑크" },
      { color: "#FFC0CB", title: "핑크" },
      { color: "#FFE4B5", title: "피치" },
      { color: "#FFEFD5", title: "파파야 휩" },
      { color: "#FFD700", title: "골드" },
      { color: "#BFFF00", title: "라임" },
      { color: "#90EE90", title: "연두" },
      { color: "#98FB98", title: "라이트 그린" },
      { color: "#E0FFFF", title: "라이트 시안" },
      { color: "#87CEEB", title: "스카이 블루" },
      { color: "#FFFFF0", title: "아이보리" },
      { color: "#F5F5DC", title: "베이지" }
    ],
  },
  {
    name: "spring-bright",
    title: "봄 브라이트",
    colors: [
      { color: "#FF69B4", title: "핫 핑크" },
      { color: "#FF1493", title: "딥 핑크" },
      { color: "#FF6347", title: "토마토" },
      { color: "#FF7F50", title: "코랄" },
      { color: "#FFA500", title: "오렌지" },
      { color: "#FFD700", title: "옐로우" },
      { color: "#32CD32", title: "라임 그린" },
      { color: "#00FF7F", title: "스프링 그린" },
      { color: "#00CED1", title: "다크 터쿼이즈" },
      { color: "#1E90FF", title: "다저 블루" },
      { color: "#000080", title: "네이비" },
      { color: "#FFFFFF", title: "브라이트 화이트" }
    ],
  },
  {
    name: "summer-light",
    title: "여름 라이트",
    colors: [
      { color: "#FADADD", title: "페일 핑크" },
      { color: "#FFE4E1", title: "미스티 로즈" },
      { color: "#DDA0DD", title: "플럼" },
      { color: "#E6E6FA", title: "라벤더" },
      { color: "#E6E6FA", title: "라벤더 블러시" },
      { color: "#87CEEB", title: "스카이 블루" },
      { color: "#B0E0E6", title: "파우더 블루" },
      { color: "#F0F8FF", title: "앨리스 블루" },
      { color: "#F0FFFF", title: "애저" },
      { color: "#F8F8FF", title: "소프트 화이트" },
      { color: "#F5F5DC", title: "베이지" },
      { color: "#D3D3D3", title: "라이트 그레이" }
    ],
  },
  {
    name: "summer-mute",
    title: "여름 뮤트",
    colors: [
      { color: "#BC8F8F", title: "더스티 로즈" },
      { color: "#CD5C5C", title: "인디언 레드" },
      { color: "#DDA0DD", title: "플럼" },
      { color: "#D8BFD8", title: "시슬" },
      { color: "#9370DB", title: "미디엄 퍼플" },
      { color: "#6495ED", title: "뮤트 블루" },
      { color: "#B0C4DE", title: "라이트 스틸 블루" },
      { color: "#F0E68C", title: "카키" },
      { color: "#C0C0C0", title: "실버" },
      { color: "#808080", title: "그레이" },
      { color: "#A9A9A9", title: "다크 그레이" },
      { color: "#778899", title: "라이트 슬레이트 그레이" }
    ],
  },
  {
    name: "autumn-mute",
    title: "가을 뮤트",
    colors: [
      { color: "#BC8F8F", title: "로지 브라운" },
      { color: "#CD853F", title: "페루" },
      { color: "#D2691E", title: "초콜릿" },
      { color: "#F4A460", title: "샌디 브라운" },
      { color: "#DEB887", title: "버리우드" },
      { color: "#DAA520", title: "골든로드" },
      { color: "#BDB76B", title: "다크 카키" },
      { color: "#808000", title: "올리브" },
      { color: "#D2B48C", title: "탄" },
      { color: "#C19A6B", title: "카멜" },
      { color: "#8B4513", title: "브라운" },
      { color: "#A0522D", title: "시에나" }
    ],
  },
  {
    name: "autumn-deep",
    title: "가을 딥",
    colors: [
      { color: "#8B0000", title: "다크 레드" },
      { color: "#B22222", title: "파이어 브릭" },
      { color: "#800020", title: "버건디" },
      { color: "#800000", title: "마룬" },
      { color: "#A0522D", title: "시에나" },
      { color: "#8B4513", title: "새들 브라운" },
      { color: "#654321", title: "딥 브라운" },
      { color: "#556B2F", title: "다크 올리브 그린" },
      { color: "#228B22", title: "포레스트 그린" },
      { color: "#006400", title: "다크 그린" },
      { color: "#2F4F4F", title: "다크 슬레이트 그레이" },
      { color: "#000000", title: "블랙" }
    ],
  },
  {
    name: "winter-bright",
    title: "겨울 브라이트",
    colors: [
      { color: "#FF0000", title: "브라이트 레드" },
      { color: "#DC143C", title: "크림슨" },
      { color: "#FF1493", title: "딥 핑크" },
      { color: "#FF00FF", title: "마젠타" },
      { color: "#8A2BE2", title: "블루 바이올렛" },
      { color: "#0000FF", title: "블루" },
      { color: "#4169E1", title: "로얄 블루" },
      { color: "#00FFFF", title: "시안" },
      { color: "#00FF00", title: "라임" },
      { color: "#FF4500", title: "오렌지 레드" },
      { color: "#FFFFFF", title: "퓨어 화이트" },
      { color: "#000000", title: "블랙" }
    ],
  },
  {
    name: "winter-deep",
    title: "겨울 딥",
    colors: [
      { color: "#8B0000", title: "다크 레드" },
      { color: "#8B008B", title: "다크 마젠타" },
      { color: "#800080", title: "퍼플" },
      { color: "#4B0082", title: "인디고" },
      { color: "#483D8B", title: "다크 슬레이트 블루" },
      { color: "#191970", title: "딥 네이비" },
      { color: "#000080", title: "네이비" },
      { color: "#008B8B", title: "다크 시안" },
      { color: "#2E8B57", title: "씨 그린" },
      { color: "#000000", title: "블랙" },
      { color: "#2F4F4F", title: "다크 그레이" },
      { color: "#696969", title: "딤 그레이" }
    ],
  },
]

// 퍼스널 컬러 타입에 따른 반대 컬러 타입 매핑
export const getOppositeColorType = (personalColor: string): string => {
  const oppositeMap: { [key: string]: string } = {
    'spring-light': 'winter-deep',
    'spring-bright': 'summer-mute',
    'summer-light': 'autumn-deep',
    'summer-mute': 'spring-bright',
    'autumn-mute': 'summer-light',
    'autumn-deep': 'summer-light',
    'winter-bright': 'autumn-mute',
    'winter-deep': 'spring-light'
  }
  return oppositeMap[personalColor] || 'winter-deep'
}

// 특정 퍼스널 컬러 타입의 색상 팔레트를 가져오는 함수
export const getColorPaletteByType = (colorType: string): ColorSwatch[] => {
  const category = colorCategories.find(cat => cat.name === colorType)
  return category ? category.colors : []
}

// 특정 퍼스널 컬러 타입의 색상 팔레트에서 HEX 값만 가져오는 함수
export const getColorHexByType = (colorType: string, count?: number): string[] => {
  const colors = getColorPaletteByType(colorType)
  const hexColors = colors.map(color => color.color)
  return count ? hexColors.slice(0, count) : hexColors
}

// 3x3 그리드용 색상 팔레트 (9개)
export const get3x3ColorPalette = (colorType: string): string[] => {
  return getColorHexByType(colorType, 9)
}

// 반대 컬러 타입의 3x3 그리드용 색상 팔레트
export const getOpposite3x3ColorPalette = (colorType: string): string[] => {
  const oppositeType = getOppositeColorType(colorType)
  return get3x3ColorPalette(oppositeType)
}

// 퍼스널 컬러 타입 이름을 한글로 변환
export const getColorTypeTitle = (colorType: string): string => {
  const category = colorCategories.find(cat => cat.name === colorType)
  return category ? category.title : colorType
}

// 모든 퍼스널 컬러 타입 이름 목록
export const getAllColorTypes = (): string[] => {
  return colorCategories.map(cat => cat.name)
}

// 모든 퍼스널 컬러 타입과 제목 목록
export const getAllColorTypesWithTitles = (): { name: string, title: string }[] => {
  return colorCategories.map(cat => ({ name: cat.name, title: cat.title }))
}

// 네이밍 컨벤션 변환 함수 (Spring-Light -> spring-light)
export const convertToKebabCase = (colorType: string): string => {
  return colorType.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2')
}

// 네이밍 컨벤션 변환 함수 (spring-light -> Spring-Light)
export const convertToPascalCase = (colorType: string): string => {
  return colorType.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('-')
}

// 유연한 색상 팔레트 가져오기 (두 네이밍 컨벤션 모두 지원)
export const getFlexibleColorPalette = (colorType: string): ColorSwatch[] => {
  // 먼저 원본 이름으로 시도
  let category = colorCategories.find(cat => cat.name === colorType)

  // 찾지 못하면 kebab-case로 변환해서 시도
  if (!category) {
    const kebabCase = convertToKebabCase(colorType)
    category = colorCategories.find(cat => cat.name === kebabCase)
  }

  // 여전히 찾지 못하면 PascalCase로 변환해서 시도
  if (!category) {
    const pascalCase = convertToPascalCase(colorType)
    category = colorCategories.find(cat => cat.name === pascalCase)
  }

  return category ? category.colors : []
}

// 유연한 3x3 그리드용 색상 팔레트 (9개)
export const getFlexible3x3ColorPalette = (colorType: string): string[] => {
  const colors = getFlexibleColorPalette(colorType)
  return colors.slice(0, 9).map(color => color.color)
}

// 유연한 반대 컬러 타입의 3x3 그리드용 색상 팔레트
export const getFlexibleOpposite3x3ColorPalette = (colorType: string): string[] => {
  const oppositeType = getOppositeColorType(colorType)
  return getFlexible3x3ColorPalette(oppositeType)
}