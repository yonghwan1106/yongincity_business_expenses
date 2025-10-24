import { fetchExpenseData } from "@/lib/googleSheets"
import { DashboardClient } from "@/components/DashboardClient"
import { ChatBot } from "@/components/ChatBot"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export const revalidate = 300 // 5분마다 재검증

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

  // 기본 통계 계산 (헤더용)
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.사용금액, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* 헤더 */}
      <Header />

      {/* 서브 헤더 - 데이터 요약 */}
      <div className="bg-white shadow-md border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                2024년 9월 ~ 2025년 9월 집행내역 분석
              </h2>
              <p className="text-sm text-gray-600">
                총 {expenses.length.toLocaleString()}건의 집행 내역
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg">
                <div className="text-xs font-medium uppercase tracking-wide mb-1">총 집행액</div>
                <div className="text-3xl font-bold">
                  {(totalAmount / 100000000).toFixed(1)}억원
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-semibold mb-2">데이터 로드 오류</h3>
            <p className="text-red-600 text-sm">{error}</p>
            <p className="text-red-600 text-sm mt-2">
              환경 변수가 올바르게 설정되었는지 확인해주세요.
            </p>
          </div>
        ) : (
          <DashboardClient initialData={expenses} />
        )}
      </main>

      {/* 푸터 */}
      <Footer />

      {/* AI 챗봇 */}
      <ChatBot />
    </div>
  )
}
