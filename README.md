# Codiit E-Commerce Backend

> 전자상거래 플랫폼 백엔드 - 실무 수준 아키텍처와 확장 가능한 설계
> 실제 운영을 가정한 무중단 배포 · 실시간 알림 · 결제 트랜잭션을 포함한 백엔드

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.2.1-black?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17.6-336791?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.0-2D3748?logo=prisma)](https://www.prisma.io/)
[![CI](https://github.com/nb04-part4-team2/nb04-codiit-team2/actions/workflows/ci.yml/badge.svg)](https://github.com/nb04-part4-team2/nb04-codiit-team2/actions/workflows/ci.yml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 링크

- **Frontend**: https://www.stayme.kr
- **Backend API**: https://api.stayme.kr
- **Health Check**: https://api.stayme.kr/api/health
- **📚 API 문서 (Swagger)**: https://api.stayme.kr/api/swagger

---

## ⭐ 한눈에 보는 프로젝트

- 📦 **전자상거래 백엔드** - 13개 도메인, 51개 API
- 🚀 **무중단 배포** - AWS Blue-Green 배포 + Graceful Shutdown
- 🔐 **인증/인가** - JWT 이중 토큰 + 결제 트랜잭션 + SSE 실시간 알림
- 🧪 **테스트 전략** - Unit/Integration 완전 분리, Docker 기반 테스트 DB
- 🧱 **확장 가능한 구조** - Container Pattern (DI) 기반 도메인 독립 구성

---

## 프로젝트 개요

13개 도메인으로 구성된 전자상거래 백엔드 시스템으로
상품·주문·결제·알림·통계를 실제 서비스 수준으로 구현했습니다.

**주요 기능**
판매자 스토어 관리, 상품 등록/주문/결제, 실시간 알림(SSE), 대시보드 통계 제공.

### 핵심 특징

- **무중단 배포**: AWS Blue-Green 배포 + Graceful Shutdown + ALB 타겟 그룹 전환
- **도메인 주도 설계**: 12개 독립 모듈 + Container Pattern (DI) + 레이어드 아키텍처
- **타입 안전성**: TypeScript + Zod 런타임 검증 + 3분할 tsconfig 구조
- **테스트 격리**: Unit/Integration 완전 분리 + Docker 기반 테스트 DB 격리
- **Rate Limiting**: Global 1000/15분, Auth 로그인 5회/15분, GitHub Secrets 관리
- **환경별 로깅**: Development (morgan) / Production (pino-http + CloudWatch) / Test (silent)

---

## 목차

- [✨ 주요 기능](#주요-기능)
- [🛠️ 기술 스택](#기술-스택)
- [🏗️ 아키텍처](#아키텍처)
- [🗄️ 데이터베이스 ERD](#데이터베이스-erd)
- [📋 API 문서](#api-문서)
- [🧪 테스트 전략](#테스트-전략)
- [🎯 기술적 도전 과제](#기술적-도전-과제)
- [🚀 배포 & CI/CD](#배포)
- [⚡ 빠른 시작 (3분)](#빠른-시작-3분)
- [📁 프로젝트 구조](#프로젝트-구조)
- [⚙️ 환경 변수](#환경-변수)
- [📋 주요 명령어](#주요-명령어)
- [🔄 개발 프로세스](#개발-프로세스)
- [🔧 트러블슈팅](#트러블슈팅)
- [📚 문서](#문서)
- [👥 팀원](#팀원)
- [🤝 기여 가이드](#기여-가이드)
- [📄 라이선스](#라이선스)
- [📞 문의](#문의)

---

## 빠른 시작 (3분)

> 💡 **처음 실행하는 분들을 위한 최소 설정 가이드**

### 최소 요구사항
- Node.js 22.x
- PostgreSQL 17.x

### 로컬 실행

```bash
# 1. 클론
git clone https://github.com/nb04-part4-team2/nb04-codiit-team2.git
cd nb04-codiit-team2

# 2. 패키지 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env

# JWT Secret 자동 생성 (필수)
echo "ACCESS_TOKEN_SECRET=$(openssl rand -hex 32)" >> .env
echo "REFRESH_TOKEN_SECRET=$(openssl rand -hex 32)" >> .env

# .env 파일에서 DATABASE_URL 설정 (필수)

# 4. Prisma 설정
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# 5. 서버 실행
npm run dev
# → http://localhost:3000
```

### 동작 확인
```bash
curl http://localhost:3000/api/health
# ✅ {"status":"ok","uptime":123,"environment":"development"}
```

**다음 단계:**
- 🔧 환경 변수 상세 설명은 [환경 변수](#환경-변수) 참고
- 📚 API 사용법은 [Swagger 문서](https://api.stayme.kr/api/swagger) 참고

---

## 주요 기능

### 핵심 비즈니스 로직

- **사용자 관리**: 구매자/판매자 역할 분리, 등급별 차등 적립률 (최대 10%)
- **스토어 & 상품**: 스토어 즐겨찾기, 상품 할인 설정, 사이즈별 재고 관리
- **주문 & 결제**: 장바구니, 포인트 사용/적립, 주문 취소 시 자동 환불
- **소통 & 피드백**: 상품 문의/답변, 리뷰 작성, 실시간 SSE 알림
- **데이터 분석**: 판매자 대시보드 (일별 매출, 주문 통계, 리뷰 평점)

### 기술 하이라이트

- **Container Pattern (DI)**: 13개 도메인 독립 구성, 테스트 용이성 확보
- **실시간 알림**: SSE 기반 브라우저 푸시, Graceful Shutdown 지원
- **무중단 배포**: AWS 블루-그린 배포, 타겟 그룹 전환
- **타입 안전성**: TypeScript + Zod 런타임 검증, 3분할 tsconfig 구조
- **Rate Limiting**: Global 1000/15분, Auth 로그인 5회/15분, GitHub Secrets 관리

> 📋 전체 51개 API 명세는 [API 문서](#api-문서) 섹션 참고

---

## 기술 스택

### Core
- **Node.js** 22.x
- **TypeScript** 5.9
- **Express.js** 5.2.1

### Database
- **PostgreSQL** 17.6
- **Prisma ORM** 6.19.0

### Authentication
- **JWT** (Access Token + Refresh Token)
- **bcrypt** (비밀번호 해싱)

### Code Quality
- **ESLint** (코드 품질)
- **Prettier** (코드 포맷팅)
- **Husky** (Git Hooks)
- **lint-staged** (Pre-commit 검사 - Prisma, TypeScript)

### Testing
- **Jest** (Unit/Integration 테스트)
- **Supertest** (API 테스트)
- **Docker** (테스트 DB 격리)

### Development Tools
- **tsx** (TypeScript 실행)
- **Pino** (프로덕션 로깅)
- **Morgan** (개발 환경 HTTP 로깅)
- **Swagger** (API 문서화)

### Infrastructure
- **AWS EC2** (Blue-Green 배포)
- **AWS ALB** (Application Load Balancer)
- **AWS RDS** (PostgreSQL)
- **AWS S3** (이미지 업로드)
- **GitHub Actions** (CI/CD)

---

## 아키텍처

### 아키텍처 설계 (Application Layer)

본 프로젝트는 **계층형 아키텍처**와 **Container Pattern (DI)**을 결합합니다.

**요청 흐름:**

```
┌───────────────────────────────────────────┐
│           Client (HTTP)                   │
└─────────────────┬─────────────────────────┘
                  │
                  ▼
┌───────────────────────────────────────────┐
│        Routes (라우터)                      │
│  • API 엔드포인트 매핑                        │
│  • 미들웨어 체인 구성                          │
└─────────────────┬─────────────────────────┘
                  │
                  ▼
┌───────────────────────────────────────────┐
│      Middlewares (미들웨어)                 │
│  • validate: Zod 스키마 검증                 │
│  • authenticate: JWT 검증 (Bearer)         │
│  • authorize: 권한 확인 (SELLER/BUYER)      │
└─────────────────┬─────────────────────────┘
                  │
                  ▼
┌───────────────────────────────────────────┐
│     Controllers (컨트롤러)                  │
│  • HTTP 요청/응답 처리                       │
│  • req.body/query/params 추출              │
│  • Service 메서드 호출                       │
└─────────────────┬─────────────────────────┘
                  │
                  ▼
┌───────────────────────────────────────────┐
│       Services (서비스)                     │
│  • 비즈니스 로직 구현                          │
│  • 트랜잭션 관리 (Prisma.$transaction)        │
│  • Repository 호출                         │
└─────────────────┬─────────────────────────┘
                  │
                  ▼
┌───────────────────────────────────────────┐
│   Repositories (리포지토리)                  │
│  • Prisma Client 쿼리                      │
│  • CRUD 연산 (create, findMany 등)          │
│  • tx?: TransactionClient 지원             │
└─────────────────┬─────────────────────────┘
                  │
                  ▼
┌───────────────────────────────────────────┐
│     Database (PostgreSQL 17)              │
└───────────────────────────────────────────┘
```

**에러 처리 순서 (중요!):**

```
Error 발생
  ↓
1️⃣ prismaErrorHandler      (DB 제약 조건)
  ↓
2️⃣ zodErrorHandler         (검증 실패)
  ↓
3️⃣ uploadErrorHandler      (Multer 에러)
  ↓
4️⃣ businessErrorHandler    (커스텀 에러: 400/401/403/404)
  ↓
5️⃣ catchAllErrorHandler    (예상 못한 에러 → 500)
```

**Container Pattern (의존성 주입):**

```typescript
// {domain}.container.ts
const repository = new Repository(prisma);
const service = new Service(repository);
export const controller = new Controller(service);
```

각 도메인은 독립적으로 구성되며, **상위 계층이 하위 계층을 주입**받습니다.

**계층별 책임:**

| 계층 | 역할 | 예시 |
|------|------|------|
| **Routes** | 엔드포인트 매핑, 미들웨어 체인 | `POST /api/products` → `authenticate` → `onlySeller` → `validate` → `controller.create` |
| **Middlewares** | 공통 관심사 처리 | JWT 검증, Zod 스키마 검증, 권한 확인 |
| **Controllers** | HTTP 계층 격리 | `req.body` 추출 → `service.create(dto)` → `res.json(result)` |
| **Services** | 비즈니스 로직 집중 | 가격 계산, 재고 검증, 트랜잭션 관리 |
| **Repositories** | 데이터 접근 추상화 | `prisma.product.create()`, `findMany({ where })` |

**설계 원칙:**

- ✅ **단일 책임**: Controller는 HTTP만, Service는 비즈니스 로직만
- ✅ **의존성 역전**: Repository를 mock으로 교체 가능 (테스트 용이)
- ✅ **명시적 의존성**: Container에서 모든 의존성 주입
- ✅ **트랜잭션 격리**: Service 계층에서 `prisma.$transaction()` 관리

**미들웨어 체인 순서 (라우터 레벨):**

```typescript
router.post('/products',
  authenticate,                // 1️⃣ 인증
  onlySeller,                  // 2️⃣ 인가
  validate(schema, 'body'),    // 3️⃣ 검증
  asyncHandler(controller.create) // 4️⃣ 핸들러
);
```

---

### 인프라 아키텍처 (AWS Blue-Green Deployment)

```
                     인터넷
                       │
                       ▼
        ┌──────────────────────────┐
        │ Application Load Balancer │
        │   (Internet-facing)       │
        │   Port 80 (HTTP)          │
        │   Port 443 (HTTPS)        │
        └───────┬──────────┬────────┘
                │          │
    ┌───────────▼─────┐  ┌▼──────────────┐
    │   Blue EC2      │  │  Green EC2    │
    │  (운영 또는 대기)  │  │  (운영 또는 대기) │
    │  t3.micro       │  │  t3.micro     │
    └───────┬─────────┘  └───┬───────────┘
            │                │
            │   ┌────────────┤
            │   │   Nginx (80)
            │   │   ↓
            │   │   Docker (3000)
            │   │   ↓
            │   │   Node.js App
            │   │
            └───┴─────────┐
                          ▼
                ┌──────────────────┐
                │  RDS PostgreSQL  │
                │  (Private Subnet)│
                │  db.t4g.micro    │
                └──────────────────┘

┌──────────────┐      ┌──────────────┐
│     ECR      │      │   S3 Bucket  │
│ Docker 이미지  │      │ codiit-images│
│  codiit-app  │      │  (이미지)      │
└──────────────┘      └──────────────┘

         ▲
         │
    ┌────┴────┐
    │ GitHub  │
    │ Actions │
    └─────────┘
```

**트래픽 흐름**:
```
사용자 → ALB (80/443) → Nginx (80) → Docker (3000) → Node.js App → RDS (5432)
                                                                ↓
                                                           S3 (이미지)
```

**배포 흐름**:
```
GitHub Actions → ECR (이미지 push) → SSH → EC2 (동적 IP 조회) → Docker 배포
```

**블루-그린 배포 상세 흐름**:
```
1. Green 운영 중 (v1.0)
   ↓
2. Blue에 새 버전 배포 (v1.1)
   ↓
3. Blue 인스턴스 Health Check 통과
   ↓
4. ALB 타겟 그룹 전환 (Green → Blue)
   ↓
5. Graceful Shutdown으로 Green 안전 종료
   ↓
6. Blue가 새로운 Green이 됨
```

**장점**:
- 무중단 배포 (Zero Downtime)
- 롤백 용이 (타겟 그룹만 전환)
- Health Check 실패 시 자동 차단

---

## 프로젝트 구조

```plaintext
codiit/
├── src/
│   ├── app.ts                    # Express 설정
│   ├── server.ts                 # HTTP 서버 + Graceful Shutdown
│   ├── config/                   # 환경 설정 (constants, logger, prisma)
│   ├── domains/                  # 13개 도메인
│   ├── documentation/            # Swagger API 문서
│   └── common/                   # 공통 모듈 (middlewares, utils)
├── __tests__/                    # 테스트 (unit/integration)
├── prisma/                       # 스키마 + 마이그레이션
└── .github/workflows/            # CI/CD
```

**도메인 모듈 구조 (Container Pattern):**
```plaintext
{domain}/
├── {domain}.container.ts         # DI 컨테이너
├── {domain}.router.ts            # 라우트 정의
├── {domain}.controller.ts        # HTTP 핸들러
├── {domain}.service.ts           # 비즈니스 로직
├── {domain}.repository.ts        # DB 접근
├── {domain}.mapper.ts            # Entity ↔ DTO 변환
├── {domain}.schema.ts            # Zod 검증
└── {domain}.type.ts              # TypeScript 타입
```

---

## 데이터베이스 ERD

> 실제 커머스 요구사항 기준으로 설계된 ERD (19개 테이블, 포트원 결제 연동)

### 핵심 엔티티 관계도

```mermaid
erDiagram
    %% User & Auth
    User ||--o{ RefreshToken : has
    User ||--|| Grade : "belongs to"
    User ||--o| Store : owns
    User ||--o| Cart : has
    User ||--o{ Order : places
    User ||--o{ Review : writes
    User ||--o{ Inquiry : creates
    User ||--o{ Reply : answers
    User ||--o{ StoreLike : likes
    User ||--o{ Notification : receives
    User ||--o{ PointHistory : has

    %% Store & Product
    Store ||--o{ Product : sells
    Store ||--o{ StoreLike : "liked by"

    Product ||--|| Category : "belongs to"
    Product ||--o{ Stock : has
    Product ||--o{ CartItem : in
    Product ||--o{ OrderItem : ordered
    Product ||--o{ Review : reviewed
    Product ||--o{ Inquiry : inquired

    %% Size
    Size ||--o{ Stock : "used in"
    Size ||--o{ CartItem : "used in"
    Size ||--o{ OrderItem : "used in"

    %% Cart
    Cart ||--o{ CartItem : contains

    %% Order & Payment
    Order ||--o{ OrderItem : contains
    Order ||--o{ Payment : "paid by"
    Order ||--o{ PointHistory : "related to"

    %% Review
    OrderItem ||--o| Review : "reviewed by"

    %% Inquiry
    Inquiry ||--o| Reply : "answered by"

    User {
        string id PK
        string email UK
        string password
        string name
        UserType type
        string image
        int point
        datetime createdAt
        datetime updatedAt
        string gradeId FK
    }

    RefreshToken {
        string id PK
        string token UK
        string jti UK
        string userId FK
        datetime expiresAt
        datetime createdAt
    }

    Grade {
        string id PK
        string name
        int minAmount
        float rate
        datetime createdAt
        datetime updatedAt
    }

    Store {
        string id PK
        string name
        string content
        string address
        string detailAddress
        string phoneNumber
        string image
        datetime createdAt
        datetime updatedAt
        string userId FK,UK
    }

    Product {
        string id PK
        string name
        int price
        string content
        string image
        int discountRate
        datetime discountStartTime
        datetime discountEndTime
        boolean isSoldOut
        int salesCount
        int reviewsCount
        float reviewsRating
        datetime createdAt
        datetime updatedAt
        string storeId FK
        string categoryId FK
    }

    Category {
        string id PK
        string name UK
    }

    Stock {
        string id PK
        int quantity
        int reservedQuantity
        string productId FK
        int sizeId FK
    }

    Size {
        int id PK
        string en
        string ko
    }

    Cart {
        string id PK
        int quantity
        datetime createdAt
        datetime updatedAt
        string buyerId FK,UK
    }

    CartItem {
        string id PK
        int quantity
        datetime createdAt
        datetime updatedAt
        string cartId FK
        string productId FK
        int sizeId FK
    }

    Order {
        string id PK
        string name
        string phoneNumber
        string address
        OrderStatus status
        int subtotal
        int totalQuantity
        int usePoint
        datetime createdAt
        datetime expiresAt
        string buyerId FK
    }

    OrderItem {
        string id PK
        int price
        int quantity
        string orderId FK
        string productId FK
        int sizeId FK
    }

    Payment {
        string id PK
        int price
        PaymentStatus status
        PaymentProvider provider
        PaymentMethod method
        string impUid UK
        string pgTid
        string errorCode
        string errorMessage
        datetime approvedAt
        datetime failedAt
        datetime createdAt
        datetime updatedAt
        string orderId FK
    }

    Review {
        string id PK
        int rating
        string content
        datetime createdAt
        datetime updatedAt
        string userId FK
        string productId FK
        string orderItemId FK,UK
    }

    Inquiry {
        string id PK
        string title
        string content
        InquiryStatus status
        boolean isSecret
        datetime createdAt
        datetime updatedAt
        string userId FK
        string productId FK
    }

    Reply {
        string id PK
        string content
        datetime createdAt
        datetime updatedAt
        string userId FK
        string inquiryId FK,UK
    }

    StoreLike {
        string id PK
        datetime createdAt
        string userId FK
        string storeId FK
    }

    PointHistory {
        string id PK
        PointHistoryType type
        int amount
        datetime createdAt
        string userId FK
        string orderId FK
    }

    Notification {
        string id PK
        string content
        boolean isChecked
        datetime createdAt
        datetime updatedAt
        string userId FK
    }
```

### Enum 타입

**UserType (유저 타입)**
- `BUYER`: 구매자
- `SELLER`: 판매자

**InquiryStatus (문의 상태)**
- `WaitingAnswer`: 답변 대기
- `CompletedAnswer`: 답변 완료

**PaymentStatus (결제 상태)**
- `processing`: 주문 트랜잭션 처리 중
- `pending`: PG 결제 요청됨
- `paid`: 결제 완료
- `failed`: 결제 실패
- `cancelled`: 결제 취소 / 환불
- `completed`: 결제 완료 후 주문 트랜잭션 성공

**PaymentProvider (결제 제공자)**
- `kakaopay`: 카카오페이
- `naverpay`: 네이버페이
- `tosspay`: 토스페이

**PaymentMethod (결제 수단)**
- `card`: 카드
- `point`: 포인트
- `kakaopay`: 카카오페이
- `naverpay`: 네이버페이
- `tosspay`: 토스페이

**OrderStatus (주문 상태)**
- `WaitingPayment`: 결제 대기
- `CompletedPayment`: 결제 완료
- `Cancelled`: 주문 취소
- `Delivered`: 배송 완료

**PointHistoryType (포인트 내역 타입)**
- `USE`: 사용
- `EARN`: 적립
- `EARN_CANCEL`: 적립 취소
- `REFUND`: 환불

---

## API 문서

### 📚 Swagger UI (권장)

**Live API 문서**: https://api.stayme.kr/api/swagger

> ⭐ **모든 API를 Swagger에서 직접 테스트할 수 있습니다!**

Swagger UI에서 다음 기능을 제공합니다:
- 전체 51개 엔드포인트 명세
- 요청/응답 스키마 (Zod 검증)
- Try it out 기능 (실제 API 호출)
- 인증 토큰 자동 포함

---

### 주요 도메인 (13개)

| 도메인 | 핵심 기능 | 엔드포인트 수 |
|--------|----------|---------------|
| 🔐 **Auth** | 로그인, 회원가입, 토큰 갱신 | 3개 |
| 👤 **User** | 프로필, 주소, 좋아요 관리 | 5개 |
| 🏪 **Store** | 스토어 CRUD, 좋아요 | 7개 |
| 🛍️ **Product** | 상품 CRUD, 검색, 필터링 | 5개 |
| 🛒 **Cart** | 장바구니 추가/수정/삭제 | 5개 |
| 📦 **Order** | 주문 생성, 조회, 취소 | 5개 |
| 💳 **Payment** | 결제 생성, 웹훅 처리 | 2개 |
| 💬 **Inquiry** | 문의 작성, 답변 | 8개 |
| ⭐ **Review** | 리뷰 CRUD, 통계 | 5개 |
| 🔔 **Notification** | SSE 실시간 알림 | 3개 |
| 📊 **Dashboard** | 판매 통계 (판매자) | 1개 |
| 🏷️ **Metadata** | 등급 정책 조회 | 1개 |
| 📁 **S3** | 이미지 업로드 | 1개 |

**총 51개 엔드포인트**

---

### 샘플 API 호출

```bash
# Health Check
curl https://api.stayme.kr/api/health

# 등급 정책 조회
curl https://api.stayme.kr/api/metadata/grade
```

**전체 API 테스트:** [Swagger UI](https://api.stayme.kr/api/swagger) - 인증 API 테스트 편리

---

### 인증 방식

**JWT 기반 이중 토큰:**
- **Access Token**: 15분 만료, API 요청에 사용
- **Refresh Token**: 7일 만료, Access Token 갱신에 사용

**사용 방법:**
1. `/api/auth/login`으로 로그인 → Access Token + Refresh Token 발급
2. API 요청 시 `Authorization: Bearer <ACCESS_TOKEN>` 헤더 포함
3. Access Token 만료 시 `/api/auth/refresh`로 갱신

**Swagger에서 인증:**
1. Swagger UI 우측 상단 "Authorize" 클릭
2. Access Token 입력
3. 이후 모든 요청에 자동 포함

---

## 테스트 전략

### 테스트 구조

**테스트 격리 전략**
- **Unit Test**: Service/Repository 계층 단위 테스트 (의존성 Mock)
- **Integration Test**: 실제 PostgreSQL + Docker 환경에서 E2E 테스트
- **테스트 환경 완전 격리**: `.env.test` (Git 관리) + `.env.test.local` (로컬 전용)

**테스트 실행**
```bash
# Unit 테스트 (빠름, Mock 사용)
npm test

# Integration 테스트 (Docker DB 필요)
npm run test:db:up        # 테스트 DB 시작
npm run test:integration  # 통합 테스트 실행
npm run test:db:down      # 테스트 DB 정리

# 전체 테스트
npm run test:all

# Watch 모드
npm run test:watch

# 커버리지 리포트
npm run test:cov
```

**테스트 DB 관리**
```bash
npm run test:db:up       # PostgreSQL 테스트 DB 시작 (Docker)
npm run test:db:down     # 테스트 DB 종료
npm run test:db:reset    # DB 초기화 + 마이그레이션
```

### CI 환경 테스트

**GitHub Actions CI Pipeline**
1. **Lint & Type Check** - Prisma, ESLint, Prettier, TypeScript
2. **Unit Tests** - Jest (mocked dependencies)
3. **Integration Tests** - Docker PostgreSQL + 실제 DB 쿼리
4. **Build** - TypeScript 컴파일 검증

**환경 변수 처리**
- CI 환경: `.env.test`의 더미 AWS 자격증명 사용
- S3 Integration Test: Mock 처리로 실제 API 호출 없음
- Rate Limit: 테스트 환경에서 자동으로 999999로 설정

---

## 환경 변수

### 필수 환경 변수

| 변수 | 설명 | 예시 |
|------|------|------|
| `DATABASE_URL` | PostgreSQL 연결 문자열 | `postgresql://user:pass@localhost:5432/codiit` |
| `ACCESS_TOKEN_SECRET` | JWT Access Token 비밀키 | 최소 32자 랜덤 문자열 |
| `REFRESH_TOKEN_SECRET` | JWT Refresh Token 비밀키 | 최소 32자 랜덤 문자열 |
| `AWS_REGION` | AWS 리전 | `ap-northeast-2` |
| `AWS_S3_BUCKET` | S3 버킷 이름 | `codiit-images` |
| `AWS_ACCESS_KEY_ID` | AWS Access Key | IAM에서 생성 |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key | IAM에서 생성 |

### 선택 환경 변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `PORT` | `3000` | 서버 포트 |
| `NODE_ENV` | `development` | 환경 (development/production/test) |
| `CORS_ORIGIN` | `http://localhost:5173` | CORS 허용 출처 |
| `BCRYPT_ROUNDS` | `10` | bcrypt salt rounds |
| `ACCESS_TOKEN_EXPIRES_IN` | `15m` | Access Token 만료 시간 |
| `REFRESH_TOKEN_EXPIRES_IN` | `7d` | Refresh Token 만료 시간 |

⚠️ **주의:** `.env` 파일은 절대 Git에 커밋하지 마세요!

**중요**: 앱 시작 시 Zod가 모든 환경변수를 검증합니다. 누락 시 즉시 종료됩니다.

---

## 주요 명령어

### 개발

```bash
npm run dev              # 개발 서버 (tsx watch)
npm run build            # 프로덕션 빌드 (tsc + tsc-alias)
npm start                # 빌드된 파일 실행
```

### 테스트

```bash
npm test                 # 유닛 테스트
npm run test:integration # 통합 테스트 (Docker DB 필요)
npm run test:all         # 전체 테스트
npm run test:watch       # Watch 모드
npm run test:cov         # 커버리지 리포트

# 테스트 DB 관리 (Docker)
npm run test:db:up       # 테스트 DB 시작
npm run test:db:down     # 테스트 DB 종료
npm run test:db:reset    # DB 초기화
```

**테스트 환경 변수:**
- `.env.test` - Git 관리됨 (로컬/CI 일관성 보장, 더미 AWS 값 포함)
- `.env.test.local` - Git 제외 (실제 AWS 키 등 민감 정보 작성 시 덮어씀)

### 코드 품질

```bash
npm run lint             # ESLint 검사
npm run lint:fix         # ESLint 자동 수정
npm run format           # Prettier 검사
npm run format:fix       # Prettier 자동 수정
npm run typecheck        # TypeScript 타입 체크 (src)
npm run typecheck:all    # TypeScript 타입 체크 (전체)
npm run check            # lint + format 검사
npm run fix              # lint:fix + format:fix
```

### Prisma

```bash
npx prisma validate      # 스키마 검증 (문법, 관계 체크)
npx prisma format        # 스키마 자동 포맷팅
npx prisma generate      # Client 재생성
npx prisma migrate dev   # 마이그레이션 생성 및 적용
npx prisma db push       # 스키마 동기화 (마이그레이션 없이)
npx prisma db seed       # 시드 데이터 주입
npx prisma migrate reset # 데이터베이스 초기화 (마이그레이션 재적용 + 시드)
npx prisma studio        # Prisma Studio GUI
```

---

## 기술적 도전 과제

### 1. Graceful Shutdown

**배경**: 블루-그린 배포 시 무중단 서비스를 위한 필수 기능

**구현**:
- SSE 연결 종료 → HTTP 서버 종료 → Prisma 연결 해제 순서
- 정상 종료 (SIGTERM/SIGINT): 30초 타임아웃
- 비정상 종료 (uncaughtException): 10초 타임아웃

**효과**: 컨테이너 종료 시 진행 중인 요청 완료 보장

```typescript
// src/server.ts
process.on('SIGTERM', async () => {
  await closeAllSSE();     // 1. SSE 연결 종료
  await server.close();    // 2. HTTP 서버 종료
  await prisma.$disconnect(); // 3. DB 연결 해제
});
```

---

### 2. CI 안정화

**배경**: PR #82에서 unit-test CI 실패. 로컬에서는 통과하나 CI에서 실패

**원인**: `constants.ts`가 import 시점에 환경변수 검증 → CI unit-test job에 env 미설정

**해결**:
- `.github/workflows/ci.yml` unit-test job에 더미 환경변수 추가
- Integration test와 환경변수 격리

**효과**: 로컬/CI 환경 차이로 인한 테스트 실패 제거

---

### 3. TypeScript 3분할 구조

**배경**:
- 테스트 파일 타입체크가 CI에서 누락
- IDE에서 jest 전역 타입이 src에 노출되는 문제

**구현**:
- `tsconfig.json` - IDE 공통 설정
- `tsconfig.build.json` - 빌드 전용 (src만)
- `tsconfig.test.json` - 테스트 타입 체크 전용 (__tests__ + src)

**효과**:
- src에서 jest 전역 타입 노출 방지
- 테스트 코드 작성 유연성 확보
- CI에서 전체 타입 체크 포함

---

### 4. 환경별 HTTP 로거 분기

**배경**: 개발 환경에서 pino-http JSON 로그가 가독성이 떨어짐

**구현**:
- **Development**: `morgan('dev')` - 간결한 컬러 로그
- **Production**: `pino-http` - 구조화된 JSON (CloudWatch 연동)
- **Test**: 로거 없음 - 깔끔한 테스트 출력

**효과**: 개발자 경험(DX) 개선, 환경별 최적화

---

## 배포 & CI/CD

> 💡 블루-그린 배포 상세 흐름은 [인프라 아키텍처](#인프라-아키텍처-aws-blue-green-deployment) 섹션 참고
>
> **실제 운영 환경 경험**: 무중단 배포, 롤백 전략, Health Check, CloudWatch 모니터링 적용

### GitHub Actions 워크플로우

배포는 GitHub Actions를 통해 완전 자동화됩니다:

1. **이미지 빌드 & 푸시**: ECR에 Docker 이미지 푸시
2. **동적 IP 조회**: AWS API로 Blue/Green EC2 인스턴스 IP 확인
3. **SSH 배포**: 타겟 인스턴스에 SSH 접속 후 Docker 컨테이너 배포
4. **Health Check**: ALB가 인스턴스 상태 확인
5. **타겟 그룹 전환**: ALB 타겟 그룹 자동 전환 (수동)

---

## 개발 프로세스

### CI/CD Pipeline

```
PR/Push to main
│
├─ lint-and-typecheck
│  ├─ Prisma validate/format
│  ├─ TypeScript (typecheck:all)
│  ├─ ESLint
│  └─ Prettier
│
├─ unit-test
│  └─ Jest (mocked)
│
├─ integration-test
│  ├─ Docker PostgreSQL
│  └─ Jest (real DB)
│
└─ build
   └─ tsc + tsc-alias
```

### Commit Convention

Conventional Commits 규칙 준수 (commitlint + husky):

- `feat:` - 새 기능
- `fix:` - 버그 수정
- `docs:` - 문서 변경
- `style:` - 포맷팅 (코드 변경 없음)
- `refactor:` - 리팩토링
- `test:` - 테스트 추가/수정
- `chore:` - 빌드, 설정 변경
- `perf:` - 성능 개선

### Pre-commit Hooks

Husky + lint-staged:
1. Prisma 스키마 검증 및 포맷팅
2. ESLint 자동 수정
3. Prettier 자동 포맷
4. TypeScript 타입 체크

**긴급 우회** (비권장):
```bash
git commit --no-verify -m "feat: 긴급 수정"
```

---

## 트러블슈팅

### 자주 발생하는 문제

<details>
<summary><strong>1. Prisma Client 에러</strong></summary>

```bash
❌ Error: @prisma/client did not initialize yet
```

**해결:**
```bash
npx prisma generate
```
</details>

<details>
<summary><strong>2. 환경변수 누락</strong></summary>

```bash
❌ Missing environment variables: DATABASE_URL
```

**해결:**
```bash
cp .env.example .env
# .env 파일에서 필수 변수 설정
```
</details>

<details>
<summary><strong>3. 포트 이미 사용 중</strong></summary>

```bash
❌ Error: listen EADDRINUSE: address already in use :::3000
```

**해결:**
```bash
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```
</details>

<details>
<summary><strong>4. PostgreSQL 연결 실패</strong></summary>

```bash
❌ Can't reach database server at localhost:5432
```

**해결:**
```bash
# PostgreSQL이 실행 중인지 확인
# macOS
brew services start postgresql@17

# Linux
sudo systemctl start postgresql
```
</details>

<details>
<summary><strong>5. 테스트 DB 연결 실패</strong></summary>

```bash
❌ Integration tests failed
```

**해결:**
```bash
npm run test:db:up
npm run test:db:reset
npm run test:integration
```
</details>

<details>
<summary><strong>6. 마이그레이션 충돌</strong></summary>

```bash
❌ Migration failed: Table already exists
```

**해결 (개발 환경):**
```bash
# ⚠️ 주의: 데이터 초기화됨
npx prisma migrate reset
```
</details>

더 많은 도움: [GitHub Issues](https://github.com/nb04-part4-team2/nb04-codiit-team2/issues)

---

## 문서

### 프로젝트

- **발표 자료**: <!-- TODO: 발표 자료 링크 -->
- **팀 노션**: [CODI-IT 2팀](https://www.notion.so/CODI-IT-2-2b99ae0434fb803a8884e856fcef23cd)

### 외부 기술 가이드

- [TypeScript](https://www.typescriptlang.org/)
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/docs/)
- [Zod](https://zod.dev/)

---

## 기여 가이드

1. **브랜치 생성** - `feat/feature-name`, `fix/bug-name`
2. **코드 작성** - 코드 컨벤션 준수
3. **테스트 추가** - Unit/Integration 테스트 작성
4. **커밋** - Conventional Commits 규칙
5. **PR 생성** - PR 템플릿 작성
6. **CI 통과** - 모든 검사 통과 확인
7. **코드 리뷰** - 팀원 리뷰 승인
8. **머지** - Squash & Merge

---

## 팀원

| Profile | Name | Role | GitHub | 담당 영역 |
|---------|------|------|--------|-----------|
| <img src="https://github.com/qhdltmwhs.png" width="80" height="80"/> | 최홍기 | 백엔드 | [@qhdltmwhs](https://github.com/qhdltmwhs) | Store |
| <img src="https://github.com/aprkal12.png" width="80" height="80"/> | 김동현 | 백엔드 | [@aprkal12](https://github.com/aprkal12) | Cart, Order, Payment |
| <img src="https://github.com/Park-DaSeul.png" width="80" height="80"/> | 박다슬 | 백엔드 | [@Park-DaSeul](https://github.com/Park-DaSeul) | Notification, Inquiry |
| <img src="https://github.com/stoneME2.png" width="80" height="80"/> | 김혜연 | 백엔드 | [@stoneME2](https://github.com/stoneME2) | User, Auth |
| <img src="https://github.com/InsipidPie1229.png" width="80" height="80"/> | 홍준기 | 백엔드 | [@InsipidPie1229](https://github.com/InsipidPie1229) | Product, Review |
| <img src="https://github.com/winnie4869.png" width="80" height="80"/> | 이하영 | 백엔드 | [@hayo-oung](https://github.com/hayo-oung) | S3, Dashboard, Metadata |

---

## 라이선스

MIT License

---

## 문의

프로젝트 관련 문의사항은 [GitHub Issues](https://github.com/nb04-part4-team2/nb04-codiit-team2/issues)를 통해 남겨주세요.

---
