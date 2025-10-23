# 용인시장 업무추진비 투명성 모니터링 시스템

용인시장의 업무추진비 사용 내역을 시각적이고 투명하게 공개하는 웹 애플리케이션입니다.

## 🚀 주요 기능

- 📊 **총괄 대시보드**: 총액, 건수, 월평균 등 핵심 통계
- 📈 **월별 추이**: 월별 집행 현황 및 트렌드 분석
- 🏷️ **비목별 분류**: 기관운영비, 시책추진비 등 항목별 분류
- 🔍 **상세 검색**: 기간, 금액, 키워드 기반 필터링
- 📱 **반응형 디자인**: 모바일/태블릿/데스크톱 최적화

## 🛠️ 기술 스택

- **Frontend**: Next.js 15 (App Router), TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Charts**: Recharts
- **Data Source**: Google Sheets API
- **Deployment**: Vercel

## 📋 시작하기

### 1. 프로젝트 클론

\`\`\`bash
git clone <your-repo-url>
cd yongincity-business-expenses
\`\`\`

### 2. 의존성 설치

\`\`\`bash
npm install
\`\`\`

### 3. Google Sheets API 설정

#### 3.1 Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "라이브러리" 이동
4. "Google Sheets API" 검색 및 활성화

#### 3.2 서비스 계정 생성

1. "API 및 서비스" > "사용자 인증 정보" 이동
2. "+ 사용자 인증 정보 만들기" > "서비스 계정" 선택
3. 서비스 계정 이름 입력 후 생성
4. 생성된 서비스 계정 클릭
5. "키" 탭 > "키 추가" > "새 키 만들기" > "JSON" 선택
6. JSON 키 파일 다운로드

#### 3.3 Google Sheets 권한 설정

1. Google Sheets에서 업무추진비 데이터 스프레드시트 생성
2. 서비스 계정 이메일(JSON 파일의 \`client_email\`)을 찾기
3. 스프레드시트 공유 > 서비스 계정 이메일 추가 (뷰어 권한)

#### 3.4 환경 변수 설정

\`.env.local\` 파일을 프로젝트 루트에 생성:

\`\`\`env
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYour Private Key\\n-----END PRIVATE KEY-----\\n"
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
\`\`\`

> **중요**: \`GOOGLE_PRIVATE_KEY\`는 JSON 파일에서 복사할 때 줄바꿈(\`\\n\`)을 그대로 유지해야 합니다.

### 4. Google Sheets 데이터 구조

스프레드시트는 다음 컬럼 구조를 가져야 합니다:

| 번호 | 사용자 | 사용일시 | 사용장소 | 집행목적 | 대상인원 | 사용금액 | 결제방법 | 비목 | 비고 |
|------|--------|----------|----------|----------|----------|----------|----------|------|------|
| 1 | 용인시장 | 2025-09-09 | 크웰브 | 직원 격려 | 3 | 11,600 | 카드 | 기관 | |

### 5. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 6. 빌드

\`\`\`bash
npm run build
npm start
\`\`\`

## 🚢 Vercel 배포

### 1. GitHub 리포지토리 연동

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
\`\`\`

### 2. Vercel에서 배포

1. [Vercel](https://vercel.com) 접속 및 로그인
2. "New Project" 클릭
3. GitHub 리포지토리 선택
4. Environment Variables 설정:
   - \`GOOGLE_CLIENT_EMAIL\`
   - \`GOOGLE_PRIVATE_KEY\`
   - \`GOOGLE_SPREADSHEET_ID\`
5. "Deploy" 클릭

## 📁 프로젝트 구조

\`\`\`
yongincity-business-expenses/
├── src/
│   ├── app/              # Next.js App Router 페이지
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/       # React 컴포넌트
│   │   ├── ui/          # 기본 UI 컴포넌트
│   │   └── StatsCard.tsx
│   ├── lib/             # 유틸리티 함수
│   │   ├── googleSheets.ts
│   │   └── utils.ts
│   └── types/           # TypeScript 타입 정의
│       └── index.ts
├── .env.example         # 환경 변수 예시
├── .gitignore
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
\`\`\`

## 🔒 보안

- 환경 변수는 절대 커밋하지 마세요
- Google Sheets는 서비스 계정에만 공유하세요
- Vercel의 Environment Variables를 사용하세요

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
