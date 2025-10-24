# Google Sheets API 설정 완벽 가이드 (초보자용)

## 📌 개요

이 가이드는 Google Sheets API를 처음 사용하는 분들을 위한 단계별 설정 방법입니다.
약 15-20분 정도 소요됩니다.

## 🎯 전체 과정 요약

1. Google Cloud 프로젝트 생성
2. Google Sheets API 활성화
3. 서비스 계정 생성
4. JSON 키 파일 다운로드
5. 환경 변수 파일(.env.local) 생성
6. Google Sheets 생성 및 공유
7. 테스트 및 확인

---

## 1단계: Google Cloud 프로젝트 생성 (5분)

### 1.1 Google Cloud Console 접속

1. **브라우저에서 접속**
   ```
   https://console.cloud.google.com/
   ```

2. **Google 계정으로 로그인**
   - Gmail 계정으로 로그인하세요
   - 처음 접속하는 경우 약관 동의가 필요합니다

### 1.2 새 프로젝트 생성

1. **상단 프로젝트 선택 드롭다운 클릭**
   - 화면 왼쪽 상단 "Google Cloud" 로고 옆에 있는 프로젝트 이름 클릭
   - 또는 "프로젝트 선택" 버튼 클릭

2. **"새 프로젝트" 클릭**
   - 팝업 창 우측 상단의 "새 프로젝트" 버튼 클릭

3. **프로젝트 정보 입력**
   ```
   프로젝트 이름: 용인시장업무추진비 (또는 원하는 이름)
   위치: 조직 없음 (개인 프로젝트의 경우)
   ```
   - "만들기" 버튼 클릭
   - 프로젝트 생성까지 약 10-30초 소요

4. **프로젝트 선택 확인**
   - 화면 상단에 방금 만든 프로젝트 이름이 표시되는지 확인

---

## 2단계: Google Sheets API 활성화 (2분)

### 2.1 API 라이브러리로 이동

1. **왼쪽 메뉴 열기**
   - 화면 왼쪽 상단의 "≡" (햄버거 메뉴) 클릭

2. **"API 및 서비스" > "라이브러리" 선택**
   ```
   ≡ 메뉴
   └─ API 및 서비스
      └─ 라이브러리  ← 여기 클릭
   ```

### 2.2 Google Sheets API 검색 및 활성화

1. **검색창에 입력**
   ```
   Google Sheets API
   ```

2. **"Google Sheets API" 클릭**
   - 검색 결과에서 파란색 로고의 "Google Sheets API" 선택

3. **"사용" 버튼 클릭**
   - API 상세 페이지에서 "사용" 또는 "Enable" 버튼 클릭
   - 이미 활성화된 경우 "관리" 버튼이 보입니다

4. **활성화 확인**
   - "API가 사용 설정됨" 메시지 확인

---

## 3단계: 서비스 계정 생성 (3분)

### 3.1 사용자 인증 정보 페이지로 이동

1. **왼쪽 메뉴에서 선택**
   ```
   ≡ 메뉴
   └─ API 및 서비스
      └─ 사용자 인증 정보  ← 여기 클릭
   ```

### 3.2 서비스 계정 만들기

1. **"+ 사용자 인증 정보 만들기" 클릭**
   - 화면 상단의 파란색 버튼 클릭

2. **"서비스 계정" 선택**
   - 드롭다운 메뉴에서 "서비스 계정" 클릭

### 3.3 서비스 계정 세부정보 입력

1. **서비스 계정 세부정보 (1/3 단계)**
   ```
   서비스 계정 이름: yongin-sheets-reader
   서비스 계정 ID: yongin-sheets-reader (자동 생성됨)
   서비스 계정 설명: 용인시장 업무추진비 데이터 읽기용
   ```
   - "만들기 및 계속하기" 클릭

2. **이 서비스 계정에 프로젝트 액세스 권한 부여 (2/3 단계)**
   ```
   역할: 기본 > 뷰어
   ```
   - 또는 역할 없이 건너뛰어도 됩니다 (Google Sheets만 사용할 경우)
   - "계속" 클릭

3. **사용자에게 이 서비스 계정 액세스 권한 부여 (3/3 단계)**
   - 아무것도 입력하지 않고 "완료" 클릭

### 3.4 서비스 계정 확인

- 서비스 계정 목록에 방금 만든 계정이 표시됩니다
- 이메일 형식: `yongin-sheets-reader@프로젝트ID.iam.gserviceaccount.com`
- **이 이메일 주소를 메모장에 복사해두세요!** 나중에 사용합니다

---

## 4단계: JSON 키 파일 다운로드 (2분)

### 4.1 서비스 계정 키 생성

1. **방금 만든 서비스 계정 클릭**
   - "사용자 인증 정보" 페이지의 "서비스 계정" 섹션에서
   - `yongin-sheets-reader@...` 이메일 클릭

