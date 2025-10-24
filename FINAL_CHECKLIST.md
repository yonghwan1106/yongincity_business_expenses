# 🎯 최종 체크리스트 및 실행 가이드

## ✅ 완료된 작업

- [x] Next.js 프로젝트 생성
- [x] Google Sheets API 연동 코드 작성
- [x] 대시보드 UI 컴포넌트 구현
- [x] Excel 데이터 추출 스크립트 작성
- [x] CSV 파일 생성 (636건)
- [x] 상세 설정 가이드 문서 작성
- [x] Git 리포지토리 초기화

## 📋 남은 작업 (순서대로 진행)

### 1단계: Google Cloud 설정 (15분)

**가이드**: `GOOGLE_API_SETUP_DETAILED.md` 참조

- [ ] Google Cloud Console 접속
- [ ] 새 프로젝트 생성 ("용인시장업무추진비")
- [ ] Google Sheets API 활성화
- [ ] 서비스 계정 생성
- [ ] JSON 키 파일 다운로드

**완료 확인**: JSON 파일이 다운로드 폴더에 있음

---

### 2단계: 환경 변수 설정 (5분)

**가이드**: `GOOGLE_API_SETUP_DETAILED.md` 5단계 참조

1. **JSON 파일에서 정보 복사**
   - `client_email` → 메모장에 복사
   - `private_key` → 메모장에 복사

2. **`.env.local` 파일 생성**
   - 위치: 프로젝트 루트 폴더
   - 파일명: `.env.local` (점 포함!)

3. **내용 입력**
   ```env
   GOOGLE_CLIENT_EMAIL=여기에_client_email_붙여넣기
   GOOGLE_PRIVATE_KEY="여기에_private_key_붙여넣기"
   GOOGLE_SPREADSHEET_ID=임시값
   ```

**완료 확인**: `.env.local` 파일이 프로젝트 폴더에 생성됨

---

### 3단계: Google Sheets에 데이터 가져오기 (5분)

**가이드**: `CSV_IMPORT_GUIDE.md` 참조

1. **Google Sheets 접속**
   ```
   https://sheets.google.com
   ```

2. **새 스프레드시트 생성**
   - "빈 스프레드시트" 클릭
   - 이름: "용인시장_업무추진비_집행내역"

3. **CSV 가져오기**
   - 메뉴: `파일` > `가져오기`
   - `업로드` 탭 선택
   - `업무추진비_전체데이터.csv` 업로드
   - 구분 기호: "쉼표"
   - `데이터 가져오기` 클릭

4. **데이터 확인**
   - 637행이 있는지 확인 (헤더 포함)
   - 첫 행이 "번호, 사용자, 사용일시..." 인지 확인

**완료 확인**: Google Sheets에 636건의 데이터가 표시됨

---

### 4단계: 서비스 계정 공유 ⭐ 중요! (2분)

**가이드**: `GOOGLE_API_SETUP_DETAILED.md` 6.3단계 참조

1. **공유 버튼 클릭**
   - 우측 상단 "공유" 버튼

2. **서비스 계정 이메일 입력**
   - `.env.local` 파일의 `GOOGLE_CLIENT_EMAIL` 값 복사
   - 또는 JSON 파일의 `client_email` 값
   - 공유 창에 붙여넣기

3. **권한 설정**
   - "뷰어" 선택 (편집자 아님!)
   - "완료" 클릭

**완료 확인**:
- "액세스 권한이 있는 사용자"에 서비스 계정이 "뷰어"로 표시됨
- 예: `yongin-sheets-reader@프로젝트.iam.gserviceaccount.com`

---

### 5단계: 스프레드시트 ID 복사 (1분)

