'use client'

import { MayorData } from '@/lib/mayorsComparisonData'

interface Props {
  mayor: MayorData
  rank: number
}

export function MayorStatsCard({ mayor, rank }: Props) {
  const formatAmount = (amount: number) => {
    return `${(amount / 100000000).toFixed(1)}억원`
  }

  const formatAverage = (amount: number) => {
    return `${(amount / 10000).toFixed(0)}만원`
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600'
      case 2:
        return 'from-gray-300 to-gray-500'
      case 3:
        return 'from-orange-400 to-orange-600'
      default:
        return 'from-blue-400 to-blue-600'
    }
  }

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return '📊'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* 헤더 - 순위 배지 */}
      <div className={`bg-gradient-to-r ${getRankColor(rank)} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">{mayor.name}</h3>
          <div className="text-4xl">{getRankEmoji(rank)}</div>
        </div>
        <p className="text-white/90 text-sm mt-1">집행액 {rank}위</p>
      </div>

      {/* 통계 내용 */}
      <div className="p-6 space-y-4">
        {/* 총액 */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-gray-600 font-medium">총 집행액</span>
          <span className="text-2xl font-bold text-gray-900">{formatAmount(mayor.total)}</span>
        </div>

        {/* 월평균 */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-gray-600 font-medium">월 평균</span>
          <span className="text-xl font-semibold text-blue-600">{formatAverage(mayor.average)}</span>
        </div>

        {/* 최대/최소 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">최대 집행</p>
            <p className="text-sm font-semibold text-red-700">{formatAverage(mayor.max)}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">최소 집행</p>
            <p className="text-sm font-semibold text-green-700">{formatAverage(mayor.min)}</p>
          </div>
        </div>

        {/* 색상 인디케이터 */}
        <div className="pt-3 flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: mayor.color }}
          />
          <span className="text-xs text-gray-500">차트 색상</span>
        </div>
      </div>
    </div>
  )
}