2. **"키" 탭 선택**
   - 상단 탭 중 "키" 탭 클릭

3. **"키 추가" > "새 키 만들기" 클릭**
   - "키 추가" 드롭다운 버튼 클릭
   - "새 키 만들기" 선택

4. **키 유형 선택**
   ```
   JSON (권장)  ← 이것을 선택
   ```
   - "만들기" 클릭

5. **JSON 파일 자동 다운로드**
   - 브라우저가 `.json` 파일을 자동으로 다운로드합니다
   - 파일명 예: `프로젝트명-abc123.json`
   - **⚠️ 이 파일은 절대 외부에 공유하지 마세요! (비밀번호와 같습니다)**

### 4.2 다운로드된 JSON 파일 확인

1. **다운로드 폴더에서 JSON 파일 찾기**
   - 보통 `C:\Users\사용자명\Downloads\` 폴더에 있습니다

2. **JSON 파일을 안전한 위치로 이동** (선택사항)
   - 예: `C:\Users\user\Documents\google-keys\`
   - **주의**: 이 파일을 Git에 절대 커밋하지 마세요!

---

## 5단계: 환경 변수 파일(.env.local) 생성 (5분)

### 5.1 JSON 파일 열기

1. **메모장 또는 VS Code로 JSON 파일 열기**
   ```
   마우스 우클릭 > 연결 프로그램 > 메모장
   ```

2. **JSON 파일 내용 예시**
   ```json
   {
     "type": "service_account",
     "project_id": "yongin-budget-123456",
     "private_key_id": "abc123...",
     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkq...\n-----END PRIVATE KEY-----\n",
     "client_email": "yongin-sheets-reader@yongin-budget-123456.iam.gserviceaccount.com",
     "client_id": "123456789",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     ...
   }
   ```

### 5.2 필요한 정보 찾기

JSON 파일에서 다음 3가지 정보를 찾으세요:

1. **`client_email`** (서비스 계정 이메일)
   ```
   "client_email": "yongin-sheets-reader@yongin-budget-123456.iam.gserviceaccount.com"
   ```
   → 이 값을 복사하세요

2. **`private_key`** (개인 키) - **가장 중요!**
   ```
   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkq...\n-----END PRIVATE KEY-----\n"
   ```
   → 전체 값을 복사하세요 (따옴표는 제외)
   → **주의**: `\n`을 실제 줄바꿈으로 바꾸지 마세요! 그대로 복사!

3. **나중에 사용할 `project_id`** (참고용)
   ```
   "project_id": "yongin-budget-123456"
   ```

### 5.3 .env.local 파일 생성

1. **VS Code에서 프로젝트 폴더 열기**
   ```
   C:\Users\user\yongincity_business_expenses
   ```

2. **새 파일 생성**
   - 파일 이름: `.env.local` (앞에 점 필수!)
   - 위치: 프로젝트 루트 폴더

3. **다음 내용을 복사하여 붙여넣기**

   ```env
   # Google Sheets API 설정
   GOOGLE_CLIENT_EMAIL=yongin-sheets-reader@yongin-budget-123456.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...(생략)...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SPREADSHEET_ID=1a2b3c4d5e6f7g8h9i0j
   ```

4. **실제 값으로 교체하기**

   **GOOGLE_CLIENT_EMAIL 교체:**
   ```env
   GOOGLE_CLIENT_EMAIL=JSON파일의_client_email_값
   ```

   **GOOGLE_PRIVATE_KEY 교체:**
   ```env
   GOOGLE_PRIVATE_KEY="JSON파일의_private_key_값_전체"
   ```
   - ⚠️ **주의사항**:
     - 따옴표(")로 감싸야 합니다
     - `\n`을 그대로 유지하세요 (실제 줄바꿈으로 바꾸지 마세요)
     - 복사할 때 처음과 끝의 따옴표는 제외하고 내용만 복사

   **GOOGLE_SPREADSHEET_ID는 일단 임시값으로 두기**
   ```env
   GOOGLE_SPREADSHEET_ID=임시값
   ```
   - 다음 단계에서 실제 값으로 교체할 예정입니다

### 5.4 .env.local 파일 예시 (완성본)

```env
# Google Sheets API 설정
GOOGLE_CLIENT_EMAIL=yongin-sheets-reader@yongin-budget-123456.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCxyz...(매우 긴 문자열)...abc\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=1a2b3c4d5e6f7g8h9i0j
```

### 5.5 파일 저장 및 보안 확인

1. **파일 저장** (Ctrl + S)

2. **`.gitignore`에 포함되어 있는지 확인**
   - `.gitignore` 파일 열기
   - `.env*.local` 또는 `.env` 라인이 있는지 확인
   - 이미 포함되어 있어서 Git에 커밋되지 않습니다 ✅

---

## 6단계: Google Sheets 생성 및 공유 (3분)

### 6.1 Google Sheets 생성

1. **Google Sheets 접속**
   ```
   https://sheets.google.com
   ```

2. **새 스프레드시트 만들기**
   - "+" 버튼 클릭 또는
   - "빈 스프레드시트" 클릭

3. **스프레드시트 이름 변경**
   - 왼쪽 상단의 "제목 없는 스프레드시트" 클릭
   - 새 이름 입력: `용인시장_업무추진비_집행내역`
   - Enter 키 눌러 저장

### 6.2 CSV 데이터 가져오기

1. **메뉴에서 "파일" > "가져오기" 클릭**

2. **"업로드" 탭 선택**

3. **"업무추진비_전체데이터.csv" 파일 선택**
   - "기기에서 파일 선택" 클릭
   - 프로젝트 폴더의 CSV 파일 선택

4. **가져오기 설정**
   ```
   가져오기 위치: 현재 시트 바꾸기
   구분 기호 유형: 쉼표
   텍스트를 숫자, 날짜로 변환: ✅ 체크
   ```
   - "데이터 가져오기" 버튼 클릭

5. **데이터 확인**
   - 636개의 행이 표시되는지 확인 (헤더 포함 637행)
   - 헤더: 번호, 사용자, 사용일시, 사용장소, 집행목적, 대상인원, 사용금액, 결제방법, 비목, 비고

### 6.3 서비스 계정에 공유

⚠️ **이 단계가 가장 중요합니다!** 이 단계를 건너뛰면 웹사이트에서 데이터를 읽을 수 없습니다.

1. **우측 상단 "공유" 버튼 클릭**

2. **서비스 계정 이메일 입력**
   - `.env.local` 파일의 `GOOGLE_CLIENT_EMAIL` 값을 복사
   - 또는 JSON 파일의 `client_email` 값
   - 예: `yongin-sheets-reader@yongin-budget-123456.iam.gserviceaccount.com`
   - 입력란에 붙여넣기

3. **권한 설정**
   ```
   뷰어  ← 이것을 선택 (편집자가 아님!)
   ```

4. **"알림 전송" 체크 해제** (선택사항)
   - 서비스 계정은 이메일을 받을 수 없으므로 체크 해제

5. **"완료" 또는 "공유" 버튼 클릭**

6. **공유 확인**
   - "액세스 권한이 있는 사용자" 목록에 서비스 계정 이메일이 "뷰어"로 표시되는지 확인

### 6.4 스프레드시트 ID 복사

1. **브라우저 주소창의 URL 확인**
   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p/edit#gid=0
                                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                          이 부분이 SPREADSHEET_ID입니다
   ```

