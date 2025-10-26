'use client'

import { TrendingUp, TrendingDown, AlertCircle, Award, Calendar, MapPin } from 'lucide-react'
import { ExpenseRecord } from '@/types'

interface InsightsSectionProps {
  data: ExpenseRecord[]
}

export function InsightsSection({ data }: InsightsSectionProps) {
  if (data.length === 0) return null

  // 월별 데이터 계산
  const monthlyData = data.reduce((acc, record) => {
    const month = record.사용일시.substring(0, 7)
    if (!acc[month]) {
      acc[month] = { 금액: 0, 건수: 0, records: [] }
    }
    acc[month].금액 += record.사용금액
    acc[month].건수++
    acc[month].records.push(record)
    return acc
  }, {} as Record<string, { 금액: number; 건수: number; records: ExpenseRecord[] }>)

  const months = Object.keys(monthlyData).sort()
  const latestMonth = months[months.length - 1]
  const previousMonth = months[months.length - 2]

  const latestMonthData = monthlyData[latestMonth]
  const previousMonthData = monthlyData[previousMonth]

  // 증감률 계산
  const amountChange = previousMonthData
    ? ((latestMonthData.금액 - previousMonthData.금액) / previousMonthData.금액) * 100
    : 0

  const countChange = previousMonthData
    ? ((latestMonthData.건수 - previousMonthData.건수) / previousMonthData.건수) * 100
    : 0

  // 이번 달 데이터만 필터링
  const currentMonthRecords = latestMonthData.records

  // 최다 사용처 (이번 달 기준)
  const locationStats = currentMonthRecords.reduce((acc, record) => {
    const location = record.사용장소
    if (!acc[location]) {
      acc[location] = { 금액: 0, 건수: 0 }
    }
    acc[location].금액 += record.사용금액
    acc[location].건수++
    return acc
  }, {} as Record<string, { 금액: number; 건수: number }>)

  const topLocation = Object.entries(locationStats)
    .sort(([, a], [, b]) => b.건수 - a.건수)[0]

  // 최대 단일 집행 (이번 달 기준)
  const maxExpense = currentMonthRecords.reduce((max, record) =>
    record.사용금액 > max.사용금액 ? record : max
  , currentMonthRecords[0])

  // 평균 대비 이상치 탐지
  const avgAmount = data.reduce((sum, exp) => sum + exp.사용금액, 0) / data.length
  const highValueExpenses = data.filter(exp => exp.사용금액 > avgAmount * 2).length

  // 전체 기간 통계 (시민 질문용)
  const totalAmount = data.reduce((sum, exp) => sum + exp.사용금액, 0)

  // 전체 기간 최다 사용처
  const allTimeLocationStats = data.reduce((acc, record) => {
    const location = record.사용장소
    if (!acc[location]) {
      acc[location] = { 금액: 0, 건수: 0 }
    }
    acc[location].금액 += record.사용금액
    acc[location].건수++
    return acc
  }, {} as Record<string, { 금액: number; 건수: number }>)

  const allTimeTopLocation = Object.entries(allTimeLocationStats)
    .sort(([, a], [, b]) => b.건수 - a.건수)[0]

  const categoryStats = data.reduce((acc, record) => {
    const category = record.비목
    if (!acc[category]) {
      acc[category] = { 금액: 0, 건수: 0 }
    }
    acc[category].금액 += record.사용금액
    acc[category].건수++
    return acc
  }, {} as Record<string, { 금액: number; 건수: number }>)

  return (
    <div className="space-y-6 mb-8">
      {/* 이달의 하이라이트 */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6" />
          <h2 className="text-2xl font-bold">이달의 하이라이트</h2>
          <span className="ml-auto bg-white/20 px-3 py-1 rounded-full text-sm">
            {latestMonth.substring(0, 4)}년 {parseInt(latestMonth.substring(5, 7))}월
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 총 집행액 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" />
              <p className="text-sm opacity-90">총 집행액</p>
            </div>
            <p className="text-2xl font-bold mb-1">
              {latestMonthData.금액.toLocaleString()}원
            </p>
            <div className="flex items-center gap-1 text-sm">
              {amountChange > 0 ? (
                <>
                  <TrendingUp className="w-4 h-4" />
                  <span>전월 대비 ↑{Math.abs(amountChange).toFixed(1)}%</span>
                </>
              ) : amountChange < 0 ? (
                <>
                  <TrendingDown className="w-4 h-4" />
                  <span>전월 대비 ↓{Math.abs(amountChange).toFixed(1)}%</span>
                </>
              ) : (
                <span>전월과 동일</span>
              )}
            </div>
          </div>

          {/* 최다 방문 장소 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4" />
              <p className="text-sm opacity-90">최다 방문 장소</p>
            </div>
            <p className="text-xl font-bold mb-1 truncate" title={topLocation[0]}>
              {topLocation[0]}
            </p>
            <p className="text-sm opacity-90">
              {topLocation[1].건수}회 방문
            </p>
          </div>

          {/* 최대 단일 집행 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm opacity-90">최대 단일 집행</p>
            </div>
            <p className="text-2xl font-bold mb-1">
              {maxExpense.사용금액.toLocaleString()}원
            </p>
            <p className="text-xs opacity-75 truncate" title={maxExpense.집행목적}>
              {maxExpense.집행목적}
            </p>
          </div>
        </div>
      </div>

      {/* 주요 인사이트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 시민이 궁금해하는 질문 */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            시민이 궁금해하는 질문
          </h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-semibold text-gray-800 mb-1">Q. 가장 자주 방문한 장소는? (전체 기간)</p>
              <p className="text-gray-600 text-sm">
                A. <strong>{allTimeTopLocation[0]}</strong> - {allTimeTopLocation[1].건수}회 방문, 총{' '}
                {allTimeTopLocation[1].금액.toLocaleString()}원 사용
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-semibold text-gray-800 mb-1">Q. 월평균 얼마나 집행되나요?</p>
              <p className="text-gray-600 text-sm">
                A. 월평균 <strong>{Math.round(totalAmount / months.length).toLocaleString()}원</strong> 집행
                (총 {months.length}개월)
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <p className="font-semibold text-gray-800 mb-1">Q. 기관운영비 vs 시책추진비 비율은? (전체 기간)</p>
              <p className="text-gray-600 text-sm">
                A. {Object.entries(categoryStats).map(([cat, stats]) => (
                  <span key={cat}>
                    {cat}: <strong>{((stats.금액 / totalAmount) * 100).toFixed(1)}%</strong>
                    {' '}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        {/* 주요 트렌드 */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            주요 트렌드
          </h3>
          <div className="space-y-4">
            {/* 월별 추세 */}
            <div className="flex items-start gap-3">
              {amountChange > 0 ? (
                <div className="bg-red-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                </div>
              ) : amountChange < 0 ? (
                <div className="bg-green-100 p-2 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                </div>
              ) : (
                <div className="bg-gray-100 p-2 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {amountChange > 0 ? '증가 추세' : amountChange < 0 ? '감소 추세' : '유지 중'}
                </p>
                <p className="text-sm text-gray-600">
                  전월 대비 {Math.abs(amountChange).toFixed(1)}% {amountChange > 0 ? '증가' : amountChange < 0 ? '감소' : '변화 없음'}
                </p>
              </div>
            </div>

            {/* 이상치 */}
            {highValueExpenses > 0 && (
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">고액 집행 감지</p>
                  <p className="text-sm text-gray-600">
                    평균의 2배 이상 집행건이 {highValueExpenses}건 발견되었습니다
                  </p>
                </div>
              </div>
            )}

            {/* 집행 건수 변화 */}
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">집행 건수</p>
                <p className="text-sm text-gray-600">
                  이번 달 {latestMonthData.건수}건
                  (전월 대비 {countChange > 0 ? '↑' : '↓'}{Math.abs(countChange).toFixed(1)}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
