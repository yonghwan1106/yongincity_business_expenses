// 3개 시장 업무추진비 비교 데이터
export interface MayorMonthlyData {
  year: number
  month: number
  amount: number
  yearMonth: string
}

export interface MayorData {
  name: string
  color: string
  monthlyData: MayorMonthlyData[]
  total: number
  average: number
  max: number
  min: number
}

// 웹사이트의 정확한 용인시장 데이터 (만원 단위를 원으로 변환)
const yonginAmounts = [2185, 1097, 1717, 2073, 2525, 1556, 1282, 1690, 1380, 1198, 1159, 1842, 1377]
const yonginMonthly: MayorMonthlyData[] = [
  { year: 2024, month: 9, amount: 21850000, yearMonth: '2024-09' },
  { year: 2024, month: 10, amount: 10970000, yearMonth: '2024-10' },
  { year: 2024, month: 11, amount: 17170000, yearMonth: '2024-11' },
  { year: 2024, month: 12, amount: 20730000, yearMonth: '2024-12' },
  { year: 2025, month: 1, amount: 25250000, yearMonth: '2025-01' },
  { year: 2025, month: 2, amount: 15560000, yearMonth: '2025-02' },
  { year: 2025, month: 3, amount: 12820000, yearMonth: '2025-03' },
  { year: 2025, month: 4, amount: 16900000, yearMonth: '2025-04' },
  { year: 2025, month: 5, amount: 13800000, yearMonth: '2025-05' },
  { year: 2025, month: 6, amount: 11980000, yearMonth: '2025-06' },
  { year: 2025, month: 7, amount: 11590000, yearMonth: '2025-07' },
  { year: 2025, month: 8, amount: 18420000, yearMonth: '2025-08' },
  { year: 2025, month: 9, amount: 13770000, yearMonth: '2025-09' },
]

// 고양시장 데이터
const goyangMonthly: MayorMonthlyData[] = [
  { year: 2024, month: 9, amount: 13855010, yearMonth: '2024-09' },
  { year: 2024, month: 10, amount: 17832230, yearMonth: '2024-10' },
  { year: 2024, month: 11, amount: 16355420, yearMonth: '2024-11' },
  { year: 2024, month: 12, amount: 9133550, yearMonth: '2024-12' },
  { year: 2025, month: 1, amount: 10030580, yearMonth: '2025-01' },
  { year: 2025, month: 2, amount: 8075460, yearMonth: '2025-02' },
  { year: 2025, month: 3, amount: 7055200, yearMonth: '2025-03' },
  { year: 2025, month: 4, amount: 6808720, yearMonth: '2025-04' },
  { year: 2025, month: 5, amount: 9447020, yearMonth: '2025-05' },
  { year: 2025, month: 6, amount: 11901700, yearMonth: '2025-06' },
  { year: 2025, month: 7, amount: 5374100, yearMonth: '2025-07' },
  { year: 2025, month: 8, amount: 4122800, yearMonth: '2025-08' },
  { year: 2025, month: 9, amount: 3616850, yearMonth: '2025-09' },
]

// 수원시장 데이터
const suwonMonthly: MayorMonthlyData[] = [
  { year: 2024, month: 9, amount: 8043000, yearMonth: '2024-09' },
  { year: 2024, month: 10, amount: 9766000, yearMonth: '2024-10' },
  { year: 2024, month: 11, amount: 7310000, yearMonth: '2024-11' },
  { year: 2024, month: 12, amount: 10295000, yearMonth: '2024-12' },
  { year: 2025, month: 1, amount: 11776000, yearMonth: '2025-01' },
  { year: 2025, month: 2, amount: 11325000, yearMonth: '2025-02' },
  { year: 2025, month: 3, amount: 12758000, yearMonth: '2025-03' },
  { year: 2025, month: 4, amount: 11699000, yearMonth: '2025-04' },
  { year: 2025, month: 5, amount: 10885000, yearMonth: '2025-05' },
  { year: 2025, month: 6, amount: 8257000, yearMonth: '2025-06' },
  { year: 2025, month: 7, amount: 10280000, yearMonth: '2025-07' },
  { year: 2025, month: 8, amount: 6480000, yearMonth: '2025-08' },
  { year: 2025, month: 9, amount: 9289000, yearMonth: '2025-09' },
]

// 통계 계산 함수
function calculateStats(data: MayorMonthlyData[]) {
  const total = data.reduce((sum, item) => sum + item.amount, 0)
  const average = total / data.length
  const max = Math.max(...data.map(item => item.amount))
  const min = Math.min(...data.map(item => item.amount))

  return { total, average, max, min }
}

// 전체 시장 데이터
export const mayorsData: MayorData[] = [
  {
    name: '용인시장',
    color: '#10b981', // green
    monthlyData: yonginMonthly,
    ...calculateStats(yonginMonthly)
  },
  {
    name: '수원시장',
    color: '#3b82f6', // blue
    monthlyData: suwonMonthly,
    ...calculateStats(suwonMonthly)
  },
  {
    name: '고양시장',
    color: '#f59e0b', // amber
    monthlyData: goyangMonthly,
    ...calculateStats(goyangMonthly)
  },
]

// 월별로 그룹화된 데이터
export function getMonthlyComparison() {
  const months = yonginMonthly.map(item => item.yearMonth)

  return months.map(yearMonth => {
    const data: any = { yearMonth }

    mayorsData.forEach(mayor => {
      const monthData = mayor.monthlyData.find(m => m.yearMonth === yearMonth)
      data[mayor.name] = monthData?.amount || 0
    })

    return data
  })
}
