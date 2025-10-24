'use client'

import { ExpenseRecord } from '@/types'

interface CalendarHeatmapProps {
  data: ExpenseRecord[]
}

export function CalendarHeatmap({ data }: CalendarHeatmapProps) {
  // 날짜별 집행액 집계
  const dailyData = data.reduce((acc, record) => {
    const date = record.사용일시.substring(0, 10) // YYYY-MM-DD
    if (!acc[date]) {
      acc[date] = { 금액: 0, 건수: 0 }
    }
    acc[date].금액 += record.사용금액
    acc[date].건수++
    return acc
  }, {} as Record<string, { 금액: number; 건수: number }>)

  // 최대값 계산 (색상 스케일용)
  const maxAmount = Math.max(...Object.values(dailyData).map(d => d.금액))

  // 색상 강도 계산
  const getColor = (amount: number) => {
    if (amount === 0) return 'bg-gray-100'
    const intensity = (amount / maxAmount) * 100
    if (intensity > 75) return 'bg-blue-700'
    if (intensity > 50) return 'bg-blue-500'
    if (intensity > 25) return 'bg-blue-300'
    return 'bg-blue-100'
  }

  // 최근 90일 데이터만 표시
  const today = new Date()
  const daysToShow = 90
  const dates: Date[] = []

  for (let i = daysToShow - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dates.push(date)
  }

  // 주별로 그룹화
  const weeks: Date[][] = []
  let currentWeek: Date[] = []

  dates.forEach((date, index) => {
    currentWeek.push(date)
    if (date.getDay() === 6 || index === dates.length - 1) {
      weeks.push([...currentWeek])
      currentWeek = []
    }
  })

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((date, dayIndex) => {
                const dateStr = date.toISOString().substring(0, 10)
                const dayData = dailyData[dateStr]
                const amount = dayData?.금액 || 0
                const count = dayData?.건수 || 0

                return (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm ${getColor(amount)} hover:ring-2 hover:ring-blue-600 cursor-pointer transition-all`}
                    title={`${dateStr}\n금액: ${amount.toLocaleString()}원\n건수: ${count}건`}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* 범례 */}
        <div className="flex items-center gap-4 mt-6 text-sm">
          <span className="text-gray-600">적음</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-gray-100 rounded-sm" />
            <div className="w-4 h-4 bg-blue-100 rounded-sm" />
            <div className="w-4 h-4 bg-blue-300 rounded-sm" />
            <div className="w-4 h-4 bg-blue-500 rounded-sm" />
            <div className="w-4 h-4 bg-blue-700 rounded-sm" />
          </div>
          <span className="text-gray-600">많음</span>
        </div>

        {/* 월 라벨 */}
        <div className="flex gap-1 mt-2 text-xs text-gray-500">
          {weeks.map((week, index) => {
            const firstDay = week[0]
            const isFirstWeekOfMonth = firstDay.getDate() <= 7
            return (
              <div key={index} className="flex flex-col items-center" style={{ width: '12px' }}>
                {isFirstWeekOfMonth && (
                  <span>{firstDay.toLocaleDateString('ko-KR', { month: 'short' })}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
