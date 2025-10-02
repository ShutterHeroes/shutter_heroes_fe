# Shutter Heroes Frontend - Backend API 연동 계획

## 📋 프로젝트 개요

### 현재 상황
- **프론트엔드**: 사진 공유 플랫폼 UI (pictures 기반)
- **백엔드**: 동물 목격 정보 공유 플랫폼 API (sightings 기반)
- **문제점**: 프론트엔드와 백엔드의 도메인 불일치

### 목표
- 백엔드 API에 맞춰 프론트엔드 전면 재구성
- 동물 목격 정보(Sighting) 중심의 UI로 전환
- JWT 쿠키 기반 인증 구현
- AI 동물 인식 기능 연동

---

## 🎯 1단계: 프로젝트 구조 분석 및 설계

### 1.1 백엔드 API 매핑

#### User API
| 엔드포인트 | 메서드 | 설명 | 인증 | 프론트엔드 페이지 |
|-----------|--------|------|------|------------------|
| `/api/v1/users/register` | POST | 회원가입 | ❌ | `/auth/join` |
| `/api/v1/users/login` | POST | 로그인 | ❌ | `/auth/login` |
| `/api/v1/users/logout` | POST | 로그아웃 | ✅ | - |
| `/api/v1/users/me` | GET | 내 프로필 조회 | ✅ | `/my/profile` |
| `/api/v1/users/me` | PUT | 내 프로필 수정 | ✅ | `/my/settings` |
| `/api/v1/users` | GET | 사용자 목록 | ❌ | `/users` |
| `/api/v1/users/{userId}` | GET | 사용자 프로필 | ❌ | `/users/:userId` |
| `/api/v1/users/exists` | GET | 이메일 중복 확인 | ❌ | 회원가입 폼 |

#### Sighting API
| 엔드포인트 | 메서드 | 설명 | 인증 | 프론트엔드 페이지 |
|-----------|--------|------|------|------------------|
| `/api/v1/sightings` | POST | 목격 정보 생성 | ✅ | `/sightings/submit` |

#### Media API
| 엔드포인트 | 메서드 | 설명 | 인증 | 프론트엔드 페이지 |
|-----------|--------|------|------|------------------|
| `/api/v1/medias/browse` | GET | 공개 미디어 목록 | ❌ | `/`, `/sightings` |
| `/api/v1/medias/my` | GET | 내 미디어 목록 | ✅ | `/my/sightings` |
| `/api/v1/media/{mediaId}/visibility` | PATCH | 공개/비공개 설정 | ✅ | 미디어 상세 |
| `/api/v1/media/{mediaId}` | DELETE | 미디어 삭제 | ✅ | 미디어 상세 |

#### AI API
| 엔드포인트 | 메서드 | 설명 | 인증 | 프론트엔드 페이지 |
|-----------|--------|------|------|------------------|
| `/api/v1/ai/animal/recognition` | POST | 동물 인식 | ❌ | 업로드 프리뷰 |
| `/api/v1/ai/animal/description` | POST | 동물 상세 정보 | ❌ | 동물 정보 모달 |
| `/api/v1/ai/config` | GET | AI 설정 조회 | ❌ | - |

### 1.2 새로운 프론트엔드 구조 설계

