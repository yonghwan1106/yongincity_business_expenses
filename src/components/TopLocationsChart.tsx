'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface TopLocationsChartProps {
  data: Array<{
    location: string
    금액: number
    건수: number
  }>
}

export function TopLocationsChart({ data }: TopLocationsChartProps) {
  // 상위 10개만 선택
  const top10 = data.slice(0, 10)

  const chartData = top10.map(item => ({
    name: item.location.length > 10 ? item.location.substring(0, 10) + '...' : item.location,
    금액: Math.round(item.금액 / 10000), // 만원 단위
    건수: item.건수
  }))

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" tick={{ fill: '#666', fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#666', fontSize: 11 }}
            width={95}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === '금액') return [`${value.toLocaleString()}만원`, name]
              return [`${value}건`, name]
            }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
          <Legend />
          <Bar dataKey="금액" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          <Bar dataKey="건수" fill="#10b981" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
