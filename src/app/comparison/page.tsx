'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MayorsComparisonChart } from '@/components/MayorsComparisonChart'
import { MayorStatsCard } from '@/components/MayorStatsCard'
import { mayorsData, getMonthlyComparison } from '@/lib/mayorsComparisonData'

export default function ComparisonPage() {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')
  const monthlyData = getMonthlyComparison()

  // 총액 기준으로 정렬 (내림차순)
  const sortedMayors = [...mayorsData].sort((a, b) => b.total - a.total)

  // 전체 합계
  const grandTotal = mayorsData.reduce((sum, mayor) => sum + mayor.total, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* 헤더 */}
      <Header />

      {/* 페이지 헤더 */}
      <div className="bg-white shadow-md border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              시장별 업무추진비 비교
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              용인시장, 수원시장, 고양시장의 13개월 집행 내역 분석
            </p>
            <p className="text-sm text-gray-500">
              분석 기간: 2024년 9월 ~ 2025년 9월
            </p>
            <div className="mt-4 inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl shadow-lg">
              <div className="text-xs font-medium uppercase tracking-wide mb-1">3개 시 총 집행액</div>
              <div className="text-3xl font-bold">
                {(grandTotal / 100000000).toFixed(1)}억원
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 시장별 통계 카드 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">📊</span>
            시장별 집행 통계
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedMayors.map((mayor, index) => (
              <MayorStatsCard
                key={mayor.name}
                mayor={mayor}
                rank={index + 1}
              />
            ))}
          </div>
        </section>

        {/* 비교 분석 */}
        <section className="mb-12">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3 text-lg">📈 주요 인사이트</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>
                • <strong>{sortedMayors[0].name}</strong>이 총 <strong>{(sortedMayors[0].total / 100000000).toFixed(1)}억원</strong>으로 가장 높은 집행액을 기록했습니다.
              </p>
              <p>
                • {sortedMayors[0].name}은 {sortedMayors[1].name}보다 <strong>{((sortedMayors[0].total - sortedMayors[1].total) / 100000000).toFixed(1)}억원 ({(((sortedMayors[0].total - sortedMayors[1].total) / sortedMayors[1].total) * 100).toFixed(1)}%)</strong> 더 많이 집행했습니다.
              </p>
              <p>
                • 월평균 집행액: {sortedMayors[0].name} <strong>{(sortedMayors[0].average / 10000).toFixed(0)}만원</strong>, {sortedMayors[1].name} <strong>{(sortedMayors[1].average / 10000).toFixed(0)}만원</strong>, {sortedMayors[2].name} <strong>{(sortedMayors[2].average / 10000).toFixed(0)}만원</strong>
              </p>
            </div>
          </div>
        </section>

        {/* 월별 추이 차트 */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-3xl">📉</span>
                월별 집행 추이
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartType('line')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    chartType === 'line'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  선 그래프
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    chartType === 'bar'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  막대 그래프
                </button>
              </div>
            </div>

            <MayorsComparisonChart
              data={monthlyData}
              mayors={mayorsData}
              type={chartType}
            />
          </div>
        </section>

        {/* 월별 상세 데이터 테이블 */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-3xl">📋</span>
              월별 상세 데이터
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">년월</th>
                    {mayorsData.map(mayor => (
                      <th key={mayor.name} className="px-4 py-3 text-right font-semibold text-gray-700">
                        {mayor.name}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">합계</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((row, index) => (
                    <tr
                      key={row.yearMonth}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{row.yearMonth}</td>
                      {mayorsData.map(mayor => (
                        <td
                          key={mayor.name}
                          className="px-4 py-3 text-right"
                          style={{ color: mayor.color, fontWeight: 600 }}
                        >
                          {(row[mayor.name] / 10000).toLocaleString()}만원
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right font-bold text-gray-900">
                        {(mayorsData.reduce((sum, mayor) => sum + row[mayor.name], 0) / 10000).toLocaleString()}만원
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 border-t-2 border-gray-300 font-bold">
                    <td className="px-4 py-3 text-gray-900">총계</td>
                    {sortedMayors.map(mayor => (
                      <td
                        key={mayor.name}
                        className="px-4 py-3 text-right"
                        style={{ color: mayor.color }}
                      >
                        {(mayor.total / 10000).toLocaleString()}만원
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right text-gray-900">
                      {(grandTotal / 10000).toLocaleString()}만원
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  )
}