```
wemake/
├── app/
│   ├── common/                           # 공통 컴포넌트
│   │   ├── components/
│   │   │   ├── ui/                       # UI 라이브러리 (유지)
│   │   │   ├── navigation.tsx            # 네비게이션 (유지, 수정)
│   │   │   ├── hero.tsx                  # 히어로 섹션 (수정)
│   │   │   └── pagination.tsx            # 페이지네이션 (유지)
│   │   └── pages/
│   │       └── home-page.tsx             # 홈페이지 (수정)
│   │
│   ├── features/
│   │   ├── auth/                         # 인증 (대부분 유지)
│   │   │   ├── components/
│   │   │   │   └── auth-form.tsx         # 로그인/회원가입 폼
│   │   │   ├── pages/
│   │   │   │   ├── login-page.tsx        # 로그인
│   │   │   │   └── join-page.tsx         # 회원가입
│   │   │   ├── hooks/
│   │   │   │   ├── use-login.ts          # 로그인 훅
│   │   │   │   ├── use-register.ts       # 회원가입 훅
│   │   │   │   └── use-logout.ts         # 로그아웃 훅
│   │   │   └── schema.ts                 # Zod 스키마
│   │   │
│   │   ├── sightings/                    # 목격 정보 (새로 생성, pictures 대체)
│   │   │   ├── components/
│   │   │   │   ├── sighting-card.tsx     # 목격 정보 카드
│   │   │   │   ├── sighting-grid.tsx     # 그리드 레이아웃
│   │   │   │   ├── animal-detection-badge.tsx  # 탐지된 동물 뱃지
│   │   │   │   ├── sighting-map.tsx      # 지도 컴포넌트
│   │   │   │   └── animal-info-modal.tsx # 동물 상세 정보 모달
│   │   │   ├── pages/
│   │   │   │   ├── sightings-page.tsx    # 목격 정보 목록
│   │   │   │   ├── sighting-detail-page.tsx  # 상세 보기
│   │   │   │   ├── submit-sighting-page.tsx  # 업로드
│   │   │   │   └── map-page.tsx          # 지도 보기
│   │   │   ├── hooks/
│   │   │   │   ├── use-sightings.ts      # 목격 정보 목록 조회
│   │   │   │   ├── use-my-sightings.ts   # 내 목격 정보
│   │   │   │   ├── use-create-sighting.ts # 생성
│   │   │   │   ├── use-delete-sighting.ts # 삭제
│   │   │   │   └── use-visibility.ts     # 공개/비공개
│   │   │   └── schema.ts
│   │   │
│   │   ├── ai/                           # AI 기능 (새로 생성)
│   │   │   ├── components/
│   │   │   │   ├── image-upload-preview.tsx  # 이미지 업로드 프리뷰
│   │   │   │   ├── detection-overlay.tsx     # 탐지 결과 오버레이
│   │   │   │   └── species-info-card.tsx     # 종 정보 카드
│   │   │   ├── hooks/
│   │   │   │   ├── use-animal-recognition.ts # 동물 인식
│   │   │   │   └── use-species-info.ts       # 종 정보 조회
│   │   │   └── schema.ts
│   │   │
│   │   └── users/                        # 사용자 (일부 유지, 수정)
│   │       ├── components/
│   │       │   ├── user-avatar.tsx       # 유저 아바타 (유지)
│   │       │   └── user-card.tsx         # 유저 카드
│   │       ├── pages/
│   │       │   ├── my-profile-page.tsx   # 내 프로필
│   │       │   ├── my-sightings-page.tsx # 내 목격 정보
│   │       │   ├── settings-page.tsx     # 설정
│   │       │   ├── users-page.tsx        # 사용자 목록
│   │       │   └── user-profile-page.tsx # 사용자 프로필
│   │       ├── hooks/
│   │       │   ├── use-my-profile.ts     # 내 프로필 조회
│   │       │   ├── use-update-profile.ts # 프로필 수정
│   │       │   ├── use-users.ts          # 사용자 목록
│   │       │   └── use-user-profile.ts   # 사용자 프로필
│   │       └── schema.ts
│   │
│   ├── lib/
│   │   ├── api/                          # API 관련 (새로 생성)
│   │   │   ├── client.ts                 # Axios 인스턴스
│   │   │   ├── auth.api.ts               # 인증 API
│   │   │   ├── sightings.api.ts          # 목격 정보 API
│   │   │   ├── media.api.ts              # 미디어 API
│   │   │   ├── ai.api.ts                 # AI API
│   │   │   └── users.api.ts              # 사용자 API
│   │   ├── hooks/                        # 공통 훅
│   │   │   ├── use-auth.ts               # 인증 상태 관리
│   │   │   └── use-pagination.ts         # 페이지네이션
│   │   ├── types/                        # 타입 정의 (새로 생성)
│   │   │   ├── api.types.ts              # API 응답 타입
│   │   │   ├── sighting.types.ts         # Sighting 타입
│   │   │   ├── user.types.ts             # User 타입
│   │   │   └── ai.types.ts               # AI 타입
│   │   ├── constants/                    # 상수
│   │   │   └── api.constants.ts          # API URL 등
│   │   └── utils.ts                      # 유틸리티 (유지)
│   │
│   ├── root.tsx                          # 루트 레이아웃 (유지)
│   ├── routes.ts                         # 라우팅 (전면 수정)
│   └── app.css                           # 스타일 (유지)
│
├── public/                               # 정적 파일 (유지)
├── .env.local                            # 환경 변수 (새로 생성)
├── package.json                          # 의존성 (axios 추가)
└── ...
```

