import pandas as pd
import pdfplumber
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import os
import sys
from dotenv import load_dotenv
import re

# 인코딩 설정
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# .env.local 파일 로드
load_dotenv('.env.local')

def extract_data_from_pdf(pdf_path):
    """PDF 파일에서 데이터 추출"""
    print(f"\n{pdf_path} 파일 읽는 중...")

    all_rows = []

    try:
        with pdfplumber.open(pdf_path) as pdf:
            print(f"총 {len(pdf.pages)}페이지")

            for page_num, page in enumerate(pdf.pages, 1):
                print(f"\n페이지 {page_num} 처리 중...")

                # 테이블 추출
                tables = page.extract_tables()

                if tables:
                    for table_idx, table in enumerate(tables):
                        print(f"  테이블 {table_idx + 1} 발견 (행 수: {len(table)})")

                        # 첫 번째 행이 헤더인지 확인
                        for row in table:
                            if row and len(row) > 0:
                                # 빈 행 건너뛰기
                                if all(cell is None or str(cell).strip() == '' for cell in row):
                                    continue

                                # 헤더 행 건너뛰기
                                first_cell = str(row[0]).strip() if row[0] else ''
                                if '연번' in first_cell or '번호' in first_cell or first_cell == '':
                                    continue

                                # 숫자로 시작하는 행만 데이터로 간주
                                if first_cell and first_cell[0].isdigit():
                                    all_rows.append(row)
                else:
                    # 테이블이 없으면 텍스트로 추출 시도
                    text = page.extract_text()
                    if text:
                        print(f"  텍스트 추출: {len(text)} 문자")

        print(f"\n총 {len(all_rows)}개의 데이터 행을 추출했습니다.")

        # 데이터프레임 생성
        if all_rows:
            # 컬럼 수 확인 (가장 많은 컬럼을 가진 행 기준)
            max_cols = max(len(row) for row in all_rows)
            print(f"최대 컬럼 수: {max_cols}")

            # 모든 행을 동일한 컬럼 수로 맞추기
            normalized_rows = []
            for row in all_rows:
                # 부족한 컬럼은 빈 문자열로 채우기
                normalized_row = list(row) + [''] * (max_cols - len(row))
                normalized_rows.append(normalized_row)

            # 표준 컬럼명 사용 (10개 컬럼 기준)
            columns = ['번호', '사용자', '사용일시', '사용장소', '집행목적',
                      '대상인원', '사용금액', '결제방법', '비목', '비고']

            # 컬럼 수가 다르면 조정
            if max_cols < len(columns):
                columns = columns[:max_cols]
            elif max_cols > len(columns):
                columns = columns + [f'추가{i}' for i in range(max_cols - len(columns))]

            df = pd.DataFrame(normalized_rows, columns=columns)

            # 데이터 미리보기
            print("\n첫 5개 행 미리보기:")
            print(df.head().to_string())

            return df
        else:
            print("추출된 데이터가 없습니다.")
            return None

    except Exception as e:
        print(f"오류 발생: {e}")
        import traceback
        traceback.print_exc()
        return None

def clean_amount(value):
    """금액 데이터 정리"""
    if pd.isna(value):
        return 0
    if isinstance(value, (int, float)):
        return int(value)
    str_value = str(value).replace(',', '').replace('원', '').strip()
    try:
        return int(float(str_value))
    except:
        return 0

def clean_people_count(value):
    """대상인원 데이터 정리"""
    if pd.isna(value) or value == '-' or value == '':
        return '-'
    if isinstance(value, (int, float)):
        return int(value)
    str_value = str(value).strip()
    if str_value == '-' or str_value == '':
        return '-'
    try:
        return int(float(str_value))
    except:
        return '-'

