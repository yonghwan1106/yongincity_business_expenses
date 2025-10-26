'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MayorsComparisonChart } from '@/components/MayorsComparisonChart'
import { MayorStatsCard } from '@/components/MayorStatsCard'
import { mayorsData, getMonthlyComparison } from '@/lib/mayorsComparisonData'
import { AlertCircle } from 'lucide-react'

export default function ComparisonPage() {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')
  const monthlyData = getMonthlyComparison()

  // 총액 기준으로 정렬 (내림차순)
  const sortedMayors = [...mayorsData].sort((a, b) => b.total - a.total)

  // 용인시장과 다른 시장들 간의 차이 계산
  const yonginMayor = sortedMayors.find(m => m.name === '용인시장')!
  const suwonMayor = sortedMayors.find(m => m.name === '수원시장')!
  const goyangMayor = sortedMayors.find(m => m.name === '고양시장')!

  const yonginVsSuwonDiff = yonginMayor.total - suwonMayor.total
  const yonginVsSuwonPercent = ((yonginVsSuwonDiff / suwonMayor.total) * 100).toFixed(1)

  const yonginVsGoyangDiff = yonginMayor.total - goyangMayor.total
  const yonginVsGoyangPercent = ((yonginVsGoyangDiff / goyangMayor.total) * 100).toFixed(1)

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-gray-50">
      {/* 헤더 */}
      <Header />

      {/* 페이지 헤더 */}
      <div className="bg-white shadow-md border-b-2 border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              경기도 타 특례시와의 업무추진비 비교
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              용인시장 vs 수원시장 vs 고양시장
            </p>
            <p className="text-sm text-gray-500 mb-4">
              분석 기간: 2024년 9월 ~ 2025년 9월 (13개월)
            </p>

            {/* 경고 배너 */}
            <div className="mt-6 max-w-4xl mx-auto bg-gradient-to-r from-red-500 to-orange-600 text-white px-8 py-4 rounded-xl shadow-lg">
              <div className="flex items-center justify-center gap-3">
                <AlertCircle className="w-6 h-6" />
                <p className="text-lg font-semibold">
                  용인시장의 업무추진비는 수원시장 대비 <span className="text-2xl font-bold">{yonginVsSuwonPercent}%</span>,
                  고양시장 대비 <span className="text-2xl font-bold">{yonginVsGoyangPercent}%</span> 더 많이 사용되고 있습니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 심각성 분석 */}
        <section className="mb-12">
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
            <h3 className="font-bold text-red-900 mb-4 text-xl flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              문제점 분석
            </h3>
            <div className="space-y-3 text-red-800">
              <p className="flex items-start gap-2">
                <span className="text-2xl">⚠️</span>
                <span>
                  <strong>용인시장</strong>은 13개월간 총 <strong className="text-2xl">{(yonginMayor.total / 100000000).toFixed(1)}억원</strong>을 업무추진비로 사용했습니다.
                  이는 <strong>수원시장({(suwonMayor.total / 100000000).toFixed(1)}억원)</strong>보다 <strong className="text-xl">{(yonginVsSuwonDiff / 100000000).toFixed(1)}억원</strong> 더 많은 금액입니다.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-2xl">⚠️</span>
                <span>
                  <strong>고양시장({(goyangMayor.total / 100000000).toFixed(1)}억원)</strong>과 비교하면 무려 <strong className="text-xl">{(yonginVsGoyangDiff / 100000000).toFixed(1)}억원</strong> 더 많이 사용했습니다.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-2xl">⚠️</span>
                <span>
                  월평균으로 보면 용인시장은 <strong className="text-xl">{(yonginMayor.average / 10000).toFixed(0)}만원</strong>을 사용하는 반면,
                  수원시장은 <strong>{(suwonMayor.average / 10000).toFixed(0)}만원</strong>,
                  고양시장은 <strong>{(goyangMayor.average / 10000).toFixed(0)}만원</strong>을 사용합니다.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-2xl">💰</span>
                <span>
                  용인시장의 최대 집행액(<strong>{(yonginMayor.max / 10000).toFixed(0)}만원, 2025년 1월</strong>)은 다른 두 시장의 최대 집행액을 크게 상회합니다.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* 시장별 통계 카드 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">📊</span>
            시장별 집행 통계 비교
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

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                💡 <strong>그래프 해석:</strong> 용인시장(녹색 선)이 대부분의 기간 동안 다른 두 시장보다 높은 위치에 있어
                지속적으로 더 많은 업무추진비를 사용하고 있음을 보여줍니다.
              </p>
            </div>
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
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">용인-수원 차이</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((row, index) => {
                    const yonginAmount = row['용인시장']
                    const suwonAmount = row['수원시장']
                    const diff = yonginAmount - suwonAmount

                    return (
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
                            {Math.round(row[mayor.name] / 10000).toLocaleString()}만원
                          </td>
                        ))}
                        <td className={`px-4 py-3 text-right font-bold ${diff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {diff > 0 ? '+' : ''}{Math.round(diff / 10000).toLocaleString()}만원
                        </td>
                      </tr>
                    )
                  })}
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
                        {Math.round(mayor.total / 10000).toLocaleString()}만원
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right font-bold text-red-600">
                      +{Math.round(yonginVsSuwonDiff / 10000).toLocaleString()}만원
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-4 text-sm text-gray-600 text-right">
              * 용인-수원 차이: 양수(+)는 용인시장이 더 많이 사용, 음수(-)는 수원시장이 더 많이 사용
            </div>
          </div>
        </section>

        {/* 결론 */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-4">📢 시민의 목소리</h3>
            <div className="space-y-3 text-lg">
              <p>
                용인시장의 업무추진비 사용액이 같은 특례시인 수원, 고양과 비교했을 때 지나치게 많습니다.
              </p>
              <p>
                13개월간 <strong className="text-2xl">{(yonginVsSuwonDiff / 100000000).toFixed(1)}억원</strong>이나 더 사용한 이 비용은
                시민들의 소중한 세금입니다.
              </p>
              <p className="text-xl font-bold">
                투명하고 합리적인 업무추진비 사용을 촉구합니다.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  )
}
