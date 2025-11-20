import pandas as pd
import sys
import re

# 인코딩 설정
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def normalize_date(date_str):
    """날짜 형식 정규화: YYYY-MM-DD 형식으로 통일"""
    if pd.isna(date_str) or date_str == '':
        return ''

    date_str = str(date_str).strip()

    # 점(.) 형식을 하이픈(-) 형식으로 변환
    # 2025.10.02. 14:07 -> 2025-10-02 14:07
    date_str = re.sub(r'(\d{4})\.(\d{1,2})\.(\d{1,2})\.?\s*', r'\1-\2-\3 ', date_str)

    # 월과 일이 한 자리수인 경우 0 패딩
    match = re.match(r'(\d{4})-(\d{1,2})-(\d{1,2})(.*)', date_str)
    if match:
        year, month, day, rest = match.groups()
        date_str = f"{year}-{month.zfill(2)}-{day.zfill(2)}{rest}"

    return date_str.strip()

def normalize_category(category_str):
    """비목 정규화: 시책 -> 시책추진비, 기관 -> 기관운영비"""
    if pd.isna(category_str) or category_str == '':
        return ''

    category_str = str(category_str).strip()

    # 매핑
    category_map = {
        '시책': '시책추진비',
        '기관': '기관운영비'
    }

    return category_map.get(category_str, category_str)

def main():
    csv_file = r"C:\Users\pyh\yongincity_business_expenses\data\용인시장_업무추진비_전체_2022-2025.csv"

    print("=" * 80)
    print("CSV 데이터 정규화")
    print("=" * 80)

    # CSV 읽기
    print("\n1. CSV 파일 읽기...")
    df = pd.read_csv(csv_file, encoding='utf-8-sig')
    print(f"   총 {len(df)}건")

    # 날짜 형식 정규화
    print("\n2. 날짜 형식 정규화 중...")
    df['사용일시'] = df['사용일시'].apply(normalize_date)

    # 비목 정규화
    print("\n3. 비목 정규화 중...")
    original_categories = df['비목'].value_counts()
    print("   원본 비목 분포:")
    print(original_categories)

    df['비목'] = df['비목'].apply(normalize_category)

    new_categories = df['비목'].value_counts()
    print("\n   정규화 후 비목 분포:")
    print(new_categories)

    # 날짜별 정렬
    print("\n4. 날짜순 정렬 중...")
    df = df.sort_values('사용일시')

    # 번호 재정렬
    df['번호'] = range(1, len(df) + 1)

    # 저장
    print("\n5. CSV 파일 저장 중...")
    df.to_csv(csv_file, index=False, encoding='utf-8-sig')
    print(f"   저장 완료: {csv_file}")

    # 10월 데이터 확인
    print("\n" + "=" * 80)
    print("2025년 10월 데이터 확인")
    print("=" * 80)
    october_data = df[df['사용일시'].str.contains('2025-10', na=False)]
    print(f"총 {len(october_data)}건")
    print(f"날짜 범위: {october_data['사용일시'].min()} ~ {october_data['사용일시'].max()}")
    print(f"총 금액: {october_data['사용금액'].sum():,}원")

    # 비목별 통계
    print("\n비목별 분포:")
    print(october_data['비목'].value_counts())

    print("\n" + "=" * 80)
    print("완료!")
    print("=" * 80)

if __name__ == "__main__":
    main()