1. **URL 확인**
   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit
                                          ^^^^^^^^^^^^^^^^^^^^
                                          이 부분 복사
   ```

2. **`.env.local` 업데이트**
   - VS Code에서 `.env.local` 열기
   - `GOOGLE_SPREADSHEET_ID` 값을 복사한 ID로 교체
   - 저장 (Ctrl + S)

**완료 확인**: `.env.local`에 3가지 값이 모두 채워짐

---

### 6단계: 로컬 테스트 (2분)

1. **개발 서버 실행**
   ```bash
   cd C:\Users\user\yongincity_business_expenses
   npm run dev
   ```

2. **브라우저 확인**
   ```
   http://localhost:3000
   ```

3. **데이터 확인**
   - ✅ 총 집행액: 180,797,850원
   - ✅ 총 건수: 636건
   - ✅ 월별 집행 현황 테이블
   - ✅ 비목별 집행 현황

**완료 확인**: 웹사이트에 데이터가 정상적으로 표시됨

**오류 발생 시**:
- `GOOGLE_API_SETUP_DETAILED.md` → "🆘 문제 해결" 섹션 참조
- 서비스 계정 공유 확인
- 환경 변수 재확인

---

### 7단계: GitHub 리포지토리 생성 (선택사항)

**이미 초기화됨**: Git 리포지토리는 이미 생성되어 있습니다.

1. **GitHub에서 새 리포지토리 생성**
   - https://github.com/new
   - 리포지토리 이름: `yongincity-business-expenses`
   - Public 또는 Private 선택
   - "Create repository" 클릭

2. **원격 리포지토리 연결**
   ```bash
   git remote add origin https://github.com/사용자명/yongincity-business-expenses.git
   git branch -M main
   git push -u origin main
   ```

**완료 확인**: GitHub에 코드가 업로드됨

---

### 8단계: Vercel 배포 (5분)

**가이드**: `README.md` → "🚢 Vercel 배포" 섹션 참조

1. **Vercel 접속**
   ```
   https://vercel.com
   ```
   - GitHub 계정으로 로그인

2. **새 프로젝트 생성**
   - "New Project" 클릭
   - GitHub 리포지토리 선택 (`yongincity-business-expenses`)
   - "Import" 클릭

3. **환경 변수 설정**
   - "Environment Variables" 섹션에서 추가:
   ```
   GOOGLE_CLIENT_EMAIL = .env.local의 값 복사
   GOOGLE_PRIVATE_KEY = .env.local의 값 복사 (따옴표 포함!)
   GOOGLE_SPREADSHEET_ID = .env.local의 값 복사
   ```

4. **배포**
   - "Deploy" 버튼 클릭
   - 1-2분 대기

5. **배포 URL 확인**
   ```
   https://yongincity-business-expenses.vercel.app
   ```

**완료 확인**:
- 배포 성공 메시지
- 실제 URL에서 데이터 정상 표시

---

## 🎯 최종 확인 체크리스트

### Google Cloud
- [ ] 프로젝트 생성됨
- [ ] Google Sheets API 활성화됨
- [ ] 서비스 계정 생성됨
- [ ] JSON 키 다운로드됨

### 환경 변수
- [ ] `.env.local` 파일 생성됨
- [ ] `GOOGLE_CLIENT_EMAIL` 설정됨
- [ ] `GOOGLE_PRIVATE_KEY` 설정됨 (따옴표 포함)
- [ ] `GOOGLE_SPREADSHEET_ID` 설정됨

### Google Sheets
- [ ] 스프레드시트 생성됨
- [ ] CSV 데이터 가져오기 완료 (636행)
- [ ] 서비스 계정에 공유됨 (뷰어 권한)

### 로컬 테스트
- [ ] `npm run dev` 실행됨
- [ ] localhost:3000에서 데이터 표시됨
- [ ] 오류 없음

### 배포 (선택사항)
- [ ] GitHub 리포지토리 생성됨
- [ ] Vercel 프로젝트 생성됨
- [ ] 환경 변수 설정됨
- [ ] 배포 성공
- [ ] 실제 URL에서 작동 확인

---

## 🚀 다음 단계 (선택사항)

프로젝트가 완성되었습니다! 추가 기능이 필요하다면:

### 1. 차트 추가
- 월별 추이 그래프 (Recharts)
- 비목별 도넛 차트
- 장소별 상위 10개 차트

### 2. 검색/필터 기능
- 날짜 범위 필터
- 금액 범위 필터
- 키워드 검색
- TanStack Table로 고급 테이블

### 3. 엑셀 다운로드 기능
- 필터링된 데이터를 Excel로 내보내기

### 4. 반응형 개선
- 모바일 UI 최적화
- 태블릿 레이아웃 개선

### 5. SEO 최적화
- 메타 태그 추가
- sitemap.xml 생성
- robots.txt 설정

---

## 📚 참고 문서

| 문서 | 내용 |
|------|------|
| `README.md` | 프로젝트 전체 개요 및 설정 |
| `GOOGLE_API_SETUP_DETAILED.md` | Google Sheets API 상세 설정 (초보자용) |
| `GOOGLE_SHEETS_SETUP.md` | Google Sheets 데이터 구조 가이드 |
| `CSV_IMPORT_GUIDE.md` | CSV 가져오기 3가지 방법 |
| `PERFORMANCE_INFO.md` | 성능 및 한계 정보 |
| `FINAL_CHECKLIST.md` | 이 문서 - 최종 체크리스트 |

---

## 🆘 문제 해결

### 자주 발생하는 오류

**1. "데이터 로드 오류"**
- 서비스 계정 공유 확인
- 환경 변수 확인
- 스프레드시트 ID 확인

**2. "Invalid credentials"**
- `.env.local` 파일 위치 확인
- `GOOGLE_PRIVATE_KEY` 따옴표 확인
- 서버 재시작 (`Ctrl+C` 후 `npm run dev`)

**3. "Permission denied"**
- 서비스 계정에 스프레드시트 공유했는지 확인
- 권한이 "뷰어"인지 확인

**4. "Spreadsheet not found"**
- `GOOGLE_SPREADSHEET_ID` 값 확인
- URL에서 ID를 정확히 복사했는지 확인

### 추가 도움이 필요하면
- `GOOGLE_API_SETUP_DETAILED.md` → FAQ 섹션
- 오류 메시지를 자세히 확인
- 브라우저 개발자 도구 (F12) → Console 탭

---

## 🎉 완료 후

모든 체크리스트가 완료되면:

1. **로컬에서 확인**: http://localhost:3000
2. **Vercel에서 확인**: https://your-project.vercel.app
3. **데이터 업데이트**:
   - Google Sheets에서 직접 수정 가능
   - 또는 Excel 재추출 후 CSV 가져오기

**축하합니다! 프로젝트가 완성되었습니다!** 🎊
