'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface MonthlyTrendChartProps {
  data: Array<{
    month: string
    금액: number
    건수: number
  }>
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  // 데이터 포맷팅
  const chartData = data.map(item => ({
    month: item.month.substring(5) + '월', // YYYY-MM -> MM월
    fullMonth: item.month, // 전체 날짜 (YYYY-MM)
    금액만원: Math.round(item.금액 / 10000), // 만원 단위로 변환
    금액원: item.금액,
    건수: item.건수
  }))

  // 총 집행액 계산
  const totalAmount = data.reduce((sum, item) => sum + item.금액, 0)

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white border-2 border-blue-500 rounded-lg shadow-lg p-4">
          <p className="font-bold text-gray-900 mb-2">{data.fullMonth}</p>
          <p className="text-blue-600 font-semibold">
            💰 {data.금액원.toLocaleString()}원
          </p>
          <p className="text-gray-600 text-sm mt-1">
            📊 {data.건수}건
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full">
      {/* 총 집행액 표시 */}
      <div className="text-right mb-4">
        <span className="text-sm text-gray-600">총 집행액: </span>
        <span className="text-xl font-bold text-blue-600">
          {Math.round(totalAmount / 100000000).toLocaleString()}억원
        </span>
      </div>

      {/* 막대 그래프 */}
      <div className="w-full h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#666', fontSize: 13, fontWeight: 500 }}
              axisLine={{ stroke: '#666' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#666', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              label={{
                value: '집행금액 (만원)',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 14, fill: '#666' }
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            />
            <Bar
              dataKey="금액만원"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              maxBarSize={80}
              label={{
                position: 'top',
                fill: '#1e40af',
                fontSize: 12,
                fontWeight: 600,
                formatter: (value: number) => `${value.toLocaleString()}만원`
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#3b82f6" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
