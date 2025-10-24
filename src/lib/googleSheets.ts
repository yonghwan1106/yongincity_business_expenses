import { google } from 'googleapis'
import { ExpenseRecord } from '@/types'

// Google Sheets API 설정
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

const sheets = google.sheets({ version: 'v4', auth })

// 스프레드시트 ID와 범위
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID
const RANGE = 'Sheet1!A2:J' // 헤더 제외, A부터 J열까지

/**
 * Google Sheets에서 데이터 가져오기
 */
export async function fetchExpenseData(): Promise<ExpenseRecord[]> {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('GOOGLE_SPREADSHEET_ID is not defined')
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    })

    const rows = response.data.values

    if (!rows || rows.length === 0) {
      return []
    }

    // 데이터 변환
    const expenses: ExpenseRecord[] = rows.map((row) => ({
      번호: parseInt(row[0]) || 0,
      사용자: row[1] || '',
      사용일시: row[2] || '',
      사용장소: row[3] || '',
      집행목적: row[4] || '',
      대상인원: row[5] ? (row[5] === '-' ? '-' : parseInt(row[5])) : 0,
      사용금액: parseInt(row[6]?.replace(/,/g, '')) || 0,
      결제방법: row[7] || '',
      비목: row[8] || '',
      비고: row[9] || '',
    }))

    return expenses
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error)
    throw error
  }
}

/**
 * 월별 데이터 그룹화
 */
export function groupByMonth(data: ExpenseRecord[]) {
  const grouped = data.reduce((acc, record) => {
    // 날짜에서 년-월 추출
    const date = record.사용일시
    const month = date.substring(0, 7) // 'YYYY-MM' 형식

    if (!acc[month]) {
      acc[month] = {
        month,
        건수: 0,
        금액: 0,
        records: []
      }
    }

    acc[month].건수++
    acc[month].금액 += record.사용금액
    acc[month].records.push(record)

    return acc
  }, {} as Record<string, any>)

  return Object.values(grouped).sort((a: any, b: any) =>
    a.month.localeCompare(b.month)
  )
}

/**
 * 비목별 데이터 그룹화
 */
export function groupByCategory(data: ExpenseRecord[]) {
  const grouped = data.reduce((acc, record) => {
    const category = record.비목

    if (!acc[category]) {
      acc[category] = {
        category,
        금액: 0,
        건수: 0,
      }
    }

    acc[category].금액 += record.사용금액
    acc[category].건수++

    return acc
  }, {} as Record<string, any>)

  const result = Object.values(grouped)
  const total = result.reduce((sum: number, item: any) => sum + item.금액, 0)

  return result.map((item: any) => ({
    ...item,
    비율: (item.금액 / total) * 100
  }))
}

/**
 * 사용장소별 데이터 그룹화 (상위 N개)
 */
export function groupByLocation(data: ExpenseRecord[], topN: number = 10) {
  const grouped = data.reduce((acc, record) => {
    const location = record.사용장소 || '기타'

    if (!acc[location]) {
      acc[location] = {
        location,
        금액: 0,
        건수: 0,
      }
    }

    acc[location].금액 += record.사용금액
    acc[location].건수++

    return acc
  }, {} as Record<string, any>)

  return Object.values(grouped)
    .sort((a: any, b: any) => b.금액 - a.금액)
    .slice(0, topN)
}

/**
 * 결제방법별 데이터 그룹화
 */
export function groupByPaymentMethod(data: ExpenseRecord[]) {
  const grouped = data.reduce((acc, record) => {
    const method = record.결제방법 || '기타'

    if (!acc[method]) {
      acc[method] = {
        method,
        금액: 0,
        건수: 0,
      }
    }

    acc[method].금액 += record.사용금액
    acc[method].건수++

    return acc
  }, {} as Record<string, any>)

  return Object.values(grouped).sort((a: any, b: any) => b.금액 - a.금액)
}
