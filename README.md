# Shutter Heroes Frontend

> AI 기반 야생동물 관찰 및 공유 플랫폼

Shutter Heroes는 사용자가 야생동물 사진을 업로드하면 AI가 자동으로 종을 식별하고, 관찰 기록을 지도 기반으로 공유할 수 있는 현대적인 웹 애플리케이션입니다.

## 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [개발](#개발)
- [배포](#배포)
- [환경 변수](#환경-변수)
- [API 통합](#api-통합)
- [라이선스](#라이선스)

## 주요 기능

### 🤖 AI 기반 동물 식별
- 사진 업로드 시 AI가 자동으로 야생동물 종 식별
- 신뢰도 점수 및 전문가 검증 상태 표시
- 한글/영문 이름, 학명, 보전 상태 등 상세 정보 제공

### 🗺️ 인터랙티브 지도
- Leaflet 기반의 직관적인 지도 인터페이스
- 위치 기반 관찰 기록 검색 (반경 200m ~ 150km)
- 현재 위치 기반 자동 검색 지원
- 마커 클릭 시 관찰 정보 팝업 표시

### 📸 관찰 기록 관리
- 야생동물 관찰 기록 등록/수정/삭제
- 공개/비공개 설정으로 프라이버시 관리
- 이미지 드래그 앤 드롭 업로드 (최대 10MB)
- EXIF 데이터 추출 및 개인정보 자동 제거

### 👥 커뮤니티
- 사용자 프로필 및 관찰 기록 공유
- 사용자 디렉토리 및 검색 기능
- 개인별 관찰 통계 및 갤러리
- 공개 관찰 기록 탐색

### 🔐 인증
- Kakao OAuth2 소셜 로그인
- JWT 기반 세션 관리
- 사용자 프로필 및 설정 관리

## 기술 스택

### Frontend Framework
- **React 19.1.0** - 최신 UI 프레임워크
- **React Router 7.7.1** - 서버 사이드 렌더링(SSR) 지원
- **TypeScript 5.8.3** - 타입 안정성

### Build & Development
- **Vite 6.3.3** - 초고속 번들러
- **Tailwind CSS 4.1.13** - 유틸리티 우선 CSS 프레임워크
- **React Router Dev** - HMR이 적용된 개발 서버

### UI Components
- **shadcn/ui** - Radix UI 기반의 헤드리스 컴포넌트
- **Lucide React 0.544.0** - 모던 아이콘 라이브러리
- **Motion 12.23.22** - 애니메이션 라이브러리

### Data & API
- **TanStack React Query 5.90.2** - 서버 상태 관리
- **Axios 1.12.2** - HTTP 클라이언트
- **Zod 4.1.11** - 스키마 검증

### Maps & Geolocation
- **Leaflet 1.9.4** - 인터랙티브 지도
- **React Leaflet 5.0.0** - React용 Leaflet 래퍼

### Form Management
- **React Hook Form 7.63.0** - 고성능 폼 관리
- **@hookform/resolvers 5.2.2** - Zod 통합

### Database & Backend Integration
- **Drizzle ORM 0.44.5** - 타입 안전 ORM
- **PostgreSQL 3.4.7** - 데이터베이스 드라이버
- **Supabase Client 2.57.4** - BaaS 통합

### DevOps
- **Docker** - 컨테이너화
- **Docker Compose** - 멀티 컨테이너 오케스트레이션
- **Nginx** - 리버스 프록시 및 정적 파일 서빙

## 프로젝트 구조

```
shutter_heroes_fe/
├── wemake/                          # 메인 애플리케이션
│   ├── app/                         # 소스 코드
│   │   ├── common/                  # 공통 컴포넌트 및 페이지
│   │   │   ├── components/
│   │   │   │   ├── ui/             # shadcn/ui 컴포넌트 (25+개)
│   │   │   │   ├── navigation.tsx  # 네비게이션
│   │   │   │   └── hero.tsx
│   │   │   └── pages/
│   │   │       └── home-page.tsx   # 랜딩 페이지
│   │   │
│   │   ├── features/                # 기능별 모듈
│   │   │   ├── auth/               # 인증 (로그인/회원가입)
│   │   │   ├── sightings/          # 관찰 기록 관리
│   │   │   ├── map/                # 지도 기능
│   │   │   ├── users/              # 사용자 프로필
│   │   │   ├── picture-submit/     # 사진 업로드
│   │   │   └── ai/                 # AI 관련 기능
│   │   │
│   │   ├── lib/                    # 핵심 유틸리티
│   │   │   ├── api/               # API 클라이언트 (6개 파일)
│   │   │   ├── types/             # TypeScript 타입 정의
│   │   │   ├── utils/             # 유틸리티 함수
│   │   │   └── hooks/             # 전역 훅 (useAuth 등)
│   │   │
│   │   ├── routes/                # 라우트 정의
│   │   ├── root.tsx               # 루트 레이아웃
│   │   └── routes.ts              # 라우트 설정
│   │
│   ├── public/                     # 정적 자산
│   ├── nginx/                      # Nginx 설정
│   ├── Dockerfile                  # 프로덕션 빌드
│   ├── Dockerfile-dev              # 개발 환경
│   ├── docker-compose.yml          # 로컬 개발
│   ├── docker-compose.prd.yml      # 프로덕션
│   └── package.json                # 의존성
│
├── DEPLOYMENT.md                   # 배포 가이드
└── README.md                        # 프로젝트 문서
```

### 기능별 모듈 구조

각 기능 모듈은 다음과 같은 구조를 따릅니다:

```
features/[feature]/
├── pages/              # 페이지 컴포넌트
├── components/         # 기능별 컴포넌트
├── hooks/             # 커스텀 훅
├── schema.ts          # Zod 검증 스키마
└── types.ts           # 타입 정의
```

## 시작하기

### 사전 요구사항

- Node.js 20 이상
- npm 또는 yarn
- Docker & Docker Compose (선택사항)

### 설치

```bash
# 리포지토리 클론
git clone https://github.com/ShutterHeroes/shutter_heroes_fe.git
cd shutter_heroes_fe/wemake

# 의존성 설치
npm install
```

### 환경 변수 설정

`.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=10000
```

## 개발

### 개발 서버 실행

```bash
npm run dev
```

애플리케이션이 `http://localhost:5173`에서 실행됩니다.

### 타입 체크

```bash
npm run typecheck
```

### 데이터베이스 관리

```bash
# 마이그레이션 생성
npm run db:generate

# 마이그레이션 실행
npm run db:migrate

# Drizzle Studio UI 실행
npm run db:studio

# Supabase 타입 생성
npm run db:typegen
```

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `build/` 디렉토리에 생성됩니다:
- `build/client/` - 정적 자산
- `build/server/` - 서버 사이드 코드

### 프로덕션 서버 실행

```bash
npm run start
```

## 배포

### Docker를 사용한 로컬 전체 스택 실행

```bash
# 전체 스택 실행 (Frontend, Backend, PostgreSQL, Nginx)
docker-compose up

# 백그라운드 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down
```

### AWS ECR + EC2 프로덕션 배포

상세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참조하세요.

**배포 프로세스 요약:**

1. **Docker 이미지 빌드**
   ```bash
   cd wemake
   docker build \
     --build-arg VITE_API_BASE_URL=https://your-api.com \
     --build-arg VITE_API_TIMEOUT=10000 \
     -t shutter-heroes-fe .
   ```

2. **AWS ECR에 푸시**
   ```bash
   aws ecr get-login-password --region ap-northeast-2 | \
   docker login --username AWS --password-stdin \
   <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com

   docker push <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com/shutter-heroes-fe:latest
   ```

3. **EC2에서 실행**
   ```bash
   docker pull <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com/shutter-heroes-fe:latest
   docker-compose -f docker-compose.prd.yml up -d
   ```

### 지원 플랫폼

Docker 이미지는 다음 플랫폼에 배포 가능합니다:
- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

## 환경 변수

### 필수 환경 변수

| 변수명 | 설명 | 기본값 | 예시 |
|--------|------|--------|------|
| `VITE_API_BASE_URL` | 백엔드 API 엔드포인트 | - | `http://localhost:8080` |
| `VITE_API_TIMEOUT` | API 요청 타임아웃 (ms) | `10000` | `15000` |
| `NODE_ENV` | 실행 환경 | `development` | `production` |

### 빌드 시 주입

Docker 빌드 시 `--build-arg`로 환경 변수를 주입할 수 있습니다:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api.shutterheroes.com \
  --build-arg VITE_API_TIMEOUT=10000 \
  -t shutter-heroes-fe .
```

## API 통합

### API 클라이언트 구조

프로젝트는 Axios 기반의 모듈화된 API 레이어를 사용합니다:

```typescript
app/lib/api/
├── client.ts            # Axios 인스턴스 설정 (JWT 쿠키 지원)
├── auth.api.ts          # 인증 API
├── sightings.api.ts     # 관찰 기록 CRUD
├── users.api.ts         # 사용자 프로필
├── media.api.ts         # 미디어 관리
└── ai.api.ts            # AI 관련 API
```

### 주요 엔드포인트

```
POST   /api/v1/users/register         # 회원가입
POST   /api/v1/users/login            # 로그인 (Kakao OAuth)
POST   /api/v1/users/logout           # 로그아웃
GET    /api/v1/users/me               # 현재 사용자 정보

POST   /api/v1/sightings              # 관찰 기록 생성
GET    /api/v1/sightings              # 관찰 기록 목록 (페이지네이션)
GET    /api/v1/sightings/:id          # 관찰 기록 상세
PATCH  /api/v1/sightings/:id          # 관찰 기록 수정
DELETE /api/v1/sightings/:id          # 관찰 기록 삭제
GET    /api/v1/sightings/nearby       # 근처 관찰 기록 검색

GET    /api/v1/medias/browse          # 공개 미디어 목록
GET    /api/v1/medias/my              # 내 미디어 목록
PATCH  /api/v1/media/:id/visibility   # 공개/비공개 전환
DELETE /api/v1/media/:id              # 미디어 삭제
```

### TanStack Query 사용 예시

```typescript
import { useQuery } from '@tanstack/react-query';
import { getSightings } from '~/lib/api/sightings.api';

function SightingsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['sightings', { page: 1, limit: 10 }],
    queryFn: () => getSightings({ page: 1, limit: 10 }),
  });

  // ...
}
```

## 주요 기능 구현

### 1. AI 기반 동물 식별

```typescript
// app/features/sightings/pages/submit-sighting-page.tsx
import { ImageUpload } from '~/features/ai/components/image-upload';

// 이미지 업로드 → AI 자동 식별 → 관찰 기록 생성
```

### 2. 지도 기반 검색

```typescript
// app/features/map/pages/map-page.tsx
import { SightingMap } from '~/features/map/components/sighting-map';

// 현재 위치 기반 또는 수동 위치 선택
// 반경 설정 (200m ~ 150km)
// 마커 클릭 시 상세 정보 팝업
```

### 3. 인증 플로우

```typescript
// app/lib/hooks/use-auth.tsx
import { useAuth } from '~/lib/hooks/use-auth';

function ProtectedPage() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // ...
}
```

## 아키텍처 패턴

### 1. Feature-Based Organization
비즈니스 도메인별로 코드를 구성 (auth, sightings, map, users)

### 2. Separation of Concerns
명확한 레이어 분리 (UI 컴포넌트, 훅, API, 타입, 유틸리티)

### 3. Custom Hooks
재사용 가능한 로직 추상화 (useAuth, useMyProfile, useSightings)

### 4. Type Safety
Zod 스키마 검증, TypeScript strict 모드

### 5. SSR-Ready
서버 사이드 렌더링으로 SEO 및 초기 로딩 성능 향상

### 6. Context API
전역 인증 상태 관리 (AuthProvider/useAuth)

## 성능 최적화

- **Code Splitting**: Vite를 통한 자동 청크 분할
- **SSR**: 서버 사이드 렌더링으로 빠른 초기 로딩
- **Image Optimization**: 이미지 크기 제한 및 최적화
- **TanStack Query**: 효율적인 데이터 캐싱 및 동기화
- **Lazy Loading**: React.lazy()를 통한 컴포넌트 지연 로딩

## 보안

- **JWT 쿠키 인증**: HttpOnly 쿠키로 XSS 방지
- **CORS 설정**: 백엔드에서 허용된 오리진만 접근
- **환경 변수 관리**: 민감 정보는 환경 변수로 관리
- **입력 검증**: Zod 스키마로 클라이언트/서버 양쪽 검증
- **HTTPS**: Let's Encrypt를 통한 SSL 인증서

## 브라우저 지원

- Chrome (최신 2개 버전)
- Firefox (최신 2개 버전)
- Safari (최신 2개 버전)
- Edge (최신 2개 버전)

## 트러블슈팅

### 개발 서버가 시작되지 않을 때

```bash
# 포트 확인
lsof -i :5173

# 캐시 삭제 후 재시작
rm -rf node_modules/.vite
npm run dev
```

### 타입 에러 발생 시

```bash
# React Router 타입 재생성
npm run typecheck
```

### Docker 빌드 실패 시

```bash
# 캐시 없이 빌드
docker build --no-cache -t shutter-heroes-fe .
```

## 기여하기

1. 이슈를 먼저 확인하거나 생성하세요
2. Feature 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 팀

Shutter Heroes Team

## 관련 링크

- [백엔드 리포지토리](https://github.com/ShutterHeroes/shutter_heroes_be)
- [배포 가이드](./DEPLOYMENT.md)
- [API 문서](./api-docs.json)

---

Built with ❤️ using React Router
