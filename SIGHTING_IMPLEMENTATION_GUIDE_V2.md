# Sighting 기능 구현 가이드 v2.0

> **작성일**: 2025-10-03
> **프로젝트**: Shutter Heroes Frontend
> **백엔드 서버**: http://localhost:8080
> **Swagger 문서**: http://localhost:8080/swagger-ui/index.html
> **버전**: 2.0 (지도 기능 우선순위 상향)

---

## 📋 목차

1. [프로젝트 현황 요약](#프로젝트-현황-요약)
2. [우선순위 재조정](#우선순위-재조정)
3. [구현 완료된 기능](#구현-완료된-기능)
4. [구현 필요한 기능 (우선순위순)](#구현-필요한-기능-우선순위순)
5. [단계별 구현 가이드](#단계별-구현-가이드)
6. [주의사항 및 버그 수정](#주의사항-및-버그-수정)

---

## 프로젝트 현황 요약

### 전체 구현 진행률: **약 70%**

| 카테고리 | 구현 상태 | 우선순위 | 비고 |
|---------|----------|---------|------|
| 인증 시스템 | ✅ 완료 | - | 로그인, 회원가입, 로그아웃 |
| 사용자 프로필 | ✅ 완료 | - | 내 프로필, 사용자 목록 |
| 미디어 목록 조회 | ✅ 완료 | - | 공개/내 미디어 목록 |
| AI 동물 인식 | ✅ 완료 | - | 이미지 업로드 시 자동 인식 |
| Sighting 생성 | ✅ 완료 | - | 이미지 업로드 + AI 인식 |
| Sighting 상세 | ✅ 완료 | - | 상세 페이지 조회 |
| Sighting 수정 | ✅ 완료 | - | 제목, 설명, 공개여부 수정 |
| Sighting 삭제 | ✅ 완료 | - | 본인 목격 정보 삭제 |
| **버그 수정** | ⚠️ **필수** | 🔴 **최우선** | 이미지 URL, 중복 제출 |
| **Sighting 목록 조회** | ⚠️ **미완성** | 🔴 **최우선** | API 있지만 UI 미연동 |
| **지도 기능** | ❌ 미구현 | 🔴 **최우선** | 필수 기능 |
| **근처 목격 정보** | ❌ 미구현 | 🟡 **높음** | 지도 기능 완료 후 |
| **Sighting 검색** | ❌ 미구현 | 🟡 **높음** | 백엔드 API 있음 |
| **동물 상세 정보** | ❌ 미구현 | 🟢 **중간** | AI API는 준비됨 |

---

## 우선순위 재조정

### 🔴 Phase 1: 즉시 작업 (1-2일) - **필수**

#### 1.1 버그 수정 (0.5일)
- ⚠️ 이미지 URL 불일치 수정
- ⚠️ Sighting 생성 시 중복 제출 버그 수정
- ⚠️ 타입 불일치 수정

#### 1.2 Sighting 목록 조회 (0.5일)
- ⚠️ 백엔드 Sighting API 연동
- ⚠️ 동물 이름, AI 신뢰도 등 추가 정보 표시
- ⚠️ 검색 UI 추가

#### 1.3 지도 기능 구현 (1일) - **핵심**
- ❌ Leaflet 설치 및 설정
- ❌ 기본 지도 컴포넌트
- ❌ Sighting 마커 표시
- ❌ 마커 클릭 시 상세 정보 팝업
- ❌ 지도 페이지 (`/sightings/map`)

### 🟡 Phase 2: 단기 작업 (2-3일)

#### 2.1 근처 목격 정보 조회 (1일)
- 사용자 위치 기반 검색
- 지도에 반경 표시
- 결과를 지도와 리스트로 동시 표시

#### 2.2 지도 고급 기능 (1-2일)
- 클러스터링 (많은 마커 그룹화)
- 필터링 (동물 종류, 날짜)
- 사용자 위치 추적
- 지도-리스트 연동

### 🟢 Phase 3: 중기 작업 (1-2일)

#### 3.1 동물 상세 정보 모달
- AI 생성 동물 정보 표시
- 보존 상태 강조

---

## 구현 완료된 기능

### ✅ 1. 인증 시스템
- 로그인, 회원가입, 로그아웃
- JWT 쿠키 기반 인증

### ✅ 2. 사용자 프로필
- 내 프로필, 사용자 목록

### ✅ 3. Sighting CRUD
- 생성, 조회, 수정, 삭제

### ✅ 4. AI 동물 인식
- 이미지 업로드 시 자동 인식

---

## 구현 필요한 기능 (우선순위순)

### 🔴 1. 버그 수정 (최우선, 0.5일)

**현재 문제점**:
1. 이미지 URL 불일치
2. Sighting 생성 시 중복 제출
3. 타입 불일치

**세부 내용**: [주의사항 및 버그 수정](#주의사항-및-버그-수정) 섹션 참조

---

### 🔴 2. Sighting 목록 조회 (최우선, 0.5일)

**현재 상태**: 미디어 목록만 표시, Sighting 목록 API는 사용하지 않음

**백엔드 API**: `GET /api/v1/sightings`

**Response**:
```json
{
  "content": [
    {
      "id": "uuid",
      "title": "붉은여우 목격",
      "commonNameKo": "붉은여우",
      "scientificName": "Vulpes vulpes",
      "aiConfidence": 0.95,
      "visibility": "public",
      "sanitizedUrl": "/api/v1/medias/{mediaId}/download",
      "createdAt": "2025-10-03T10:00:00"
    }
  ],
  "totalElements": 100,
  "totalPages": 5
}
```

**세부 내용**: [Step 1: Sighting 목록 조회](#step-1-sighting-목록-조회-최우선) 참조

---

### 🔴 3. 지도 기능 (최우선, 1일) - **핵심 기능**

**중요성**:
- 근처 목격 정보 조회의 선행 조건
- 프로젝트의 핵심 시각화 기능
- 사용자 경험의 핵심

**구현 내용**:
1. Leaflet 라이브러리 설치
2. 기본 지도 컴포넌트
3. Sighting 위치를 마커로 표시
4. 마커 클릭 시 Sighting 정보 팝업
5. 지도 페이지 라우트

**기술 스택**:
- **react-leaflet**: React 전용 Leaflet 래퍼
- **leaflet**: 오픈소스 지도 라이브러리
- **OpenStreetMap**: 무료 지도 타일

**세부 내용**: [Step 2: 지도 기능 구현](#step-2-지도-기능-구현-최우선) 참조

---

### 🟡 4. 근처 목격 정보 조회 (높음, 1일)

**선행 조건**: 지도 기능 완료

**백엔드 API**: `GET /api/v1/sightings/nearby`

**구현 내용**:
1. 사용자 위치 가져오기 (Geolocation API)
2. 반경 설정 UI
3. 지도에 반경 원 표시
4. 근처 목격 정보 마커 표시
5. 결과 리스트 표시

**세부 내용**: [Step 3: 근처 목격 정보](#step-3-근처-목격-정보-조회-높음) 참조

---

### 🟡 5. Sighting 검색 (높음, 0.5일)

**백엔드 API**: `GET /api/v1/sightings?keyword={keyword}`

**구현 내용**:
- 이미 Step 1에서 구현 예정 (Sighting 목록 조회에 포함)

---

### 🟢 6. 동물 상세 정보 모달 (중간, 1일)

**백엔드 API**: `POST /api/v1/ai/animal/description`

**세부 내용**: 기존 v1 문서 참조

---

## 단계별 구현 가이드

---

## Step 0: 버그 수정 (최우선, 30분)

### 목표
현재 코드의 치명적인 버그 3개를 수정합니다.

---

### 🐛 Bug 1: 이미지 URL 불일치

**문제**:
- `media-card.tsx`: `http://localhost:8080${media.storagePath}` 사용
- `sighting-detail-page.tsx`: `/api/v1/medias/${mediaId}/download` 사용
- 환경 변수를 사용하지 않아 배포 시 문제 발생

**해결**:

#### 파일: `app/features/sightings/components/media-card.tsx`

**수정 전**:
```typescript
const imageUrl = `http://localhost:8080${media.storagePath}`;
```

**수정 후**:
```typescript
const imageUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/medias/${media.mediaId}/download`;
```

#### 파일: `app/features/sightings/pages/sighting-detail-page.tsx`

**이미 올바름** (변경 불필요):
```typescript
const imageUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/medias/${sighting.media.mediaId}/download`;
```

---

### 🐛 Bug 2: Sighting 생성 시 중복 제출

**문제**:
`submit-sighting-page.tsx`에서:
1. `handleImageSelect()`에서 이미지 선택 시 즉시 Sighting 생성
2. `onSubmit()`에서 폼 제출 시 다시 Sighting 생성
3. **결과**: 같은 이미지가 두 번 업로드됨

**해결 방법**: 두 가지 방식 중 선택

#### 방식 A: 이미지 선택 시 즉시 생성 (현재 구현, 권장)

**파일**: `app/features/sightings/pages/submit-sighting-page.tsx`

**수정 전**: 현재 코드
```typescript
const handleImageSelect = async (file: File) => {
  setSelectedImage(file);
  setError(null);
  setDetections([]);
  setIsSubmitting(true);

  try {
    const sightingResult = await sightingsApi.create({ image: file });
    setDetections(sightingResult.detections || []);
    navigate(`/sightings/${sightingResult.sightingId}`);
  } catch (err: any) {
    // ...
  }
};

const onSubmit = async (data: SubmitFormData) => {
  // ... 중복된 생성 로직
};
```

**수정 후**: 제목/설명 입력 폼 제거, onSubmit 제거
```typescript
import { useState, useEffect } from 'react';
import { type MetaFunction, useNavigate } from 'react-router';
import { ImageUpload } from '~/features/ai/components/image-upload';
import { sightingsApi } from '~/lib/api/sightings.api';
import { Card, CardContent, CardHeader, CardTitle } from '~/common/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAuth } from '~/lib/hooks/use-auth';

export const meta: MetaFunction = () => {
  return [{ title: '목격 정보 등록 | 셔터 히어로즈' }];
};

export default function SubmitSightingPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth/login');
    }
  }, [isLoading, user, navigate]);

  const handleImageSelect = async (file: File) => {
    setSelectedImage(file);
    setError(null);
    setIsSubmitting(true);

    try {
      // 이미지 업로드와 동시에 Sighting 생성
      const sightingResult = await sightingsApi.create({
        image: file,
      });

      // 생성된 목격 정보 페이지로 이동
      navigate(`/sightings/${sightingResult.sightingId}`);
    } catch (err: any) {
      console.error('목격 정보 등록 에러:', err);
      setError(err.response?.data?.message || '목격 정보 등록에 실패했습니다');
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 py-8">
      <h1 className="text-3xl font-bold">동물 목격 정보 등록</h1>

      {/* 이미지 업로드 */}
      <Card>
        <CardHeader>
          <CardTitle>사진 업로드</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
            onClear={handleClear}
            disabled={isSubmitting}
          />
          <p className="text-sm text-gray-500 mt-2">
            사진을 선택하면 자동으로 AI가 동물을 인식하고 목격 정보가 생성됩니다.
            <br />
            제목과 설명은 나중에 수정할 수 있습니다.
          </p>
        </CardContent>
      </Card>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* 로딩 상태 */}
      {isSubmitting && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500 mr-2" />
          <span className="text-gray-600">목격 정보를 생성하는 중...</span>
        </div>
      )}
    </div>
  );
}
```

**ImageUpload 컴포넌트 수정 필요**:

파일: `app/features/ai/components/image-upload.tsx`

`disabled` prop 추가:
```typescript
interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
  disabled?: boolean; // 추가
}

export function ImageUpload({ onImageSelect, selectedImage, onClear, disabled }: ImageUploadProps) {
  // ... 기존 코드

  return (
    <div className="space-y-4">
      {!selectedImage ? (
        <div
          className={cn(
            "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          {/* ... */}
        </div>
      ) : (
        // ...
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled} // 추가
      />
    </div>
  );
}
```

---

### 🐛 Bug 3: 타입 불일치

**문제**:
- Sighting API 응답의 `detections`에는 `detectionId`가 있음
- `AnimalDetection` 타입에는 `detectionId`가 없음

**해결**:

#### 파일: `app/lib/types/sighting.types.ts`

**수정 전**:
```typescript
export interface AnimalDetection {
  scientificName: string;
  commonName: string | null;
  confidence: number;
  boundingBox: BoundingBox | null;
}
```

**수정 후**:
```typescript
export interface AnimalDetection {
  detectionId?: string; // 선택 사항으로 추가
  scientificName: string;
  commonName: string | null;
  confidence: number;
  boundingBox: BoundingBox | null;
}
```

---

## Step 1: Sighting 목록 조회 (최우선, 0.5일)

### 목표
- 현재 미디어 목록 API 대신 Sighting 목록 API 사용
- 동물 이름, AI 신뢰도 등 추가 정보 표시
- 검색 기능 추가

---

### 1.1 타입 정의

#### 파일: `app/lib/types/sighting.types.ts`

**추가할 타입**:
```typescript
// 기존 타입에 추가
export interface SightingListItem {
  id: string;
  title: string;
  description: string | null;
  occurredAt: string | null;
  detectedBy: string;
  aiConfidence: number | null;
  visibility: 'public' | 'private';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  displayName: string;
  commonNameKo: string | null;
  commonNameEn: string | null;
  scientificName: string | null;
  status: 'general' | 'endangered' | 'natural_monument' | null;
  sanitizedUrl: string;
  geom: string | null; // WKT 형식: "POINT(126.9784 37.5667)"
}

export interface SightingListResponse {
  content: SightingListItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface GetSightingsParams {
  page?: number;
  size?: number;
  sort?: string[];
  keyword?: string;
}
```

---

### 1.2 API 함수 추가

#### 파일: `app/lib/api/sightings.api.ts`

**추가할 메서드**:
```typescript
// 기존 imports에 추가
import type {
  // ... 기존 imports
  SightingListResponse,
  GetSightingsParams,
} from '../types/sighting.types';

export const sightingsApi = {
  // ... 기존 메서드들

  /**
   * Sighting 목록 조회 (페이지네이션, 검색)
   */
  getAll: async (params: GetSightingsParams = {}): Promise<SightingListResponse> => {
    return apiClient.get('/api/v1/sightings', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 20,
        sort: params.sort ?? ['createdAt,DESC'],
        keyword: params.keyword,
      },
    });
  },
};
```

---

### 1.3 커스텀 훅 생성

#### 파일: `app/features/sightings/hooks/use-all-sightings.ts` (새로 생성)

```typescript
import { useState, useCallback } from 'react';
import { sightingsApi } from '~/lib/api/sightings.api';
import type {
  SightingListResponse,
  GetSightingsParams
} from '~/lib/types/sighting.types';

export function useAllSightings() {
  const [sightings, setSightings] = useState<SightingListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSightings = useCallback(async (params: GetSightingsParams = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await sightingsApi.getAll(params);
      setSightings(response);
    } catch (err: any) {
      setError(err.response?.data?.message || '목격 정보 목록을 불러오는데 실패했습니다');
      console.error('목격 정보 목록 조회 에러:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { sightings, isLoading, error, fetchSightings };
}
```

---

### 1.4 Sighting 카드 컴포넌트 생성

#### 파일: `app/features/sightings/components/sighting-list-card.tsx` (새로 생성)

```typescript
import { Link } from 'react-router';
import { Card, CardContent } from '~/common/components/ui/card';
import { Badge } from '~/common/components/ui/badge';
import type { SightingListItem } from '~/lib/types/sighting.types';
import {
  CalendarIcon,
  EyeIcon,
  EyeOffIcon,
  SparklesIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  UserIcon,
} from 'lucide-react';

interface SightingListCardProps {
  sighting: SightingListItem;
}

export function SightingListCard({ sighting }: SightingListCardProps) {
  const imageUrl = `${import.meta.env.VITE_API_BASE_URL}${sighting.sanitizedUrl}`;
  const createdDate = new Date(sighting.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link to={`/sightings/${sighting.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={sighting.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* 상단 우측 배지들 */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            {/* 공개 여부 */}
            <Badge variant={sighting.visibility === 'public' ? 'default' : 'secondary'}>
              {sighting.visibility === 'public' ? (
                <><EyeIcon className="w-3 h-3 mr-1" /> 공개</>
              ) : (
                <><EyeOffIcon className="w-3 h-3 mr-1" /> 비공개</>
              )}
            </Badge>

            {/* 검증 상태 */}
            {sighting.isVerified && (
              <Badge variant="default" className="bg-green-600">
                <ShieldCheckIcon className="w-3 h-3 mr-1" /> 검증됨
              </Badge>
            )}
          </div>

          {/* 상단 좌측 보존 상태 배지 */}
          {sighting.status === 'endangered' && (
            <div className="absolute top-2 left-2">
              <Badge variant="destructive">
                <AlertTriangleIcon className="w-3 h-3 mr-1" /> 멸종위기
              </Badge>
            </div>
          )}
          {sighting.status === 'natural_monument' && (
            <div className="absolute top-2 left-2">
              <Badge variant="default" className="bg-amber-600">
                천연기념물
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-2">
          {/* 제목 */}
          <h3 className="font-semibold text-lg line-clamp-1">{sighting.title}</h3>

          {/* 동물 이름 */}
          {(sighting.commonNameKo || sighting.scientificName) && (
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                {sighting.commonNameKo && (
                  <span className="text-sm font-medium truncate">{sighting.commonNameKo}</span>
                )}
                {sighting.scientificName && (
                  <span className="text-xs text-gray-500 italic truncate">
                    {sighting.scientificName}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* AI 신뢰도 */}
          {sighting.aiConfidence !== null && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                AI 신뢰도: {Math.round(sighting.aiConfidence * 100)}%
              </Badge>
            </div>
          )}

          {/* 날짜 및 작성자 */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              <span className="text-xs">{createdDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <UserIcon className="w-3 h-3" />
              <span className="text-xs truncate">{sighting.displayName}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
```

---

### 1.5 Sightings 페이지 수정

#### 파일: `app/features/sightings/pages/sightings-page.tsx`

**완전히 교체**:
```typescript
import { useEffect, useState } from 'react';
import { type MetaFunction } from 'react-router';
import { useAllSightings } from '../hooks/use-all-sightings';
import { SightingListCard } from '../components/sighting-list-card';
import { Button } from '~/common/components/ui/button';
import { Input } from '~/common/components/ui/input';
import { SearchIcon, Loader2Icon, XIcon } from 'lucide-react';

export const meta: MetaFunction = () => {
  return [{ title: '동물 목격 정보 | 셔터 히어로즈' }];
};

export default function SightingsPage() {
  const { sightings, isLoading, error, fetchSightings } = useAllSightings();
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchSightings({ page: currentPage, size: 20, keyword: keyword || undefined });
  }, [currentPage, keyword, fetchSightings]);

  const handleSearch = () => {
    setKeyword(searchInput);
    setCurrentPage(0); // 검색 시 첫 페이지로 이동
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setKeyword('');
    setCurrentPage(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (isLoading && !sightings) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2Icon className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => fetchSightings({ page: 0, size: 20 })}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* 헤더 및 검색 */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">동물 목격 정보</h1>

        {/* 검색 바 */}
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Input
              type="text"
              placeholder="동물 이름으로 검색... (예: 붉은여우, Vulpes vulpes)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button onClick={handleSearch} disabled={isLoading}>
            <SearchIcon className="w-4 h-4 mr-2" />
            검색
          </Button>
        </div>
      </div>

      {/* 검색 결과 표시 */}
      {keyword && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-sm text-blue-800">
            "<span className="font-semibold">{keyword}</span>" 검색 결과: {sightings?.totalElements || 0}건
          </div>
          <Button variant="ghost" size="sm" onClick={handleClearSearch}>
            검색 초기화
          </Button>
        </div>
      )}

      {/* Sighting 목록 */}
      {sightings && sightings.content.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sightings.content.map((sighting) => (
              <SightingListCard key={sighting.id} sighting={sighting} />
            ))}
          </div>

          {/* 페이지네이션 */}
          {sightings.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={sightings.first || isLoading}
                variant="outline"
              >
                이전
              </Button>
              <div className="flex items-center gap-1 px-4">
                <span className="text-sm font-medium">{currentPage + 1}</span>
                <span className="text-sm text-gray-500">/ {sightings.totalPages}</span>
              </div>
              <Button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={sightings.last || isLoading}
                variant="outline"
              >
                다음
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {keyword ? '검색 결과가 없습니다.' : '등록된 목격 정보가 없습니다.'}
          </p>
          {keyword && (
            <Button variant="outline" onClick={handleClearSearch} className="mt-4">
              전체 목록 보기
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## Step 2: 지도 기능 구현 (최우선, 1일)

### 목표
- Leaflet 기반 지도 컴포넌트 구현
- Sighting 위치를 마커로 표시
- 마커 클릭 시 상세 정보 팝업
- 전체 지도 페이지 (`/sightings/map`)

---

### 2.0 사전 준비: 패키지 설치

#### 터미널 실행:
```bash
cd wemake
npm install leaflet react-leaflet
```

**참고**: `@types/leaflet`는 이미 설치되어 있음 (package.json 확인)

---

### 2.1 Leaflet CSS 추가

#### 파일: `app/root.tsx`

**head 섹션에 추가**:
```typescript
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
// ... 기존 imports

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* Leaflet CSS 추가 */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// ... 나머지 코드
```

---

### 2.2 지도 유틸리티 함수

#### 파일: `app/lib/utils/geo.utils.ts` (새로 생성)

```typescript
/**
 * WKT POINT 형식을 위도/경도로 변환
 * 예: "POINT(126.9784 37.5667)" -> { lat: 37.5667, lng: 126.9784 }
 */
export function parseWKTPoint(wkt: string | null): { lat: number; lng: number } | null {
  if (!wkt) return null;

  const match = wkt.match(/POINT\(([0-9.-]+)\s+([0-9.-]+)\)/);
  if (!match) return null;

  const lng = parseFloat(match[1]);
  const lat = parseFloat(match[2]);

  if (isNaN(lat) || isNaN(lng)) return null;

  return { lat, lng };
}

/**
 * 기본 지도 중심 (서울)
 */
export const DEFAULT_MAP_CENTER = { lat: 37.5665, lng: 126.978 };

/**
 * 기본 지도 줌 레벨
 */
export const DEFAULT_ZOOM = 13;
```

---

### 2.3 지도 컴포넌트

#### 파일: `app/features/map/components/sighting-map.tsx` (새로 생성)

```typescript
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { SightingListItem } from '~/lib/types/sighting.types';
import { parseWKTPoint, DEFAULT_MAP_CENTER, DEFAULT_ZOOM } from '~/lib/utils/geo.utils';

// Leaflet 기본 아이콘 수정 (빌드 시 아이콘 경로 문제 해결)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface SightingMapProps {
  sightings: SightingListItem[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onMarkerClick?: (sighting: SightingListItem) => void;
}

export function SightingMap({
  sightings,
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_ZOOM,
  height = '600px',
  onMarkerClick,
}: SightingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // 지도 초기화
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // 지도 생성
    const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom);

    // OpenStreetMap 타일 추가
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // 클린업
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center.lat, center.lng, zoom]);

  // 마커 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // 새 마커 추가
    const newMarkers: L.Marker[] = [];
    const bounds: L.LatLngBounds[] = [];

    sightings.forEach((sighting) => {
      const position = parseWKTPoint(sighting.geom);
      if (!position) return;

      const marker = L.marker([position.lat, position.lng]);

      // 팝업 내용
      const popupContent = `
        <div class="p-2 min-w-[200px]">
          <h3 class="font-semibold text-base mb-1">${sighting.title}</h3>
          ${
            sighting.commonNameKo
              ? `<p class="text-sm text-gray-700 mb-1">🦊 ${sighting.commonNameKo}</p>`
              : ''
          }
          ${
            sighting.aiConfidence
              ? `<p class="text-xs text-gray-500">AI 신뢰도: ${Math.round(sighting.aiConfidence * 100)}%</p>`
              : ''
          }
          <p class="text-xs text-gray-500 mt-1">by ${sighting.displayName}</p>
          <a
            href="/sightings/${sighting.id}"
            class="text-blue-600 hover:underline text-sm mt-2 inline-block"
          >
            상세 보기 →
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);

      // 클릭 이벤트
      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(sighting));
      }

      marker.addTo(mapInstanceRef.current!);
      newMarkers.push(marker);
      bounds.push(L.latLngBounds([position.lat, position.lng], [position.lat, position.lng]));
    });

    markersRef.current = newMarkers;

    // 모든 마커가 보이도록 지도 조정
    if (bounds.length > 0 && newMarkers.length > 1) {
      const group = L.featureGroup(newMarkers);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [sightings, onMarkerClick]);

  return <div ref={mapRef} style={{ height, width: '100%' }} className="rounded-lg shadow-md" />;
}
```

---

### 2.4 지도 페이지

#### 파일: `app/features/map/pages/map-page.tsx` (새로 생성)

```typescript
import { useEffect, useState } from 'react';
import { type MetaFunction, Link } from 'react-router';
import { SightingMap } from '../components/sighting-map';
import { useAllSightings } from '~/features/sightings/hooks/use-all-sightings';
import { Button } from '~/common/components/ui/button';
import { Input } from '~/common/components/ui/input';
import { Card, CardContent } from '~/common/components/ui/card';
import { Loader2Icon, SearchIcon, ListIcon, MapIcon, XIcon } from 'lucide-react';
import type { SightingListItem } from '~/lib/types/sighting.types';

export const meta: MetaFunction = () => {
  return [{ title: '지도 보기 | 셔터 히어로즈' }];
};

export default function MapPage() {
  const { sightings, isLoading, error, fetchSightings } = useAllSightings();
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedSighting, setSelectedSighting] = useState<SightingListItem | null>(null);

  useEffect(() => {
    // 지도에서는 모든 데이터를 한 번에 로드 (페이지네이션 없음)
    fetchSightings({ size: 1000, keyword: keyword || undefined });
  }, [keyword, fetchSightings]);

  const handleSearch = () => {
    setKeyword(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setKeyword('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 위치 정보가 있는 sighting만 필터링
  const sightingsWithLocation = sightings?.content.filter((s) => s.geom) || [];

  if (isLoading && !sightings) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[600px]">
          <Loader2Icon className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => fetchSightings({ size: 1000 })}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">지도로 보기</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/sightings">
              <ListIcon className="w-4 h-4 mr-2" />
              목록으로
            </Link>
          </Button>
        </div>
      </div>

      {/* 검색 바 */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Input
            type="text"
            placeholder="동물 이름으로 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pr-10"
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} disabled={isLoading}>
          <SearchIcon className="w-4 h-4 mr-2" />
          검색
        </Button>
      </div>

      {/* 통계 */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapIcon className="w-4 h-4" />
          <span>
            지도에 표시된 목격 정보: <strong>{sightingsWithLocation.length}</strong>건
          </span>
        </div>
        {keyword && (
          <div className="text-blue-600">
            "{keyword}" 검색 결과
          </div>
        )}
      </div>

      {/* 지도 */}
      {sightingsWithLocation.length > 0 ? (
        <SightingMap
          sightings={sightingsWithLocation}
          height="calc(100vh - 300px)"
          onMarkerClick={setSelectedSighting}
        />
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center min-h-[400px]">
            <p className="text-gray-500">
              {keyword ? '검색 결과가 없습니다.' : '위치 정보가 있는 목격 정보가 없습니다.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 선택된 Sighting 정보 (선택 사항) */}
      {selectedSighting && (
        <Card className="border-2 border-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{selectedSighting.title}</h3>
                {selectedSighting.commonNameKo && (
                  <p className="text-gray-700">{selectedSighting.commonNameKo}</p>
                )}
                {selectedSighting.aiConfidence && (
                  <p className="text-sm text-gray-500">
                    AI 신뢰도: {Math.round(selectedSighting.aiConfidence * 100)}%
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button asChild size="sm">
                  <Link to={`/sightings/${selectedSighting.id}`}>상세 보기</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedSighting(null)}>
                  닫기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

---

### 2.5 라우트 추가

#### 파일: `app/routes.ts`

**수정**:
```typescript
// /sightings prefix 내부에 추가
...prefix("/sightings", [
  index("features/sightings/pages/sightings-page.tsx"),
  route("/submit", "features/sightings/pages/submit-sighting-page.tsx"),
  route("/map", "features/map/pages/map-page.tsx"), // 추가
  route("/:sightingId", "features/sightings/pages/sighting-detail-page.tsx"),
  route("/:sightingId/edit", "features/sightings/pages/edit-sighting-page.tsx"),
]),
```

---

### 2.6 네비게이션에 지도 링크 추가

#### 파일: `app/common/components/navigation.tsx`

**네비게이션 메뉴에 추가**:
```typescript
// 기존 메뉴 항목들 사이에 추가
<NavigationMenuItem>
  <Link href="/sightings/map">
    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
      지도
    </NavigationMenuLink>
  </Link>
</NavigationMenuItem>
```

---

### 2.7 지도 컴포넌트 테스트

#### 테스트 체크리스트:
- [ ] 지도가 정상적으로 렌더링됨
- [ ] Sighting 마커가 올바른 위치에 표시됨
- [ ] 마커 클릭 시 팝업이 표시됨
- [ ] 팝업에서 "상세 보기" 클릭 시 상세 페이지로 이동
- [ ] 여러 마커가 있을 때 자동으로 범위 조정됨
- [ ] 검색 시 필터링된 마커만 표시됨

---

## Step 3: 근처 목격 정보 조회 (높음, 1일)

### 목표
- 사용자 위치 기반 근처 목격 정보 조회
- 지도에 반경 원 표시
- 결과를 지도와 리스트로 동시 표시

---

### 3.1 타입 정의

#### 파일: `app/lib/types/sighting.types.ts`

**추가**:
```typescript
export interface NearbyParams {
  lon?: number;
  lat?: number;
  radiusMeters?: number;
  centerId?: string;
}

export interface SightingAroundItem {
  id: string;
  displayName: string;
  commonNameKo: string | null;
  commonNameEn: string | null;
  scientificName: string | null;
  status: 'general' | 'endangered' | 'natural_monument' | null;
  storagePath: string;
  title: string;
  description: string | null;
  occurredAt: string | null;
  detectedBy: string;
  aiConfidence: number | null;
  visibility: 'public' | 'private';
  isVerified: boolean;
  geom: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

### 3.2 API 함수 추가

#### 파일: `app/lib/api/sightings.api.ts`

**추가**:
```typescript
import type {
  // ... 기존 imports
  NearbyParams,
  SightingAroundItem
} from '../types/sighting.types';

export const sightingsApi = {
  // ... 기존 메서드들

  /**
   * 근처 목격 정보 조회
   */
  getNearby: async (params: NearbyParams): Promise<SightingAroundItem[]> => {
    return apiClient.get('/api/v1/sightings/nearby', {
      params: {
        lon: params.lon,
        lat: params.lat,
        radiusMeters: params.radiusMeters ?? 500,
        centerId: params.centerId,
      },
    });
  },
};
```

---

### 3.3 커스텀 훅

#### 파일: `app/features/sightings/hooks/use-nearby-sightings.ts` (새로 생성)

```typescript
import { useState, useCallback } from 'react';
import { sightingsApi } from '~/lib/api/sightings.api';
import type { SightingAroundItem, NearbyParams } from '~/lib/types/sighting.types';

export function useNearbySightings() {
  const [sightings, setSightings] = useState<SightingAroundItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNearby = useCallback(async (params: NearbyParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await sightingsApi.getNearby(params);
      setSightings(response);
    } catch (err: any) {
      setError(err.response?.data?.message || '근처 목격 정보를 불러오는데 실패했습니다');
      console.error('근처 목격 정보 조회 에러:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { sightings, isLoading, error, fetchNearby };
}
```

---

### 3.4 반경 표시 지도 컴포넌트

#### 파일: `app/features/map/components/nearby-sighting-map.tsx` (새로 생성)

```typescript
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { SightingAroundItem } from '~/lib/types/sighting.types';
import { parseWKTPoint } from '~/lib/utils/geo.utils';

// Leaflet 기본 아이콘 수정
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface NearbySightingMapProps {
  sightings: SightingAroundItem[];
  center: { lat: number; lng: number };
  radiusMeters: number;
  height?: string;
}

export function NearbySightingMap({
  sightings,
  center,
  radiusMeters,
  height = '600px',
}: NearbySightingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const circleRef = useRef<L.Circle | null>(null);

  // 지도 초기화
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([center.lat, center.lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center.lat, center.lng]);

  // 반경 원 및 마커 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // 기존 원 제거
    if (circleRef.current) {
      circleRef.current.remove();
    }

    // 반경 원 추가
    const circle = L.circle([center.lat, center.lng], {
      radius: radiusMeters,
      color: 'blue',
      fillColor: '#3b82f6',
      fillOpacity: 0.1,
      weight: 2,
    }).addTo(mapInstanceRef.current);

    circleRef.current = circle;

    // 중심 마커 (사용자 위치)
    const centerMarker = L.marker([center.lat, center.lng], {
      icon: L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    })
      .bindPopup('<div class="text-sm font-semibold">📍 현재 위치</div>')
      .addTo(mapInstanceRef.current);

    markersRef.current.push(centerMarker);

    // Sighting 마커 추가
    sightings.forEach((sighting) => {
      const position = parseWKTPoint(sighting.geom);
      if (!position) return;

      const marker = L.marker([position.lat, position.lng]);

      const popupContent = `
        <div class="p-2 min-w-[200px]">
          <h3 class="font-semibold text-base mb-1">${sighting.title}</h3>
          ${
            sighting.commonNameKo
              ? `<p class="text-sm text-gray-700 mb-1">🦊 ${sighting.commonNameKo}</p>`
              : ''
          }
          ${
            sighting.aiConfidence
              ? `<p class="text-xs text-gray-500">AI 신뢰도: ${Math.round(sighting.aiConfidence * 100)}%</p>`
              : ''
          }
          <p class="text-xs text-gray-500 mt-1">by ${sighting.displayName}</p>
          <a
            href="/sightings/${sighting.id}"
            class="text-blue-600 hover:underline text-sm mt-2 inline-block"
          >
            상세 보기 →
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(mapInstanceRef.current!);
      markersRef.current.push(marker);
    });

    // 지도 범위 조정 (원이 전부 보이도록)
    mapInstanceRef.current.fitBounds(circle.getBounds());
  }, [sightings, center, radiusMeters]);

  return <div ref={mapRef} style={{ height, width: '100%' }} className="rounded-lg shadow-md" />;
}
```

---

### 3.5 근처 목격 정보 페이지

#### 파일: `app/features/sightings/pages/nearby-sightings-page.tsx` (새로 생성)

```typescript
import { useState } from 'react';
import { type MetaFunction, Link } from 'react-router';
import { useNearbySightings } from '../hooks/use-nearby-sightings';
import { NearbySightingMap } from '~/features/map/components/nearby-sighting-map';
import { SightingListCard } from '../components/sighting-list-card';
import { Button } from '~/common/components/ui/button';
import { Input } from '~/common/components/ui/input';
import { Label } from '~/common/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '~/common/components/ui/card';
import { MapPinIcon, Loader2Icon, ArrowLeftIcon } from 'lucide-react';
import { DEFAULT_MAP_CENTER } from '~/lib/utils/geo.utils';

export const meta: MetaFunction = () => {
  return [{ title: '근처 목격 정보 | 셔터 히어로즈' }];
};

export default function NearbySightingsPage() {
  const { sightings, isLoading, error, fetchNearby } = useNearbySightings();
  const [lat, setLat] = useState<string>('');
  const [lon, setLon] = useState<string>('');
  const [radius, setRadius] = useState<string>('500');
  const [searchedCenter, setSearchedCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('이 브라우저는 위치 정보를 지원하지 않습니다.');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLat = position.coords.latitude;
        const newLon = position.coords.longitude;
        setLat(newLat.toString());
        setLon(newLon.toString());
        setIsGettingLocation(false);
      },
      (error) => {
        alert('위치 정보를 가져올 수 없습니다: ' + error.message);
        setIsGettingLocation(false);
      }
    );
  };

  const handleSearch = () => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    const radiusNum = parseInt(radius);

    if (isNaN(latNum) || isNaN(lonNum)) {
      alert('위도와 경도를 올바르게 입력해주세요.');
      return;
    }

    if (isNaN(radiusNum) || radiusNum < 1) {
      alert('반경을 올바르게 입력해주세요. (최소 1m)');
      return;
    }

    setSearchedCenter({ lat: latNum, lng: lonNum });
    fetchNearby({
      lat: latNum,
      lon: lonNum,
      radiusMeters: radiusNum,
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">근처 목격 정보</h1>
        <Button variant="outline" asChild>
          <Link to="/sightings">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            목록으로
          </Link>
        </Button>
      </div>

      {/* 검색 폼 */}
      <Card>
        <CardHeader>
          <CardTitle>위치 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">위도 (Latitude)</Label>
              <Input
                id="lat"
                type="number"
                step="0.000001"
                placeholder="37.5667"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lon">경도 (Longitude)</Label>
              <Input
                id="lon"
                type="number"
                step="0.000001"
                placeholder="126.9784"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="radius">반경 (미터)</Label>
              <Input
                id="radius"
                type="number"
                placeholder="500"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGetCurrentLocation}
              variant="outline"
              disabled={isGettingLocation}
            >
              {isGettingLocation ? (
                <>
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  위치 확인 중...
                </>
              ) : (
                <>
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  현재 위치 사용
                </>
              )}
            </Button>
            <Button onClick={handleSearch} disabled={isLoading || !lat || !lon}>
              {isLoading ? (
                <>
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  검색 중...
                </>
              ) : (
                '검색'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 에러 */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* 결과 */}
      {searchedCenter && !isLoading && (
        <>
          {/* 통계 */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              반경 <strong>{radius}m</strong> 내 <strong>{sightings.length}</strong>건 발견
            </span>
          </div>

          {/* 지도 */}
          {sightings.length > 0 && (
            <NearbySightingMap
              sightings={sightings}
              center={searchedCenter}
              radiusMeters={parseInt(radius)}
              height="500px"
            />
          )}

          {/* 리스트 */}
          {sightings.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">목록</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sightings.map((sighting) => (
                  <SightingListCard
                    key={sighting.id}
                    sighting={sighting as any} // 타입 변환
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">근처에 목격 정보가 없습니다.</p>
            </div>
          )}
        </>
      )}

      {/* 초기 상태 */}
      {!searchedCenter && !isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-2">
              <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-gray-500">위치를 설정하고 검색 버튼을 눌러주세요.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

---

### 3.6 라우트 추가

#### 파일: `app/routes.ts`

```typescript
...prefix("/sightings", [
  index("features/sightings/pages/sightings-page.tsx"),
  route("/submit", "features/sightings/pages/submit-sighting-page.tsx"),
  route("/map", "features/map/pages/map-page.tsx"),
  route("/nearby", "features/sightings/pages/nearby-sightings-page.tsx"), // 추가
  route("/:sightingId", "features/sightings/pages/sighting-detail-page.tsx"),
  route("/:sightingId/edit", "features/sightings/pages/edit-sighting-page.tsx"),
]),
```

---

## 주의사항 및 버그 수정

### ⚠️ 1. 환경 변수 설정

**필수 환경 변수** (`.env.local`):
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=10000
```

**확인**:
```bash
cd wemake
cat .env.local
```

**없으면 생성**:
```bash
echo "VITE_API_BASE_URL=http://localhost:8080" > .env.local
echo "VITE_API_TIMEOUT=10000" >> .env.local
```

---

### ⚠️ 2. Leaflet CSS 로딩 확인

**문제**: Leaflet CSS가 로드되지 않으면 지도가 깨져 보임

**확인**:
1. 브라우저 개발자 도구 → Network 탭
2. `leaflet.css` 파일이 200 OK로 로드되는지 확인
3. 안 되면 `app/root.tsx`의 `<link>` 태그 확인

---

### ⚠️ 3. CORS 이슈

**백엔드 CORS 설정 확인**:
```java
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
```

---

### ⚠️ 4. GPS 데이터 없는 Sighting 처리

**문제**: 일부 Sighting에는 `geom` (GPS 위치) 데이터가 없을 수 있음

**해결**: 지도 컴포넌트에서 자동으로 필터링
```typescript
const sightingsWithLocation = sightings?.content.filter((s) => s.geom) || [];
```

---

## 구현 순서 요약

### 🔴 즉시 작업 (1일)
1. ✅ **Bug 수정** (0.5시간)
   - 이미지 URL 통일
   - 중복 제출 버그 수정
   - 타입 불일치 수정

2. ✅ **Sighting 목록 조회** (3시간)
   - API 연동
   - 카드 컴포넌트
   - 검색 UI

3. ✅ **지도 기능** (4시간)
   - Leaflet 설치
   - 지도 컴포넌트
   - 지도 페이지
   - 라우트 추가

### 🟡 단기 작업 (1일)
4. ✅ **근처 목격 정보** (1일)
   - 위치 기반 검색
   - 반경 표시
   - 지도 + 리스트 뷰

### 🟢 중기 작업 (1일)
5. ⏳ 동물 상세 정보 모달 (이전 v1 문서 참조)

---

## 테스트 체크리스트

### 지도 기능
- [ ] 지도가 정상적으로 렌더링됨
- [ ] Sighting 마커가 올바른 위치에 표시됨
- [ ] 마커 클릭 시 팝업 표시
- [ ] 팝업에서 상세 페이지로 이동
- [ ] 검색 시 필터링됨

### 근처 목격 정보
- [ ] 현재 위치 가져오기 동작
- [ ] 반경 원이 지도에 표시됨
- [ ] 반경 내 Sighting만 표시됨
- [ ] 지도와 리스트 동기화

---

**문서 작성 완료**
**작성자**: Claude Code
**버전**: 2.0
