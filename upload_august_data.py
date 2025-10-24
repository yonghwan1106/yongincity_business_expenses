import pandas as pd
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import os
import sys
from dotenv import load_dotenv

# 인코딩 설정
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# .env.local 파일 로드
load_dotenv('.env.local')

def clean_amount(value):
    """금액 데이터 정리 (쉼표 제거, 숫자로 변환)"""
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

def read_excel_file(file_path):
    """Excel 파일 읽기 - 헤더를 찾아서 데이터 추출"""
    print(f"\n{file_path} 파일 읽는 중...")

    try:
        # 먼저 파일 전체를 읽기 (헤더 없이)
        df_raw = pd.read_excel(file_path, header=None)

        # 헤더 행 찾기 (연번이나 번호가 있는 행)
        header_idx = None
        for idx, row in df_raw.iterrows():
            row_values = [str(x) for x in row if pd.notna(x)]
            row_str = ' '.join(row_values)
            if '연번' in row_str and '사용자' in row_str:
                header_idx = idx
                print(f"헤더 행 발견: {idx}번째 행")
                break

        if header_idx is None:
            print("⚠️ 헤더 행을 찾을 수 없습니다. 첫 행을 헤더로 사용합니다.")
            header_idx = 0

        # 헤더 추출
        headers = df_raw.iloc[header_idx].tolist()

        # 데이터는 헤더 다음 행부터
        data_start_idx = header_idx + 1

        # 데이터 추출
        df = df_raw.iloc[data_start_idx:].copy()
        df.columns = headers

        # 빈 행 제거
        df = df.dropna(how='all')

        # 첫 번째 컬럼(연번/번호)이 숫자인 행만 유지
        first_col = df.columns[0]
        df = df[pd.to_numeric(df[first_col], errors='coerce').notna()]

        print(f"총 {len(df)}개의 유효한 데이터 행을 찾았습니다.")

        return df
    except Exception as e:
        print(f"오류 발생: {e}")
        import traceback
        traceback.print_exc()
        return None

def extract_main_columns(df):
    """주요 컬럼만 추출하고 표준화"""
    column_map = {}

    for col in df.columns:
        if pd.isna(col):
            continue
        col_str = str(col).strip()

        if '연번' in col_str or '번호' in col_str:
            column_map['번호'] = col
        elif '사용자' in col_str:
            column_map['사용자'] = col
        elif '사용일시' in col_str:
            column_map['사용일시'] = col
        elif '사용장소' in col_str:
            column_map['사용장소'] = col
        elif '집행목적' in col_str:
            column_map['집행목적'] = col
        elif '대상인원' in col_str:
            column_map['대상인원'] = col
        elif '사용금액' in col_str:
            column_map['사용금액'] = col
        elif '결제방법' in col_str:
            column_map['결제방법'] = col
        elif '비목' in col_str:
            column_map['비목'] = col
        elif '비고' in col_str:
            column_map['비고'] = col

    print(f"발견된 컬럼 매핑: {column_map}")

    if column_map:
        try:
            df_filtered = df[list(column_map.values())].copy()
            df_filtered.columns = list(column_map.keys())
            return df_filtered
        except Exception as e:
            print(f"컬럼 추출 오류: {e}")
            return df

    print("⚠️ 필요한 컬럼을 찾을 수 없습니다.")
    return df

def connect_to_google_sheets():
    """구글 시트 연결"""
    print("\n구글 시트 연결 중...")

    try:
        # 환경변수에서 인증 정보 가져오기
        client_email = os.getenv('GOOGLE_CLIENT_EMAIL')
        private_key = os.getenv('GOOGLE_PRIVATE_KEY')
        spreadsheet_id = os.getenv('GOOGLE_SPREADSHEET_ID')

        if not all([client_email, private_key, spreadsheet_id]):
            print("[ERROR] 환경변수가 설정되지 않았습니다.")
            return None

        # Private key 포맷 정리
        private_key = private_key.replace('\\n', '\n')

        # 인증 정보 설정
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

        # 스프레드시트 열기
        spreadsheet = client.open_by_key(spreadsheet_id)

        print(f"[OK] 구글 시트 연결 성공: {spreadsheet.title}")

        return spreadsheet
    except Exception as e:
        print(f"[ERROR] 구글 시트 연결 실패: {e}")
        import traceback
        traceback.print_exc()
        return None

