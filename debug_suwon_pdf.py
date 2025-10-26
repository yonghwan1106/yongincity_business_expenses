import PyPDF2
import re

pdf_path = "data/수원시장_업무추진비/0-수원시장(2025.9월).pdf"

print(f"PDF 파일 분석: {pdf_path}\n")

try:
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        print(f"총 페이지 수: {len(pdf_reader.pages)}\n")

        all_text = ""
        for i, page in enumerate(pdf_reader.pages):
            try:
                text = page.extract_text()
                if text:
                    all_text += text
                    print(f"=== 페이지 {i+1} ===")
                    # 숫자 패턴 찾기
                    numbers = re.findall(r'[0-9,]{7,}', text)
                    print(f"발견된 큰 숫자들: {numbers}")
                    print(text[:1000])
                    print("\n" + "="*50 + "\n")
            except Exception as e:
                print(f"페이지 {i+1} 오류: {e}")

        # 전체 텍스트에서 합계 패턴 찾기
        print("\n=== 전체 텍스트에서 찾은 큰 숫자들 ===")
        all_numbers = re.findall(r'[0-9,]{7,}', all_text)
        for num in all_numbers:
            amount_str = num.replace(',', '')
            if amount_str.isdigit():
                amount = int(amount_str)
                if 1000000 <= amount <= 100000000:
                    print(f"{num} -> {amount:,}원")

except Exception as e:
    print(f"Error: {e}")
