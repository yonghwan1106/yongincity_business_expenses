'use client'

import { Coins, TrendingUp, FileText, Calendar, MapPin, CreditCard, ArrowUpDown } from "lucide-react"
import { StatsCard } from "@/components/StatsCard"
import { MonthlyTrendChart } from "@/components/MonthlyTrendChart"
import { CategoryPieChart } from "@/components/CategoryPieChart"
import { TopLocationsChart } from "@/components/TopLocationsChart"
import { ExpenseTable } from "@/components/ExpenseTable"
import { FilterBar } from "@/components/FilterBar"
import { DownloadButton } from "@/components/DownloadButton"
import { InsightsSection } from "@/components/InsightsSection"
import { CalendarHeatmap } from "@/components/CalendarHeatmap"
import { useFilterStore } from "@/store/filterStore"
import { ExpenseRecord } from "@/types"

// Client-side grouping functions (same as server-side but for filtered data)
function groupByMonth(data: ExpenseRecord[]) {
  const grouped = data.reduce((acc, record) => {
    const date = record.사용일시
    const month = date.substring(0, 7)

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

function groupByCategory(data: ExpenseRecord[]) {
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
    비율: total > 0 ? (item.금액 / total) * 100 : 0
  }))
}

function groupByLocation(data: ExpenseRecord[], topN: number = 10) {
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

function groupByPaymentMethod(data: ExpenseRecord[]) {
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

interface DashboardClientProps {
  initialData: ExpenseRecord[]
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  // Get filtered data from the store - subscribe to all filter state changes
  const {
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
    selectedCategories,
    selectedPaymentMethods,
    searchText,
    applyFilters
  } = useFilterStore()

  const filteredExpenses = applyFilters(initialData)

  // 기본 통계 계산 (필터된 데이터 기준)
  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.사용금액, 0)
  const totalCount = filteredExpenses.length
  const monthlyData = groupByMonth(filteredExpenses)
  const monthCount = monthlyData.length
  const monthlyAverage = monthCount > 0 ? totalAmount / monthCount : 0

  // 추가 통계
  const amounts = filteredExpenses.map(exp => exp.사용금액)
  const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0
  const minAmount = amounts.length > 0 ? Math.min(...amounts.filter(a => a > 0)) : 0
  const avgAmount = totalCount > 0 ? totalAmount / totalCount : 0

  // 그룹화 데이터
  // 비목별 데이터는 2024년 1월 이후만 사용 (원본 데이터에 비목이 있는 구간)
  const expensesWithCategory = filteredExpenses.filter(exp => exp.사용일시 >= '2024-01' && exp.비목)
  const categoryData = groupByCategory(expensesWithCategory)
  const locationData = groupByLocation(filteredExpenses, 10)
  const paymentData = groupByPaymentMethod(filteredExpenses)

  return (
    <>
      {/* 스토리텔링 섹션 */}
      <InsightsSection data={filteredExpenses} />

      {/* 통계 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="총 집행액"
          value={totalAmount}
          type="currency"
          icon={Coins}
          description="필터링된 데이터 집행 총액"
        />
        <StatsCard
          title="총 건수"
          value={totalCount}
          type="number"
          icon={FileText}
          description={`${totalCount}건의 집행 내역`}
        />
        <StatsCard
          title="월 평균"
          value={monthlyAverage}
          type="currency"
          icon={Calendar}
          description={`${monthCount}개월 평균 집행액`}
        />
        <StatsCard
          title="건당 평균"
          value={avgAmount}
          type="currency"
          icon={TrendingUp}
          description="건당 평균 집행액"
        />
      </div>

      {/* 추가 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">최대 집행액</p>
              <p className="text-2xl font-bold text-gray-900">
                {maxAmount.toLocaleString()}원
              </p>
            </div>
            <ArrowUpDown className="w-10 h-10 text-green-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">최소 집행액</p>
              <p className="text-2xl font-bold text-gray-900">
                {minAmount.toLocaleString()}원
              </p>
            </div>
            <ArrowUpDown className="w-10 h-10 text-blue-500 opacity-80" />
          </div>
        </div>
      </div>

      {/* 월별 집행 추이 - 전체 너비 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          용인시장 업무추진비 월별 집행 내역 (2022.7 ~ 2025.9)
        </h2>
        <MonthlyTrendChart data={monthlyData} />
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 비목별 파이 차트 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-green-600" />
            비목별 집행 현황
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            기관운영비 vs 시책추진비 비율
          </p>
          <CategoryPieChart data={categoryData} />
        </div>

        {/* 상위 사용처 바 차트 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-purple-600" />
            상위 10대 사용처
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            가장 많이 집행된 장소 TOP 10
          </p>
          <TopLocationsChart data={locationData} />
        </div>
      </div>

      {/* 결제방법별 현황 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-orange-600" />
          결제방법별 현황
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentData.map((payment: any) => (
            <div key={payment.method} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold">{payment.method}</span>
                <CreditCard className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-sm text-gray-600 mb-2">{payment.건수}건</div>
              <div className="text-xl font-bold text-blue-600">
                {Math.round(payment.금액 / 10000).toLocaleString()}만원
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${totalAmount > 0 ? (payment.금액 / totalAmount) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-teal-600" />
          일별 집행 히트맵 (최근 90일)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          색상이 진할수록 해당 일자의 집행액이 많습니다
        </p>
        <CalendarHeatmap data={filteredExpenses} />
      </div>

      {/* 월별 상세 통계 테이블 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">월별 상세 통계</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">월</th>
                <th className="text-right py-3 px-4 font-semibold">건수</th>
                <th className="text-right py-3 px-4 font-semibold">총 금액</th>
                <th className="text-right py-3 px-4 font-semibold">평균 금액</th>
                <th className="text-right py-3 px-4 font-semibold">최대 금액</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((month: any) => {
                const avg = month.건수 > 0 ? month.금액 / month.건수 : 0
                const max = month.records.length > 0
                  ? Math.max(...month.records.map((r: any) => r.사용금액))
                  : 0

                return (
                  <tr key={month.month} className="border-b hover:bg-blue-50 transition-colors">
                    <td className="py-3 px-4 font-medium">{month.month}</td>
                    <td className="text-right py-3 px-4">{month.건수}건</td>
                    <td className="text-right py-3 px-4 font-semibold text-blue-600">
                      {month.금액.toLocaleString()}원
                    </td>
                    <td className="text-right py-3 px-4 text-gray-600">
                      {avg.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원
                    </td>
                    <td className="text-right py-3 px-4 text-green-600">
                      {max.toLocaleString()}원
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot className="bg-gray-100 font-bold">
              <tr className="border-t-2 border-gray-300">
                <td className="py-3 px-4">합계</td>
                <td className="text-right py-3 px-4">{totalCount}건</td>
                <td className="text-right py-3 px-4 text-blue-700">
                  {totalAmount.toLocaleString()}원
                </td>
                <td className="text-right py-3 px-4">
                  {avgAmount.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원
                </td>
                <td className="text-right py-3 px-4 text-green-700">
                  {maxAmount.toLocaleString()}원
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 필터 및 검색 섹션 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border-2 border-blue-200">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>🔍</span>
          필터 및 검색
        </h2>
        <FilterBar data={initialData} />

        <div className="flex justify-end mt-4">
          <DownloadButton data={filteredExpenses} filename="용인시장_업무추진비" />
        </div>
      </div>

      {/* 전체 데이터 테이블 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">전체 집행 내역</h2>
        <p className="text-sm text-gray-600 mb-4">
          클릭하여 정렬 가능 | 총 {totalCount}건의 데이터
        </p>
        <ExpenseTable data={filteredExpenses} />
      </div>
    </>
  )
}
