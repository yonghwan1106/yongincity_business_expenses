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

def download_sheet_data(spreadsheet):
    """구글 시트에서 데이터 다운로드"""
    print("\n구글 시트 데이터 다운로드 중...")

    try:
        # 첫 번째 시트 가져오기
        worksheet = spreadsheet.worksheets()[0]
        print(f"'{worksheet.title}' 시트 읽는 중...")

        # 모든 데이터 가져오기
        all_values = worksheet.get_all_values()

        if not all_values:
            print("[ERROR] 시트에 데이터가 없습니다.")
            return None

        print(f"총 {len(all_values)}개의 행을 다운로드했습니다.")

        # 첫 행을 헤더로 사용
        headers = all_values[0]
        data_rows = all_values[1:]

        # 데이터프레임 생성
        df = pd.DataFrame(data_rows, columns=headers)

        print(f"\n데이터 미리보기 (첫 5행):")
        print(df.head())

        return df

    except Exception as e:
        print(f"[ERROR] 데이터 다운로드 실패: {e}")
        import traceback
        traceback.print_exc()
        return None

def clean_dataframe(df):
    """데이터프레임 정리"""
    print("\n데이터 정리 중...")

    # 빈 행 제거
    df = df.dropna(how='all')

    # 번호 컬럼이 비어있는 행 제거
    if '번호' in df.columns:
        df = df[df['번호'].notna()]
        df = df[df['번호'] != '']

    # 사용금액 정리
    if '사용금액' in df.columns:
        def clean_amount(value):
            if pd.isna(value) or value == '':
                return 0
            try:
                # 문자열에서 숫자만 추출
                str_value = str(value).replace(',', '').replace('원', '').strip()
                return int(float(str_value))
            except:
                return 0

        df['사용금액'] = df['사용금액'].apply(clean_amount)

        # 금액이 0인 행 제거
        df = df[df['사용금액'] > 0]

    # 번호 재정렬
    df['번호'] = range(1, len(df) + 1)

    print(f"정리 후 총 {len(df)}개의 행")

    return df

def save_to_csv(df, output_file):
    """CSV 파일로 저장"""
    print(f"\n{output_file} 파일로 저장 중...")

    try:
        df.to_csv(output_file, index=False, encoding='utf-8-sig')
        print(f"[OK] CSV 파일 저장 완료")

        # 통계 출력
        print("\n" + "=" * 80)
        print("데이터 통계")
        print("=" * 80)
        print(f"총 레코드 수: {len(df)}건")

        if '사용금액' in df.columns:
            total_amount = df['사용금액'].sum()
            print(f"총 집행액: {total_amount:,}원")
            if len(df) > 0:
                print(f"평균 집행액: {total_amount/len(df):,.0f}원")

        # 비목별 통계
        if '비목' in df.columns and df['비목'].notna().any():
            print("\n비목별 집행 현황:")
            category_stats = df.groupby('비목').agg({
                '사용금액': ['sum', 'count']
            }).round(0)
            print(category_stats)

        # 월별 통계 (사용일시가 있는 경우)
        if '사용일시' in df.columns:
            print("\n월별 집행 현황:")
            # 날짜 추출 시도
            df_temp = df.copy()
            df_temp['월'] = df_temp['사용일시'].astype(str).str[:7]  # YYYY-MM 형식
            monthly_stats = df_temp.groupby('월').agg({
                '사용금액': ['sum', 'count']
            }).round(0)
            print(monthly_stats)

        return True

    except Exception as e:
        print(f"[ERROR] CSV 저장 실패: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("=" * 80)
    print("구글 시트 데이터를 CSV로 업데이트")
    print("=" * 80)

    # 1. 구글 시트 연결
    spreadsheet = connect_to_google_sheets()

    if spreadsheet is None:
        print("[ERROR] 구글 시트에 연결할 수 없습니다.")
        return

    # 2. 데이터 다운로드
    df = download_sheet_data(spreadsheet)

    if df is None or len(df) == 0:
        print("[ERROR] 다운로드된 데이터가 없습니다.")
        return

    # 3. 데이터 정리
    df = clean_dataframe(df)

    # 4. CSV 저장
    output_file = "업무추진비_전체데이터.csv"
    success = save_to_csv(df, output_file)

    if success:
        print("\n" + "=" * 80)
        print("[OK] 작업 완료!")
        print("=" * 80)
        print(f"파일 저장 위치: {os.path.abspath(output_file)}")
    else:
        print("\n[ERROR] 작업 실패")

if __name__ == "__main__":
    main()
