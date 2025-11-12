#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
날짜 오류 수정 스크립트 V3
모든 날짜 입력 오류를 정확히 수정 (8개 패턴)
"""

import csv
import re

INPUT_CSV = 'C:/Users/user/yongincity_business_expenses/data/용인시장_업무추진비_전체_2022-2025.csv'
OUTPUT_CSV = 'C:/Users/user/yongincity_business_expenses/data/용인시장_업무추진비_전체_2022-2025.csv'

print("날짜 오류 완전 수정 시작...")
print("=" * 60)

# CSV 읽기
with open(INPUT_CSV, 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    records = list(reader)

print(f"총 {len(records)}건의 레코드 로드\n")

# 날짜 수정
fixed_count = 0
for record in records:
    original_date = record['사용일시']
    fixed = False

    # 패턴 1: 2023-的-02 → 2023-12-02 (중국어 적/的 = 12월)
    if original_date.startswith('2023-的-') or original_date.startswith('2023-적-'):
        record['사용일시'] = original_date.replace('2023-的-', '2023-12-').replace('2023-적-', '2023-12-')
        print(f"[패턴1] {original_date:30s} → {record['사용일시']}")
        fixed = True

    # 패턴 2: 2O23-OB-O9 → 2023-08-09 (O/0 혼동, B/8 혼동)
    elif original_date.startswith('2O23-OB-'):
        record['사용일시'] = original_date.replace('2O23-OB-O', '2023-08-0')
        print(f"[패턴2] {original_date:30s} → {record['사용일시']}")
        fixed = True

    # 패턴 3: 2023-00-23 → 2023-08-23 (00 → 08)
    elif original_date.startswith('2023-00-'):
        record['사용일시'] = original_date.replace('2023-00-', '2023-08-')
        print(f"[패턴3] {original_date:30s} → {record['사용일시']}")
        fixed = True

    # 패턴 4: 2023-0B-29 → 2023-08-29 (0B → 08)
    elif original_date.startswith('2023-0B-'):
        record['사용일시'] = original_date.replace('2023-0B-', '2023-08-')
        print(f"[패턴4] {original_date:30s} → {record['사용일시']}")
        fixed = True

    # 패턴 5: 2024-敗-07 → 2024-02-07 (중국어 패/敗 오타, Sheet30은 2월)
    elif original_date.startswith('2024-敗-') or original_date.startswith('2024-败-'):
        record['사용일시'] = original_date.replace('2024-敗-', '2024-02-').replace('2024-败-', '2024-02-')
        print(f"[패턴5] {original_date:30s} → {record['사용일시']}")
        fixed = True

    # 패턴 6: 2022-10월3 1028 → 2022-10-03 (한글 월, 공백, 중복 숫자)
    elif re.match(r'^2022-10월3\s+1028', original_date):
        record['사용일시'] = '2022-10-03'
        print(f"[패턴6] {original_date:30s} → {record['사용일시']}")
        fixed = True

    # 패턴 7: 2022-11 -23 19:53 → 2022-11-23 19:53 (공백 제거)
    elif re.match(r'^2022-11\s+-23', original_date):
        record['사용일시'] = original_date.replace('2022-11 -', '2022-11-')
        print(f"[패턴7] {original_date:30s} → {record['사용일시']}")
        fixed = True

    # 패턴 8: 2024-1 1-22 15:53:02 → 2024-11-22 15:53:02 (공백 제거, 1 1 → 11)
    elif re.match(r'^2024-1\s+1-22', original_date):
        record['사용일시'] = original_date.replace('2024-1 1-', '2024-11-')
        print(f"[패턴8] {original_date:30s} → {record['사용일시']}")
        fixed = True

    if fixed:
        fixed_count += 1

print(f"\n총 {fixed_count}건의 날짜 수정 완료")

# 수정된 CSV 저장
with open(OUTPUT_CSV, 'w', encoding='utf-8-sig', newline='') as f:
    fieldnames = ['번호', '사용자', '사용일시', '사용장소', '집행목적', '대상인원', '사용금액', '결제방법', '비목', '비고']
    writer = csv.DictWriter(f, fieldnames=fieldnames)

    writer.writeheader()
    for record in records:
        writer.writerow(record)

print(f"\n수정된 파일 저장: {OUTPUT_CSV}")

# 여전히 이상한 날짜 확인
print(f"\n{'=' * 60}")
print("수정 후 남아있는 이상한 날짜 확인:\n")

strange_dates = []
for r in records:
    date = r['사용일시']
    # 이상한 패턴 찾기: YYYY-MM-DD 형식이 아닌 것
    if not re.match(r'^20\d{2}-\d{2}-\d{2}', date):
        strange_dates.append(r)

if strange_dates:
    print(f"[WARNING] 여전히 이상한 날짜: {len(strange_dates)}건")
    for r in strange_dates[:10]:
        print(f"  {r['사용일시'][:30]:30s} | {int(r['사용금액']):>10,}원 | {r['집행목적'][:30]}")
else:
    print("[OK] 모든 날짜가 정상적으로 수정되었습니다!")

print(f"{'=' * 60}")
print("완료!")
