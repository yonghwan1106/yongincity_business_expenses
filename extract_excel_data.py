import pandas as pd
import os
import sys

# 인코딩 설정
sys.stdout.reconfigure(encoding='utf-8')

# Excel 파일 경로
docs_folder = "docs"
file1 = os.path.join(docs_folder, "시장 업무추진비 집행내역(2025년 9월).xlsx")
file2 = os.path.join(docs_folder, "시장 업무추진비 집행내역(2024.9.1.~2025.8.31.).xlsx")

# 데이터를 저장할 리스트
all_data = []

def clean_amount(value):
    """금액 데이터 정리 (쉼표 제거, 숫자로 변환)"""
    if pd.isna(value):
        return 0
    if isinstance(value, (int, float)):
        return int(value)
    # 문자열인 경우 쉼표 제거 후 숫자로 변환
    str_value = str(value).replace(',', '').replace('원', '').strip()
    # 숫자가 아닌 경우 0 반환
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
                print(f"헤더 내용: {row_values[:10]}")  # 처음 10개 값만
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

        # 빈 행 제거 및 요약 행 제거 (예: "47건", "40건" 같은 요약 행)
        df = df.dropna(how='all')

        # 첫 번째 컬럼(연번/번호)이 숫자인 행만 유지
        first_col = df.columns[0]
        df = df[pd.to_numeric(df[first_col], errors='coerce').notna()]

        print(f"총 {len(df)}개의 유효한 데이터 행을 찾았습니다.")
        print(f"컬럼: {headers[:10]}")  # 처음 10개만

        # 첫 5행 출력
        print("\n첫 5행 미리보기:")
        print(df.head().to_string())

        return df
    except Exception as e:
        print(f"오류 발생: {e}")
        import traceback
        traceback.print_exc()
        return None

# 파일 1 읽기 (2025년 9월)
print("=" * 80)
print("파일 1: 2025년 9월 데이터")
print("=" * 80)
df1 = read_excel_file(file1)

# 파일 2 읽기 (2024.9.1~2025.8.31)
print("\n" + "=" * 80)
print("파일 2: 2024.9.1~2025.8.31 데이터")
print("=" * 80)
df2 = read_excel_file(file2)

def extract_main_columns(df):
    """주요 컬럼만 추출하고 표준화"""
    # 필요한 컬럼 찾기
    column_map = {}

    for col in df.columns:
        if pd.isna(col):
            continue
        col_str = str(col).strip()

        if '연번' in col_str:
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

    # 매핑된 컬럼만 추출
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

# 두 데이터프레임 결합
if df1 is not None and df2 is not None:
    print("\n데이터 결합 및 정리 중...")

    # 주요 컬럼만 추출
    print("\ndf1 컬럼 추출 중...")
    df1_clean = extract_main_columns(df1)

    print("\ndf2 컬럼 추출 중...")
    df2_clean = extract_main_columns(df2)

    print(f"\ndf1 최종 컬럼: {list(df1_clean.columns)}")
    print(f"df2 최종 컬럼: {list(df2_clean.columns)}")

    # 모든 데이터 결합
    combined_df = pd.concat([df2_clean, df1_clean], ignore_index=True)

    print(f"\n총 {len(combined_df)}개의 레코드가 결합되었습니다.")

    # 필수 컬럼 확인 (없는 컬럼은 빈 값으로)
    required_columns = ['번호', '사용자', '사용일시', '사용장소', '집행목적',
                       '대상인원', '사용금액', '결제방법', '비목', '비고']

    for col in required_columns:
        if col not in combined_df.columns:
            combined_df[col] = ''

    # 필요한 컬럼만 선택
    combined_df = combined_df[required_columns]

    # 빈 행 제거 (금액이 0이거나 없는 행)
    combined_df = combined_df[combined_df['사용금액'].notna()]
    combined_df = combined_df[combined_df['사용금액'] != '']

    # 데이터 정리
    print("\n데이터 정리 중...")
    combined_df['사용금액'] = combined_df['사용금액'].apply(clean_amount)
    combined_df['대상인원'] = combined_df['대상인원'].apply(clean_people_count)

    # 금액이 0인 행 제거
    combined_df = combined_df[combined_df['사용금액'] > 0]

    # 번호 재정렬 (1부터 시작)
    combined_df['번호'] = range(1, len(combined_df) + 1)

    # 빈 값 처리
    combined_df = combined_df.fillna('')

    # CSV 파일로 저장
    output_file = "업무추진비_전체데이터.csv"
    combined_df.to_csv(output_file, index=False, encoding='utf-8-sig')

    print(f"\n✅ CSV 파일이 생성되었습니다: {output_file}")
    print(f"총 레코드 수: {len(combined_df)}")

    # 통계 출력
    print("\n" + "=" * 80)
    print("데이터 통계")
    print("=" * 80)
    total_amount = combined_df['사용금액'].sum()
    print(f"총 집행액: {total_amount:,}원")
    print(f"총 건수: {len(combined_df)}건")
    if len(combined_df) > 0:
        print(f"평균 집행액: {total_amount/len(combined_df):,.0f}원")
    else:
        print("평균 집행액: 0원 (데이터 없음)")

    # 비목별 통계
    if '비목' in combined_df.columns and combined_df['비목'].notna().any():
        print("\n비목별 집행 현황:")
        category_stats = combined_df.groupby('비목').agg({
            '사용금액': ['sum', 'count']
        }).round(0)
        print(category_stats)

    # 첫 10개 레코드 미리보기
    print("\n" + "=" * 80)
    print("첫 10개 레코드 미리보기")
    print("=" * 80)
    pd.set_option('display.max_columns', None)
    pd.set_option('display.width', None)
    pd.set_option('display.max_colwidth', 30)
    print(combined_df.head(10).to_string(index=False))

    print("\n" + "=" * 80)
    print("마지막 5개 레코드 미리보기")
    print("=" * 80)
    print(combined_df.tail(5).to_string(index=False))
else:
    print("❌ 파일을 읽는 데 실패했습니다.")