### 1.3 새로운 라우팅 구조

```typescript
// app/routes.ts
[
  // 홈
  index("common/pages/home-page.tsx"),

  // 인증
  ...prefix("/auth", [
    route("/login", "features/auth/pages/login-page.tsx"),
    route("/join", "features/auth/pages/join-page.tsx"),
  ]),

  // 목격 정보
  ...prefix("/sightings", [
    index("features/sightings/pages/sightings-page.tsx"),        // 목록
    route("/submit", "features/sightings/pages/submit-sighting-page.tsx"), // 업로드
    route("/map", "features/sightings/pages/map-page.tsx"),      // 지도
    route("/:sightingId", "features/sightings/pages/sighting-detail-page.tsx"), // 상세
  ]),

  // 사용자
  ...prefix("/users", [
    index("features/users/pages/users-page.tsx"),                // 사용자 목록
    route("/:userId", "features/users/pages/user-profile-page.tsx"), // 사용자 프로필
  ]),

  // 마이페이지
  ...prefix("/my", [
    route("/profile", "features/users/pages/my-profile-page.tsx"),
    route("/sightings", "features/users/pages/my-sightings-page.tsx"),
    route("/settings", "features/users/pages/settings-page.tsx"),
  ]),
]
```

---

## 🔧 2단계: 환경 설정 및 기본 인프라 구축

### 2.1 환경 변수 설정