def upload_to_google_sheets(df, spreadsheet, sheet_name="2025년 8월"):
    """데이터를 구글 시트에 업로드"""
    print(f"\n'{sheet_name}' 시트에 데이터 업로드 중...")

    try:
        # 먼저 기존 시트 목록 확인
        worksheets = spreadsheet.worksheets()
        print(f"기존 시트: {[ws.title for ws in worksheets]}")

        # 첫 번째 시트를 사용하거나 특정 시트 찾기
        worksheet = None
        for ws in worksheets:
            if "2025" in ws.title or "전체" in ws.title or ws.title == "Sheet1":
                worksheet = ws
                print(f"'{ws.title}' 시트에 데이터를 추가합니다.")
                break

        if worksheet is None:
            worksheet = worksheets[0]
            print(f"첫 번째 시트 '{worksheet.title}'에 데이터를 추가합니다.")

        # 기존 데이터 확인
        existing_data = worksheet.get_all_values()
        print(f"기존 데이터 행 수: {len(existing_data)}")

        # 데이터프레임을 리스트로 변환 (모든 값을 문자열로)
        headers = df.columns.tolist()

        # 날짜/시간 객체를 문자열로 변환
        df_str = df.copy()
        for col in df_str.columns:
            df_str[col] = df_str[col].astype(str)

        values = df_str.values.tolist()

        # 기존 데이터가 없으면 헤더 추가
        if len(existing_data) == 0:
            all_data = [headers] + values
            start_row = 'A1'
        else:
            # 기존 데이터 아래에 추가
            all_data = values
            start_row = f'A{len(existing_data) + 1}'

        # 데이터 업로드
        print(f"데이터 업로드 시작 위치: {start_row}")
        print(f"업로드할 데이터 샘플 (첫 3개 행):")
        for i, row in enumerate(values[:3]):
            print(f"  행 {i+1}: {row[:5]}...")  # 첫 5개 컬럼만 출력

        worksheet.append_rows(values, value_input_option='USER_ENTERED')

        print(f"[OK] {len(df)}개의 행이 성공적으로 업로드되었습니다.")

        return True
    except Exception as e:
        print(f"[ERROR] 데이터 업로드 실패: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    # 엑셀 파일 경로
    excel_file = r"C:\Users\user\Downloads\251014 용인시 업무추진비 집행내역\시장 업무추진비 집행내역(2025년 8월).xlsx"

    print("=" * 80)
    print("용인시장 업무추진비 데이터 업로드 (2025년 8월)")
    print("=" * 80)

    # 1. 엑셀 파일 읽기
    df = read_excel_file(excel_file)

    if df is None:
        print("[ERROR] 엑셀 파일을 읽을 수 없습니다.")
        return

    # 2. 주요 컬럼 추출
    df_clean = extract_main_columns(df)

    # 3. 필수 컬럼 확인 및 추가
    required_columns = ['번호', '사용자', '사용일시', '사용장소', '집행목적',
                       '대상인원', '사용금액', '결제방법', '비목', '비고']

    for col in required_columns:
        if col not in df_clean.columns:
            df_clean[col] = ''

    # 필요한 컬럼만 선택
    df_clean = df_clean[required_columns]

    # 4. 데이터 정리
    print("\n데이터 정리 중...")
    df_clean['사용금액'] = df_clean['사용금액'].apply(clean_amount)
    df_clean['대상인원'] = df_clean['대상인원'].apply(clean_people_count)

    # 금액이 0인 행 제거
    df_clean = df_clean[df_clean['사용금액'] > 0]

    # 번호 재정렬 (1부터 시작)
    df_clean['번호'] = range(1, len(df_clean) + 1)

    # 빈 값 처리
    df_clean = df_clean.fillna('')

    # 5. 통계 출력
    print("\n" + "=" * 80)
    print("데이터 통계")
    print("=" * 80)
    total_amount = df_clean['사용금액'].sum()
    print(f"총 집행액: {total_amount:,}원")
    print(f"총 건수: {len(df_clean)}건")
    if len(df_clean) > 0:
        print(f"평균 집행액: {total_amount/len(df_clean):,.0f}원")

    # 6. 구글 시트 연결
    spreadsheet = connect_to_google_sheets()

    if spreadsheet is None:
        print("[ERROR] 구글 시트에 연결할 수 없습니다.")
        return

    # 7. 데이터 업로드
    success = upload_to_google_sheets(df_clean, spreadsheet, "2025년 8월")

    if success:
        print("\n" + "=" * 80)
        print("[OK] 작업 완료!")
        print("=" * 80)
        print(f"구글 시트 URL: https://docs.google.com/spreadsheets/d/{os.getenv('GOOGLE_SPREADSHEET_ID')}/edit")
    else:
        print("\n[ERROR] 작업 실패")

if __name__ == "__main__":
    main()
