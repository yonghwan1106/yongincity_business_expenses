import os
import re
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
from pathlib import Path
import PyPDF2

# 한글 폰트 설정
plt.rcParams['font.family'] = 'Malgun Gothic'
plt.rcParams['axes.unicode_minus'] = False

def extract_month_year_from_filename(filename):
    """파일명에서 년월 추출"""
    # 2024년 9월, 2025년 1월 등의 패턴
    match = re.search(r'(\d{4})년?[_\s]*(\d{1,2})월', filename)
    if match:
        year = int(match.group(1))
        month = int(match.group(2))
        return year, month

    # (2024.9월) 패턴
    match = re.search(r'\((\d{4})\.(\d{1,2})월\)', filename)
    if match:
        year = int(match.group(1))
        month = int(match.group(2))
        return year, month

    # (9월) 패턴 - 2024년으로 간주
    match = re.search(r'\((\d{1,2})월\)', filename)
    if match:
        month = int(match.group(1))
        # 9-12월은 2024년, 1-8월은 2025년
        year = 2024 if month >= 9 else 2025
        return year, month

    return None, None

def extract_total_from_pdf(pdf_path):
    """PDF에서 합계 금액 추출"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                try:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text
                except:
                    continue

            # 방법 1: 합계 금액 직접 찾기 (고양시장 등)
            patterns = [
                r'총\s*집행내역.*?([0-9,]+)',  # 고양시장 패턴
                r'합\s*계[:\s]+([0-9,]+)',
                r'합계[:\s]+([0-9,]+)',
                r'총\s*계[:\s]+([0-9,]+)',
            ]

            for pattern in patterns:
                matches = re.findall(pattern, text)
                if matches:
                    for match in reversed(matches):
                        amount_str = match.replace(',', '').strip()
                        if amount_str.isdigit():
                            amount = int(amount_str)
                            if 1000000 <= amount <= 100000000:
                                return amount

            # 방법 2: 개별 항목 금액을 모두 합산 (수원시장 등)
            # 날짜 패턴 다음에 나오는 금액들을 찾기
            # 예: 2025-09-01 12:20 ... 169,200 5 카드
            item_pattern = r'\d{4}-\d{2}-\d{2}\s+\d{1,2}:\d{2}.*?([0-9,]+)\s+\d+\s+카드'
            item_amounts = re.findall(item_pattern, text)

            if item_amounts:
                total = 0
                for amount_str in item_amounts:
                    amount_str = amount_str.replace(',', '').strip()
                    if amount_str.isdigit():
                        total += int(amount_str)

                if total > 0:
                    return total

            # 방법 3: 큰 금액 숫자 찾기 (마지막 수단)
            big_numbers = re.findall(r'([0-9,]{7,})', text)
            for match in reversed(big_numbers):
                amount_str = match.replace(',', '').strip()
                if amount_str.isdigit():
                    amount = int(amount_str)
                    if 1000000 <= amount <= 100000000:
                        return amount

    except Exception as e:
        print(f"Error processing {pdf_path}: {e}")

    return None

def analyze_mayor_expenses(data_folder):
    """시장별 업무추진비 분석"""
    base_path = Path(data_folder)

    # 각 시장별 데이터 저장
    mayors_data = {
        '용인시장': [],
        '고양시장': [],
        '수원시장': []
    }

    # 용인시장 데이터 - 웹사이트의 정확한 데이터 사용 (만원 단위)
    yongin_amounts = [2185, 1097, 1717, 2073, 2525, 1556, 1282, 1690, 1380, 1198, 1159, 1842, 1377]
    yongin_months = [
        (2024, 9), (2024, 10), (2024, 11), (2024, 12),
        (2025, 1), (2025, 2), (2025, 3), (2025, 4), (2025, 5), (2025, 6),
        (2025, 7), (2025, 8), (2025, 9)
    ]

    print("\n용인시장 데이터 (웹사이트 정확한 수치):")
    for (year, month), amount_10k in zip(yongin_months, yongin_amounts):
        amount = amount_10k * 10000  # 만원을 원으로 변환
        mayors_data['용인시장'].append({
            'year': year,
            'month': month,
            'amount': amount,
            'filename': 'website_data'
        })
        print(f"용인시장 {year}년 {month}월: {amount:,}원 ({amount_10k}만원)")

    # 고양시장, 수원시장 폴더 처리 (PDF)
    for mayor_name in ['고양시장', '수원시장']:
        folder_path = base_path / f"{mayor_name}_업무추진비"

        if not folder_path.exists():
            print(f"{folder_path} 폴더가 존재하지 않습니다.")
            continue

        # PDF 파일 찾기
        pdf_files = list(folder_path.glob('*.pdf'))

        for pdf_file in pdf_files:
            year, month = extract_month_year_from_filename(pdf_file.name)

            if year and month:
                # PDF에서 합계 추출
                total = extract_total_from_pdf(pdf_file)

                if total:
                    mayors_data[mayor_name].append({
                        'year': year,
                        'month': month,
                        'amount': total,
                        'filename': pdf_file.name
                    })
                    print(f"{mayor_name} {year}년 {month}월: {total:,}원 - {pdf_file.name}")
                else:
                    print(f"금액 추출 실패: {pdf_file.name}")

    return mayors_data

def create_charts(mayors_data, output_folder='charts'):
    """도표 생성"""
    Path(output_folder).mkdir(exist_ok=True)

    # 데이터프레임으로 변환
    all_data = []
    for mayor_name, data in mayors_data.items():
        for item in data:
            all_data.append({
                '시장': mayor_name,
                '년': item['year'],
                '월': item['month'],
                '금액': item['amount']
            })

    df = pd.DataFrame(all_data)

    if df.empty:
        print("데이터가 없습니다!")
        return

    # 년월 컬럼 추가 (정렬용)
    df['년월'] = pd.to_datetime(df['년'].astype(str) + '-' + df['월'].astype(str).str.zfill(2))
    df = df.sort_values('년월')
    df['년월_str'] = df['년월'].dt.strftime('%Y-%m')

    # 1. 시장별 월별 추이 (라인 차트)
    plt.figure(figsize=(16, 8))
    for mayor in df['시장'].unique():
        mayor_df = df[df['시장'] == mayor].sort_values('년월')
        plt.plot(mayor_df['년월_str'], mayor_df['금액'] / 1000000,
                marker='o', label=mayor, linewidth=2, markersize=8)

    plt.xlabel('년월', fontsize=12)
    plt.ylabel('금액 (백만원)', fontsize=12)
    plt.title('시장별 월별 업무추진비 추이 (2024.9 ~ 2025.9)', fontsize=16, fontweight='bold')
    plt.legend(fontsize=12)
    plt.grid(True, alpha=0.3)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig(f'{output_folder}/월별_추이.png', dpi=300, bbox_inches='tight')
    print(f"저장됨: {output_folder}/월별_추이.png")
    plt.close()

    # 2. 시장별 총 합계 (막대 차트)
    plt.figure(figsize=(10, 8))
    totals = df.groupby('시장')['금액'].sum().sort_values(ascending=False)
    colors = ['#FF6B6B', '#4ECDC4', '#45B7D1']
    bars = plt.bar(totals.index, totals.values / 1000000, color=colors, alpha=0.8, edgecolor='black')

    # 막대 위에 값 표시
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.1f}백만원',
                ha='center', va='bottom', fontsize=11, fontweight='bold')

    plt.xlabel('시장', fontsize=12)
    plt.ylabel('총 금액 (백만원)', fontsize=12)
    plt.title('시장별 총 업무추진비 (2024.9 ~ 2025.9)', fontsize=16, fontweight='bold')
    plt.grid(True, alpha=0.3, axis='y')
    plt.tight_layout()
    plt.savefig(f'{output_folder}/시장별_총합계.png', dpi=300, bbox_inches='tight')
    print(f"저장됨: {output_folder}/시장별_총합계.png")
    plt.close()

    # 3. 월별 비교 (그룹 막대 차트)
    pivot_df = df.pivot_table(values='금액', index='년월_str', columns='시장', aggfunc='sum')

    plt.figure(figsize=(16, 8))
    pivot_df.plot(kind='bar', figsize=(16, 8), width=0.8, edgecolor='black')
    plt.xlabel('년월', fontsize=12)
    plt.ylabel('금액 (원)', fontsize=12)
    plt.title('월별 시장 업무추진비 비교', fontsize=16, fontweight='bold')
    plt.legend(title='시장', fontsize=11)
    plt.grid(True, alpha=0.3, axis='y')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig(f'{output_folder}/월별_비교.png', dpi=300, bbox_inches='tight')
    print(f"저장됨: {output_folder}/월별_비교.png")
    plt.close()

    # 4. 통계 테이블 생성
    print("\n=== 시장별 통계 ===")
    stats_df = df.groupby('시장')['금액'].agg([
        ('총액', 'sum'),
        ('평균', 'mean'),
        ('최대', 'max'),
        ('최소', 'min'),
        ('월수', 'count')
    ])
    print(stats_df)

    # 통계를 CSV로 저장
    stats_df.to_csv(f'{output_folder}/통계_요약.csv', encoding='utf-8-sig')
    print(f"\n저장됨: {output_folder}/통계_요약.csv")

    # 전체 데이터를 CSV로 저장
    df_export = df[['시장', '년', '월', '금액', '년월_str']].copy()
    df_export.to_csv(f'{output_folder}/전체_데이터.csv', encoding='utf-8-sig', index=False)
    print(f"저장됨: {output_folder}/전체_데이터.csv")

if __name__ == "__main__":
    # 데이터 폴더 경로
    data_folder = "data"

    print("=== 업무추진비 데이터 분석 시작 ===\n")

    # 데이터 분석
    mayors_data = analyze_mayor_expenses(data_folder)

    # 도표 생성
    print("\n=== 도표 생성 중 ===\n")
    create_charts(mayors_data)

    print("\n=== 분석 완료 ===")
