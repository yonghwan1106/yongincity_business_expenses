import pandas as pd
import sys

# 인코딩 설정
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def main():
    # 파일 경로
    main_csv = r"C:\Users\pyh\yongincity_business_expenses\data\용인시장_업무추진비_전체_2022-2025.csv"
    october_csv = r"C:\Users\pyh\yongincity_business_expenses\data\용인시장_업무추진비\시장 업무추진비 집행내역(2025년 10월).csv"
    output_csv = r"C:\Users\pyh\yongincity_business_expenses\data\용인시장_업무추진비_전체_2022-2025.csv"

    print("=" * 80)
    print("CSV 파일 병합: 기존 데이터 + 2025년 10월")
    print("=" * 80)

    # 1. 기존 CSV 읽기
    print("\n1. 기존 CSV 파일 읽기...")
    df_main = pd.read_csv(main_csv, encoding='utf-8-sig')
    print(f"   기존 데이터: {len(df_main)}건")
    print(f"   마지막 날짜: {df_main['사용일시'].iloc[-1]}")

    # 2. 10월 CSV 읽기
    print("\n2. 2025년 10월 CSV 파일 읽기...")
    df_october = pd.read_csv(october_csv, encoding='utf-8-sig')
    print(f"   10월 데이터: {len(df_october)}건")

    # 10월 데이터의 번호 열 제거 (나중에 다시 매김)
    if '번호' in df_october.columns:
        df_october = df_october.drop(columns=['번호'])

    # 3. 데이터 병합
    print("\n3. 데이터 병합 중...")
    df_combined = pd.concat([df_main, df_october], ignore_index=True)

    # 4. 번호 재정렬 (1부터 시작)
    df_combined['번호'] = range(1, len(df_combined) + 1)

    # 5. 컬럼 순서 맞추기
    columns_order = ['번호', '사용자', '사용일시', '사용장소', '집행목적', '대상인원', '사용금액', '결제방법', '비목', '비고']
    df_combined = df_combined[columns_order]

    # 6. 통계 출력
    print("\n" + "=" * 80)
    print("병합 결과")
    print("=" * 80)
    print(f"총 건수: {len(df_combined)}건")
    print(f"총 금액: {df_combined['사용금액'].sum():,}원")

    # 날짜 범위 확인
    dates = df_combined['사용일시'].dropna()
    print(f"날짜 범위: {dates.min()} ~ {dates.max()}")

    # 10월 데이터만 필터링해서 확인
    october_data = df_combined[df_combined['사용일시'].str.contains('2025-10', na=False)]
    print(f"\n2025년 10월 데이터: {len(october_data)}건, {october_data['사용금액'].sum():,}원")

    # 7. CSV 파일로 저장
    print("\n4. CSV 파일 저장 중...")
    df_combined.to_csv(output_csv, index=False, encoding='utf-8-sig')
    print(f"   저장 완료: {output_csv}")

    # 8. 마지막 10개 행 미리보기
    print("\n" + "=" * 80)
    print("마지막 10개 행 미리보기")
    print("=" * 80)
    print(df_combined.tail(10).to_string(index=False))

if __name__ == "__main__":
    main()
