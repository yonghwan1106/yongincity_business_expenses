import { ExpenseRecord } from '@/types'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

/**
 * CSV 파일에서 업무추진비 데이터 로드
 * 2022.7.1 ~ 2025.10.31 전체 데이터
 */
export async function fetchExpenseDataFromCSV(): Promise<ExpenseRecord[]> {
  try {
    const csvPath = path.join(process.cwd(), 'data', '용인시장_업무추진비_전체_2022-2025.csv')

    // CSV 파일 읽기
    const fileContent = fs.readFileSync(csvPath, 'utf-8')

    // CSV 파싱
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      bom: true, // UTF-8 BOM 처리
    })

    // ExpenseRecord 타입으로 변환
    const expenses: ExpenseRecord[] = records.map((row: any) => {
      return {
        번호: parseInt(row['번호']) || 0,
        사용자: row['사용자'] || '용인시장',
        사용일시: row['사용일시'] || '',
        사용장소: row['사용장소'] || '',
        집행목적: row['집행목적'] || '',
        대상인원: parsePersonnel(row['대상인원']),
        사용금액: parseInt(row['사용금액']) || 0,
        결제방법: row['결제방법'] || '',
        비목: row['비목'] || '',
        비고: row['비고'] || '',
      }
    })

    // 날짜순 정렬
    expenses.sort((a, b) => a.사용일시.localeCompare(b.사용일시))

    console.log(`✓ CSV 파일에서 ${expenses.length}건의 데이터 로드 완료`)

    return expenses
  } catch (error) {
    console.error('CSV 파일 로드 오류:', error)
    throw new Error(`Failed to load CSV: ${error}`)
  }
}

function parsePersonnel(value: string | number): number | string {
  if (!value || value === '') return 0
  if (value === '-') return '-'

  const num = parseInt(String(value))
  return isNaN(num) ? 0 : num
}