2. **ID 복사**
   - `/d/` 와 `/edit` 사이의 긴 문자열을 복사
   - 예: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`

3. **`.env.local` 파일 업데이트**
   - VS Code에서 `.env.local` 파일 열기
   - `GOOGLE_SPREADSHEET_ID` 값을 복사한 ID로 교체
   ```env
   GOOGLE_SPREADSHEET_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
   ```
   - 파일 저장 (Ctrl + S)

---

## 7단계: 테스트 및 확인 (2분)

### 7.1 개발 서버 실행

1. **터미널 열기** (VS Code에서 Ctrl + `)

2. **명령어 실행**
   ```bash
   npm run dev
   ```

3. **서버 시작 확인**
   ```
   ▲ Next.js 15.x.x
   - Local:        http://localhost:3000
   - Environments: .env.local
   ✓ Ready in 2.3s
   ```

### 7.2 브라우저에서 확인

1. **브라우저 열기**
   ```
   http://localhost:3000
   ```

2. **데이터 로드 확인**
   - ✅ 총 집행액: 180,797,850원
   - ✅ 총 건수: 636건
   - ✅ 월별 집행 현황 테이블 표시
   - ✅ 비목별 집행 현황 표시

### 7.3 오류가 발생한 경우

**빨간색 오류 박스가 표시되는 경우:**

1. **서비스 계정 공유 확인**
   - Google Sheets에서 서비스 계정이 공유되었는지 확인

2. **환경 변수 확인**
   - `.env.local` 파일 다시 확인
   - `GOOGLE_CLIENT_EMAIL`이 정확한지
   - `GOOGLE_PRIVATE_KEY`에 따옴표가 있는지
   - `GOOGLE_SPREADSHEET_ID`가 정확한지

3. **서버 재시작**
   - 터미널에서 `Ctrl + C`로 서버 중단
   - `npm run dev`로 다시 시작

4. **브라우저 콘솔 확인**
   - F12를 눌러 개발자 도구 열기
   - Console 탭에서 오류 메시지 확인

---