def connect_to_google_sheets():
    """구글 시트 연결"""
    print("\n구글 시트 연결 중...")

    try:
        client_email = os.getenv('GOOGLE_CLIENT_EMAIL')
        private_key = os.getenv('GOOGLE_PRIVATE_KEY')
        spreadsheet_id = os.getenv('GOOGLE_SPREADSHEET_ID')

        if not all([client_email, private_key, spreadsheet_id]):
            print("[ERROR] 환경변수가 설정되지 않았습니다.")
            return None

        private_key = private_key.replace('\\n', '\n')

        creds_dict = {
            "type": "service_account",
            "project_id": "spry-spanner-458322-m7",
            "private_key_id": "dummy_key_id",
            "private_key": private_key,
            "client_email": client_email,
            "client_id": "dummy_client_id",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{client_email.replace('@', '%40')}"
        }

        scope = [
            'https://spreadsheets.google.com/feeds',
            'https://www.googleapis.com/auth/drive'
        ]

        creds = ServiceAccountCredentials.from_json_keyfile_dict(creds_dict, scope)
        client = gspread.authorize(creds)

        spreadsheet = client.open_by_key(spreadsheet_id)

        print(f"[OK] 구글 시트 연결 성공: {spreadsheet.title}")

        return spreadsheet
    except Exception as e:
        print(f"[ERROR] 구글 시트 연결 실패: {e}")
        import traceback
        traceback.print_exc()
        return None

def upload_to_google_sheets(df, spreadsheet):
    """데이터를 구글 시트에 업로드"""
    print(f"\n구글 시트에 데이터 업로드 중...")

    try:
        worksheets = spreadsheet.worksheets()
        print(f"기존 시트: {[ws.title for ws in worksheets]}")

        worksheet = worksheets[0]
        print(f"'{worksheet.title}' 시트에 데이터를 추가합니다.")

        existing_data = worksheet.get_all_values()
        print(f"기존 데이터 행 수: {len(existing_data)}")

        # 데이터를 문자열로 변환
        df_str = df.copy()
        for col in df_str.columns:
            df_str[col] = df_str[col].astype(str)

        values = df_str.values.tolist()

        print(f"데이터 업로드 시작 위치: A{len(existing_data) + 1}")
        print(f"업로드할 데이터 샘플 (첫 3개 행):")
        for i, row in enumerate(values[:3]):
            print(f"  행 {i+1}: {row[:5]}...")

        worksheet.append_rows(values, value_input_option='USER_ENTERED')

        print(f"[OK] {len(df)}개의 행이 성공적으로 업로드되었습니다.")

        return True
    except Exception as e:
        print(f"[ERROR] 데이터 업로드 실패: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    pdf_file = r"C:\Users\pyh\yongincity_business_expenses\data\용인시장_업무추진비\시장 업무추진비 집행내역(2025년 10월).pdf"

    print("=" * 80)
    print("용인시장 업무추진비 데이터 업로드 (2025년 10월 - PDF)")
    print("=" * 80)

    # 1. PDF에서 데이터 추출
    df = extract_data_from_pdf(pdf_file)

    if df is None or len(df) == 0:
        print("[ERROR] PDF에서 데이터를 추출할 수 없습니다.")
        return

    # 2. 데이터 정리
    print("\n데이터 정리 중...")

    # 필수 컬럼 확인
    required_columns = ['번호', '사용자', '사용일시', '사용장소', '집행목적',
                       '대상인원', '사용금액', '결제방법', '비목', '비고']

    for col in required_columns:
        if col not in df.columns:
            df[col] = ''

    # 필요한 컬럼만 선택
    df = df[required_columns]

    # 금액과 인원 정리
    if '사용금액' in df.columns:
        df['사용금액'] = df['사용금액'].apply(clean_amount)
    if '대상인원' in df.columns:
        df['대상인원'] = df['대상인원'].apply(clean_people_count)

    # 금액이 0인 행 제거
    df = df[df['사용금액'] > 0]

    # 빈 값 처리
    df = df.fillna('')

    # 3. 통계 출력
    print("\n" + "=" * 80)
    print("데이터 통계")
    print("=" * 80)
    total_amount = df['사용금액'].sum()
    print(f"총 집행액: {total_amount:,}원")
    print(f"총 건수: {len(df)}건")
    if len(df) > 0:
        print(f"평균 집행액: {total_amount/len(df):,.0f}원")

    # 4. 구글 시트 연결
    spreadsheet = connect_to_google_sheets()

    if spreadsheet is None:
        print("[ERROR] 구글 시트에 연결할 수 없습니다.")
        return

    # 5. 데이터 업로드
    success = upload_to_google_sheets(df, spreadsheet)

    if success:
        print("\n" + "=" * 80)
        print("[OK] 작업 완료!")
        print("=" * 80)
        print(f"구글 시트 URL: https://docs.google.com/spreadsheets/d/{os.getenv('GOOGLE_SPREADSHEET_ID')}/edit")
    else:
        print("\n[ERROR] 작업 실패")

if __name__ == "__main__":
    main()
