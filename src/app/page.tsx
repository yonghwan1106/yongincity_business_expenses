import { fetchExpenseDataFromCSV } from "@/lib/csvLoader"
import { DashboardClient } from "@/components/DashboardClient"
import { ChatBot } from "@/components/ChatBot"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ExpenseRecord } from "@/types"
import Link from "next/link"
import { BarChart3, AlertTriangle } from "lucide-react"

export const revalidate = 300 // 5분마다 재검증

export default async function Home() {
  // CSV 파일에서 전체 데이터 가져오기 (2022.7 ~ 2025.9)
  let expenses: ExpenseRecord[] = []
  let error: string | null = null

  try {
    expenses = await fetchExpenseDataFromCSV()
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
                2022년 7월 ~ 2025년 9월 집행내역 분석
              </h2>
              <p className="text-sm text-gray-600">
                총 {expenses.length.toLocaleString()}건의 집행 내역 (민선8기 전체)
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
