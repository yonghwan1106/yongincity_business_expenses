export interface ExpenseRecord {
  번호: number
  사용자: string
  사용일시: string
  사용장소: string
  집행목적: string
  대상인원: number | string
  사용금액: number
  결제방법: string
  비목: string
  비고?: string
}

export interface MonthlyStatistics {
  month: string
  건수: number
  금액: number
  주요내역: string[]
}

export interface CategoryStatistics {
  category: string
  금액: number
  건수: number
  비율: number
}

export interface DashboardData {
  총액: number
  총건수: number
  월평균: number
  전년대비증감률?: number
  월별통계: MonthlyStatistics[]
  분야별통계: CategoryStatistics[]
  최근내역: ExpenseRecord[]
}

export interface FilterOptions {
  dateRange: {
    start: string | null
    end: string | null
  }
  category: string
  minAmount: number
  maxAmount: number
  keyword: string
}
