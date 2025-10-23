import { Coins, TrendingUp, FileText, Calendar } from "lucide-react"
import { StatsCard } from "@/components/StatsCard"
import { fetchExpenseData, groupByMonth, groupByCategory } from "@/lib/googleSheets"

export const revalidate = 3600 // 1시간마다 재검증

export default async function Home() {
  // Google Sheets에서 데이터 가져오기
  let expenses = []
  let error = null

  try {
    expenses = await fetchExpenseData()
  } catch (e) {
    error = e instanceof Error ? e.message : '데이터를 가져올 수 없습니다'
    console.error('Error loading data:', e)
  }

  // 통계 계산
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.사용금액, 0)
  const totalCount = expenses.length
  const monthlyAverage = expenses.length > 0 ? totalAmount / 13 : 0

  const monthlyData = groupByMonth(expenses)
  const categoryData = groupByCategory(expenses)

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            용인시장 업무추진비 투명성 모니터링
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            2024년 9월 ~ 2025년 9월 집행내역
          </p>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-semibold mb-2">데이터 로드 오류</h3>
            <p className="text-red-600 text-sm">{error}</p>
            <p className="text-red-600 text-sm mt-2">
              환경 변수가 올바르게 설정되었는지 확인해주세요.
            </p>
          </div>
        ) : (
          <>
            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="총 집행액"
                value={totalAmount}
                type="currency"
                icon={Coins}
                description="전체 기간 집행 총액"
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
                description="월평균 집행액"
              />
              <StatsCard
                title="분야"
                value={categoryData.length}
                type="number"
                icon={TrendingUp}
                description={`${categoryData.length}개 비목 분류`}
              />
            </div>

            {/* 월별 통계 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">월별 집행 현황</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">월</th>
                      <th className="text-right py-3 px-4">건수</th>
                      <th className="text-right py-3 px-4">금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((month: any) => (
                      <tr key={month.month} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{month.month}</td>
                        <td className="text-right py-3 px-4">{month.건수}건</td>
                        <td className="text-right py-3 px-4 font-semibold">
                          {new Intl.NumberFormat('ko-KR').format(month.금액)}원
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 분야별 통계 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">비목별 집행 현황</h2>
              <div className="space-y-4">
                {categoryData.map((cat: any) => (
                  <div key={cat.category}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{cat.category}</span>
                      <span className="text-sm text-gray-600">
                        {cat.건수}건 · {cat.비율.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${cat.비율}%` }}
                      />
                    </div>
                    <div className="text-right text-sm font-semibold mt-1">
                      {new Intl.NumberFormat('ko-KR').format(cat.금액)}원
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 푸터 */}
      <footer className="bg-gray-50 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            © 2025 용인시 업무추진비 투명성 모니터링 시스템
          </p>
        </div>
      </footer>
    </main>
  )
}
