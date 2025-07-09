# My Shopping Fairy

이 프로젝트는 React 프로젝트입니다. Radix UI의 다양한 UI 컴포넌트와 Tailwind CSS를 사용하여 스타일링되었습니다.

## 시작하기

로컬 환경에서 프로젝트를 설정하고 실행하려면 다음 단계를 따르세요.

### 필수 사항

*   **Node.js:** Node.js가 설치되어 있는지 확인하세요 (버전 18 이상 권장). [nodejs.org](https://nodejs.org/)에서 다운로드할 수 있습니다.
*   **pnpm:** 이 프로젝트는 `pnpm`을 패키지 관리자로 사용합니다. `pnpm`이 설치되어 있지 않다면, npm을 통해 설치할 수 있습니다:
    ```bash / cmd
    npm install -g pnpm
    ```

### 설치

1.  **저장소 복제:**
    ```bash / cmd
    git clone <your-repository-url>
    cd my-v0-project
    ```
    (이 프로젝트가 Git 저장소에 있다면 `<your-repository-url>`을 실제 URL로 바꾸세요.)

2.  **의존성 설치:**
    ```bash / cmd
    pnpm install
    ```
    이 명령은 `package.json`에 나열된 모든 필수 프로젝트 의존성을 설치합니다.

### 개발 서버 실행

개발 서버를 시작하려면:

```bash / cmd
pnpm run dev
```

이 명령은 `http://localhost:3000`에서 Next.js 개발 서버를 시작합니다.

### 프로덕션 빌드

프로덕션용으로 프로젝트를 빌드하려면:

```bash / cmd
pnpm build
```

이 명령은 배포를 위한 애플리케이션을 컴파일합니다.

### 린팅

린터를 실행하려면:

```bash / cmd
pnpm lint
```

### 프로젝트 구조 (주요 디렉토리)

*   `app/`: 주요 애플리케이션 페이지 및 레이아웃을 포함합니다. Next.js App Router 페이지가 위치하는 곳입니다.
*   `components/`: 재사용 가능한 UI 컴포넌트를 포함하며, 커스텀 컴포넌트 및 UI 라이브러리 프리미티브의 래퍼를 포함합니다.
    *   `components/ui/`: Shadcn UI 또는 유사한 라이브러리의 UI 컴포넌트를 포함합니다.
*   `lib/`: 유틸리티 함수 및 헬퍼 모듈.
*   `public/`: 이미지와 같은 정적 자산.
*   `styles/`: 전역 CSS 파일.

## 최적화 관련 참고 사항

최근 개발 과정에서, 특히 예산 슬라이더와 같은 인터랙티브 요소의 성능을 최적화하기 위해 상당한 노력을 기울였습니다. 주요 최적화 내용은 다음과 같습니다:

*   **클라이언트 컴포넌트 지시어:** React 훅을 사용하는 컴포넌트가 `"use client"`로 표시되도록 했습니다.
*   **메모이제이션:** `SizeInformationSection`, `Header`, `OccasionsSection`, `BodyTypeSection`과 같은 컴포넌트에서 불필요한 리렌더링을 방지하기 위해 `React.memo`를 광범위하게 사용했습니다.
*   **`useCallback`:** 메모이제이션된 컴포넌트에 전달되는 안정적인 함수 참조를 위해 `React.useCallback`을 활용했습니다.
*   **상태 배치 및 분리:** 리렌더링 범위를 최소화하고, UI 중심의 상태와 핵심 애플리케이션 데이터를 분리하여 더 부드러운 상호 작용을 위해 상태를 전략적으로 관리했습니다.

이러한 조치들은 전반적으로 반응성이 뛰어나고 부드러운 사용자 경험에 기여합니다.