## ✅ 최종 체크리스트

설정이 완료되었는지 확인하세요:

- [ ] Google Cloud 프로젝트가 생성되었다
- [ ] Google Sheets API가 활성화되었다
- [ ] 서비스 계정이 생성되었다
- [ ] JSON 키 파일을 다운로드받았다
- [ ] `.env.local` 파일이 생성되었다
- [ ] `.env.local`에 3가지 값이 모두 입력되었다
  - [ ] GOOGLE_CLIENT_EMAIL
  - [ ] GOOGLE_PRIVATE_KEY
  - [ ] GOOGLE_SPREADSHEET_ID
- [ ] Google Sheets에 CSV 데이터를 가져왔다
- [ ] 서비스 계정에 스프레드시트를 공유했다 (뷰어 권한)
- [ ] 웹사이트(localhost:3000)에서 데이터가 정상적으로 표시된다

---

## 🔒 보안 주의사항

### 절대로 하면 안 되는 것 ❌

1. **JSON 키 파일을 Git에 커밋하지 마세요**
   - `.gitignore`에 포함되어 있는지 확인

2. **`.env.local` 파일을 Git에 커밋하지 마세요**
   - 이미 `.gitignore`에 포함되어 있습니다

3. **JSON 키나 Private Key를 SNS, 카페, 블로그에 공유하지 마세요**
   - 실수로 공개한 경우 즉시 키를 삭제하고 새로 생성하세요

4. **서비스 계정 이메일은 공개되어도 괜찮습니다**
   - Private Key만 비밀로 유지하면 됩니다

### 키가 노출된 경우 대처 방법

1. **Google Cloud Console 접속**
2. **"API 및 서비스" > "사용자 인증 정보"**
3. **해당 서비스 계정 클릭**
4. **"키" 탭에서 노출된 키 삭제**
5. **새 키 생성 후 `.env.local` 업데이트**

---

## 🆘 자주 하는 질문 (FAQ)

### Q1: "서비스 계정"이 정확히 뭔가요?
A: 사람이 아닌 프로그램(웹사이트)이 Google Sheets에 접근할 수 있도록 하는 특별한 계정입니다.
   마치 "로봇 직원"에게 회사 문서를 읽을 권한을 주는 것과 같습니다.

### Q2: Private Key가 너무 길어서 복사가 안 됩니다
A: JSON 파일을 메모장으로 열고, `"private_key":` 라인을 찾아서
   `"-----BEGIN` 부터 `-----\n"` 까지 전체를 복사하세요.
   따옴표는 제외하고 내용만 복사합니다.

### Q3: .env.local 파일이 보이지 않습니다
A: Windows에서 `.`으로 시작하는 파일은 숨김 파일입니다.
   - VS Code에서는 탐색기에 표시됩니다
   - Windows 탐색기에서는 "보기" > "숨긴 항목" 체크

### Q4: 스프레드시트 ID를 어디서 찾나요?
A: Google Sheets를 열었을 때 브라우저 주소창의 URL에서
   `/d/` 와 `/edit` 사이의 긴 문자열입니다.

### Q5: "API has not been used..." 오류가 나옵니다
A: Google Sheets API가 활성화되지 않았습니다.
   2단계로 돌아가서 API를 활성화하세요.

### Q6: "permission denied" 오류가 나옵니다
A: 서비스 계정에 스프레드시트를 공유하지 않았습니다.
   6.3단계로 돌아가서 공유 설정을 확인하세요.

### Q7: 개발 서버를 끄면 웹사이트가 안 보입니다
A: 개발 서버는 로컬에서만 작동합니다.
   실제 배포는 Vercel을 사용합니다 (별도 가이드 참조).

### Q8: JSON 파일을 잃어버렸습니다
A: 3단계로 돌아가서 새 서비스 계정을 만들거나,
   기존 서비스 계정에서 새 JSON 키를 생성하세요.

### Q9: 비용이 발생하나요?
A: Google Sheets API는 무료입니다.
   하루 500회 읽기 제한이 있지만 개인 프로젝트에는 충분합니다.

---

## 📚 다음 단계

설정이 완료되었다면:

1. **Vercel 배포** - `README.md` 참조
2. **차트 추가** - Recharts를 사용한 시각화
3. **검색/필터 기능** - TanStack Table 추가
4. **데이터 업데이트** - `extract_excel_data.py` 재실행

---

## 💡 도움이 더 필요하신가요?

- [Google Sheets API 공식 문서](https://developers.google.com/sheets/api)
- [Next.js 환경 변수 가이드](https://nextjs.org/docs/basic-features/environment-variables)
- [프로젝트 README](./README.md)

설정에 문제가 있다면 오류 메시지를 확인하고,
위의 FAQ를 참고하거나 각 단계를 다시 확인해보세요!
