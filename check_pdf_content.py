import PyPDF2
import sys

pdf_path = sys.argv[1] if len(sys.argv) > 1 else "data/용인시장_업무추진비/시장 업무추진비 집행내역(2025년 9월).pdf"

print(f"PDF 파일 분석: {pdf_path}\n")

try:
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        print(f"총 페이지 수: {len(pdf_reader.pages)}\n")

        for i, page in enumerate(pdf_reader.pages):
            text = page.extract_text()
            print(f"=== 페이지 {i+1} ===")
            print(text[:2000])  # 처음 2000자만 출력
            print("\n" + "="*50 + "\n")

            if i >= 2:  # 처음 3페이지만 확인
                break
except Exception as e:
    print(f"Error: {e}")
