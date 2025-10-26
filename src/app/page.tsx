import { fetchExpenseData } from "@/lib/googleSheets"
import { DashboardClient } from "@/components/DashboardClient"
import { ChatBot } from "@/components/ChatBot"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ExpenseRecord } from "@/types"
import Link from "next/link"
import { BarChart3, AlertTriangle } from "lucide-react"

export const revalidate = 300 // 5분마다 재검증

export default async function Home() {
  // Google Sheets에서 데이터 가져오기
  let expenses: ExpenseRecord[] = []
  let error: string | null = null

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
        {/* 시범 테스트 경고 배너 */}
        <div className="mb-6 bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-yellow-900 mb-2">⚠️ 시범 테스트 버전 안내</h3>
              <div className="text-yellow-800 space-y-1">
                <p className="font-semibold">
                  본 페이지는 현재 <strong className="text-yellow-900">시범 테스트 중</strong>입니다.
                </p>
                <p className="text-sm">
                  • 일부 데이터가 실제와 다를 수 있으며, 정확성을 보장하지 않습니다.
                </p>
                <p className="text-sm">
                  • 공식적인 데이터는 용인특례시청 홈페이지를 참고해주시기 바랍니다.
                </p>
                <p className="text-sm">
                  • 데이터 오류 발견 시 피드백 부탁드립니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 비교 페이지 안내 배너 */}
        <Link href="/comparison">
          <div className="mb-8 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">경기도 타 특례시와의 비교</h3>
                  <p className="text-white/90">
                    용인시장의 업무추진비가 수원시장, 고양시장 대비 얼마나 많이 사용되는지 확인하세요
                  </p>
                </div>
              </div>
              <div className="hidden md:block text-6xl">📊</div>
            </div>
          </div>
        </Link>

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