**파일: `.env.local`**
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=10000
```

### 2.2 의존성 추가

```bash
npm install axios
npm install @tanstack/react-query
npm install react-hook-form @hookform/resolvers
```

### 2.3 API 클라이언트 구성

**파일: `app/lib/api/client.ts`**
```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // 쿠키 전송을 위해 필수
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 실패 시 로그인 페이지로 리다이렉트
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
```

### 2.4 타입 정의

**파일: `app/lib/types/api.types.ts`**
```typescript
// 공통 응답 타입
export interface PageableResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}
```

---

## 🚀 3단계: 기능별 구현 순서

### 3.1 Phase 1: 인증 시스템 (1-2일)

**우선순위: 최상**

#### 구현 항목
1. ✅ 회원가입 (이메일 중복 확인 포함)
2. ✅ 로그인 (JWT 쿠키 기반)
3. ✅ 로그아웃
4. ✅ 인증 상태 관리 (Context API 또는 Zustand)
5. ✅ Protected Routes (인증 필요한 페이지 보호)

#### 구현 파일
- `app/lib/api/auth.api.ts` - 인증 API 함수
- `app/lib/hooks/use-auth.ts` - 인증 상태 관리
- `app/features/auth/pages/login-page.tsx`
- `app/features/auth/pages/join-page.tsx`
- `app/features/auth/hooks/use-login.ts`
- `app/features/auth/hooks/use-register.ts`
- `app/features/auth/schema.ts`

#### API 연동
```typescript
// auth.api.ts
export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post('/api/v1/users/register', data),

  login: (data: LoginRequest) =>
    apiClient.post('/api/v1/users/login', data),

  logout: () =>
    apiClient.post('/api/v1/users/logout'),

  checkEmail: (email: string) =>
    apiClient.get(`/api/v1/users/exists?email=${email}`),

  getMyProfile: () =>
    apiClient.get('/api/v1/users/me'),
};
```

---

### 3.2 Phase 2: 사용자 프로필 (1일)

**우선순위: 상**

#### 구현 항목
1. ✅ 내 프로필 조회
2. ✅ 프로필 수정
3. ✅ 사용자 목록 조회
4. ✅ 사용자 프로필 조회

#### 구현 파일
- `app/lib/api/users.api.ts`
- `app/features/users/pages/my-profile-page.tsx`
- `app/features/users/pages/settings-page.tsx`
- `app/features/users/pages/users-page.tsx`
- `app/features/users/pages/user-profile-page.tsx`
- `app/features/users/hooks/*`

---

### 3.3 Phase 3: 미디어 목록 조회 (1-2일)

**우선순위: 상**

#### 구현 항목
1. ✅ 공개 미디어 목록 조회 (페이지네이션)
2. ✅ 내 미디어 목록 조회
3. ✅ Sighting 카드 컴포넌트
4. ✅ 그리드 레이아웃
5. ✅ 페이지네이션

#### 구현 파일
- `app/lib/api/media.api.ts`
- `app/features/sightings/components/sighting-card.tsx`
- `app/features/sightings/components/sighting-grid.tsx`
- `app/features/sightings/pages/sightings-page.tsx`
- `app/features/users/pages/my-sightings-page.tsx`
- `app/features/sightings/hooks/use-sightings.ts`

#### API 연동
```typescript
// media.api.ts
export const mediaApi = {
  browse: (params: BrowseParams) =>
    apiClient.get('/api/v1/medias/browse', { params }),

  myUploads: (params: BrowseParams) =>
    apiClient.get('/api/v1/medias/my', { params }),

  updateVisibility: (mediaId: string, visibility: 'public' | 'private') =>
    apiClient.patch(`/api/v1/media/${mediaId}/visibility`, { visibility }),

  deleteMedia: (mediaId: string) =>
    apiClient.delete(`/api/v1/media/${mediaId}`),
};
```

---

### 3.4 Phase 4: AI 동물 인식 (2일)

**우선순위: 중**

#### 구현 항목
1. ✅ 이미지 업로드 UI
2. ✅ AI 동물 인식 API 연동
3. ✅ 탐지 결과 시각화 (Bounding Box)
4. ✅ 동물 상세 정보 조회
5. ✅ 동물 정보 모달

#### 구현 파일
- `app/lib/api/ai.api.ts`
- `app/features/ai/components/image-upload-preview.tsx`
- `app/features/ai/components/detection-overlay.tsx`
- `app/features/ai/components/species-info-card.tsx`
- `app/features/ai/hooks/use-animal-recognition.ts`
- `app/features/ai/hooks/use-species-info.ts`

#### API 연동
```typescript
// ai.api.ts
export const aiApi = {
  recognizeAnimal: (imageFile: File, params?: RecognitionParams) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return apiClient.post('/api/v1/ai/animal/recognition', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params,
    });
  },

  getAnimalDescription: (scientificName: string) =>
    apiClient.post(`/api/v1/ai/animal/description?scientificName=${scientificName}`),
};
```

---

### 3.5 Phase 5: Sighting 생성 (2-3일)

**우선순위: 상**

#### 구현 항목
1. ✅ 이미지 업로드 폼
2. ✅ 제목/설명 입력
3. ✅ AI 인식 결과 미리보기
4. ✅ Sighting 생성 API 연동
5. ✅ 생성 후 상세 페이지로 이동

#### 구현 파일
- `app/lib/api/sightings.api.ts`
- `app/features/sightings/pages/submit-sighting-page.tsx`
- `app/features/sightings/hooks/use-create-sighting.ts`
- `app/features/sightings/schema.ts`

#### API 연동
```typescript
// sightings.api.ts
export const sightingsApi = {
  create: (data: CreateSightingRequest) => {
    const formData = new FormData();
    formData.append('image', data.image);
    return apiClient.post('/api/v1/sightings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { title: data.title, description: data.description },
    });
  },
};
```

---

### 3.6 Phase 6: Sighting 상세 페이지 (1-2일)

**우선순위: 중**

#### 구현 항목
1. ✅ Sighting 정보 표시
2. ✅ 탐지된 동물 목록
3. ✅ 지도에 위치 표시
4. ✅ 공개/비공개 토글
5. ✅ 삭제 기능

#### 구현 파일
- `app/features/sightings/pages/sighting-detail-page.tsx`
- `app/features/sightings/components/animal-detection-badge.tsx`
- `app/features/sightings/components/sighting-map.tsx`
- `app/features/sightings/hooks/use-visibility.ts`
- `app/features/sightings/hooks/use-delete-sighting.ts`

---

### 3.7 Phase 7: 홈페이지 업데이트 (1일) ✅ 완료

**우선순위: 중**

#### 구현 항목
1. ✅ 홈페이지 디자인 (Hero Section)
2. ✅ Features Section (AI 인식, 커뮤니티, 데이터 축적)
3. ✅ 최근 목격 정보 섹션
4. ✅ CTA Section
5. ✅ 네비게이션 메뉴 수정 (등록하기 버튼 추가)

#### 구현 파일
- ✅ `app/common/pages/home-page.tsx` - 전면 재구성
- ✅ `app/common/components/navigation.tsx` - 등록하기 버튼 추가

---

### 3.8 Phase 8: 프로젝트 정리 ✅ 완료

**우선순위: 필수**

#### 삭제된 파일
- ✅ `app/features/pictures/` - 전체 삭제
- ✅ `app/features/map/` - 전체 삭제 (추후 재구현 예정)
- ✅ `app/features/users/layouts/dashboard-layout.tsx`
- ✅ `app/features/users/layouts/messages-layout.tsx`
- ✅ `app/features/users/pages/dashboard*.tsx`
- ✅ `app/features/users/pages/message*.tsx`
- ✅ `app/features/users/pages/notifications-page.tsx`
- ✅ `app/features/auth/layouts/` - 전체 삭제
- ✅ `app/features/auth/pages/otp*.tsx`
- ✅ `app/features/auth/pages/social*.tsx`

---

### 3.9 Phase 9: 향후 구현 예정 기능

**우선순위: 낮음**

#### 지도 기능
1. ⏳ 전체 Sighting 지도 표시
2. ⏳ 마커 클릭 시 상세 정보
3. ⏳ Leaflet 또는 Kakao Map 연동

#### 목격 정보 수정 기능
1. ⏳ PATCH API 백엔드 구현
2. ⏳ 수정 폼 UI
3. ⏳ 권한 체크 (본인만 수정 가능)

#### 추가 기능
1. ⏳ 목격 정보 검색
2. ⏳ 필터링 (동물 종류, 날짜, 위치)
3. ⏳ 좋아요/북마크
4. ⏳ 댓글 기능

---

## 📝 4단계: 제거할 파일 목록 ✅ 완료

### 완전 삭제 완료
```
✅ app/features/pictures/          # 전체 삭제
✅ app/features/map/              # 전체 삭제 (추후 재구현)
✅ app/features/users/layouts/dashboard-layout.tsx
✅ app/features/users/layouts/messages-layout.tsx
✅ app/features/users/pages/dashboard-*.tsx
✅ app/features/users/pages/message*.tsx
✅ app/features/users/pages/notifications-page.tsx
✅ app/features/auth/layouts/auth-layout.tsx
✅ app/features/auth/pages/otp-*.tsx
✅ app/features/auth/pages/social-*.tsx
```

---

## ✅ 5단계: 테스트 및 검증

### 5.1 기능 테스트 체크리스트

#### 인증
- [ ] 회원가입 정상 동작
- [ ] 이메일 중복 확인 동작
- [ ] 로그인 성공 시 JWT 쿠키 저장
- [ ] 로그아웃 시 쿠키 삭제
- [ ] 인증 필요 페이지 접근 제어

#### 사용자
- [ ] 내 프로필 조회
- [ ] 프로필 수정 (displayName, avatarUrl)
- [ ] 사용자 목록 조회 (페이지네이션)
- [ ] 사용자 검색 (email, displayName)

#### Sighting
- [ ] 공개 미디어 목록 조회
- [ ] 내 미디어 목록 조회
- [ ] Sighting 생성 (이미지 업로드)
- [ ] AI 동물 인식 결과 표시
- [ ] 공개/비공개 변경
- [ ] Sighting 삭제

#### AI
- [ ] 이미지 업로드 시 동물 인식
- [ ] Bounding Box 표시
- [ ] 학명으로 동물 상세 정보 조회
- [ ] 동물 정보 모달 표시

### 5.2 브라우저 테스트
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari (Mac)

### 5.3 반응형 테스트
- [ ] 모바일 (< 640px)
- [ ] 태블릿 (640px ~ 1024px)
- [ ] 데스크톱 (> 1024px)

---

## 📊 6단계: 구현 현황

| Phase | 작업 내용 | 예상 기간 | 실제 소요 | 상태 |
|-------|----------|----------|----------|------|
| Phase 1 | 인증 시스템 | 1-2일 | - | ✅ 완료 |
| Phase 2 | 사용자 프로필 | 1일 | - | ✅ 완료 |
| Phase 3 | 미디어 목록 | 1-2일 | - | ✅ 완료 |
| Phase 4 | AI 동물 인식 | 2일 | - | ✅ 완료 |
| Phase 5 | Sighting 생성 | 2-3일 | - | ✅ 완료 |
| Phase 6 | Sighting 상세 | 1-2일 | - | ✅ 완료 |
| Phase 7 | 홈페이지 업데이트 | 1일 | - | ✅ 완료 |
| Phase 8 | 프로젝트 정리 | 0.5일 | - | ✅ 완료 |
| **총계** | **핵심 기능 완료** | **10-15일** | - | ✅ |

### 구현 완료된 주요 기능
1. ✅ JWT 쿠키 기반 인증 (로그인, 회원가입, 로그아웃)
2. ✅ 사용자 프로필 관리
3. ✅ 목격 정보 목록 조회 (공개/내 목격 정보)
4. ✅ AI 동물 인식 자동 실행
5. ✅ 사진 업로드 시 자동 목격 정보 생성
6. ✅ 목격 정보 상세 페이지
7. ✅ 반응형 홈페이지 (Hero, Features, 최근 목격 정보)
8. ✅ 네비게이션 (데스크톱/모바일)

---

## 🎨 7단계: UI/UX 가이드라인

### 7.1 디자인 컨셉
- **테마**: 자연, 동물 보호
- **컬러**: 녹색 계열 (친환경), 파란색 (신뢰)
- **폰트**: Inter (본문), Nanum Brush Script (헤딩)

### 7.2 주요 컴포넌트 스타일

#### Sighting Card
```
┌─────────────────────┐
│   [이미지]          │
├─────────────────────┤
│ 제목               │
│ 탐지: 🦊 여우      │
│ 위치: 서울         │
│ 날짜: 2025-01-15   │
└─────────────────────┘
```

#### Animal Detection Badge
```
[🦊 여우 (Vulpes vulpes) - 95%]
```

### 7.3 반응형 그리드
- 모바일: 1열
- 태블릿: 2열
- 데스크톱: 3-4열

---

## 🔒 8단계: 보안 고려사항

### 8.1 쿠키 보안
- HttpOnly 쿠키로 JWT 전달 (백엔드에서 설정)
- `withCredentials: true` 설정 필수

### 8.2 XSS 방지
- 사용자 입력 데이터 sanitize
- `dangerouslySetInnerHTML` 사용 지양

### 8.3 CSRF 방지
- CSRF 토큰 필요 시 백엔드와 협의

### 8.4 파일 업로드 검증
- 클라이언트: 파일 타입, 크기 검증
- 백엔드: 추가 검증 (백엔드에서 처리)

---

## 📚 9단계: 참고 자료

### API 문서
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

### 기술 문서
- React Router v7: https://reactrouter.com/
- Axios: https://axios-http.com/
- React Query: https://tanstack.com/query/
- Tailwind CSS: https://tailwindcss.com/
- Radix UI: https://www.radix-ui.com/

---

## 🚀 10단계: 다음 액션

### 즉시 시작 가능한 작업
1. ✅ 환경 변수 설정 (`.env.local`)
2. ✅ 의존성 설치 (`axios`, `@tanstack/react-query`)
3. ✅ API 클라이언트 설정 (`app/lib/api/client.ts`)
4. ✅ 타입 정의 (`app/lib/types/*.ts`)
5. ✅ Phase 1 시작: 인증 시스템 구현

### 질문 사항
- [ ] 디자인 시안이 있나요?
- [ ] 지도 라이브러리 선호도? (Leaflet vs Kakao Map)
- [ ] 상태 관리 라이브러리? (Context API vs Zustand vs Jotai)
- [ ] 이미지 저장소? (백엔드에서 처리하는지 확인)

---

**작성일**: 2025-01-XX
**작성자**: Claude Code
**버전**: 1.0.0
