'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { ExpenseRecord } from '@/types'

interface SunburstChartProps {
  data: ExpenseRecord[]
}

export function SunburstChart({ data }: SunburstChartProps) {
  // 비목별 데이터 (내부 원)
  const categoryData = data.reduce((acc, record) => {
    const category = record.비목
    if (!acc[category]) {
      acc[category] = { name: category, value: 0 }
    }
    acc[category].value += record.사용금액
    return acc
  }, {} as Record<string, { name: string; value: number }>)

  const innerData = Object.values(categoryData)

  // 결제방법별 데이터 (외부 원)
  const paymentData = data.reduce((acc, record) => {
    const payment = record.결제방법 || '기타'
    if (!acc[payment]) {
      acc[payment] = { name: payment, value: 0 }
    }
    acc[payment].value += record.사용금액
    return acc
  }, {} as Record<string, { name: string; value: number }>)

  const outerData = Object.values(paymentData)

  // 색상 팔레트
  const INNER_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
  const OUTER_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a4de6c', '#d084d0']

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-blue-600 font-bold">
            {Math.round(data.value / 10000).toLocaleString()}만원
          </p>
          <p className="text-sm text-gray-600">
            {((data.value / data.payload.totalValue) * 100).toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        {/* 내부 원 - 비목 */}
        <Pie
          data={innerData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={0}
          outerRadius={80}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {innerData.map((entry, index) => (
            <Cell key={`inner-${index}`} fill={INNER_COLORS[index % INNER_COLORS.length]} />
          ))}
        </Pie>

        {/* 외부 원 - 결제방법 */}
        <Pie
          data={outerData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={90}
          outerRadius={140}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {outerData.map((entry, index) => (
            <Cell key={`outer-${index}`} fill={OUTER_COLORS[index % OUTER_COLORS.length]} />
          ))}
        </Pie>

        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value, entry: any) => {
            const amount = Math.round(entry.payload.value / 10000).toLocaleString()
            return `${value}: ${amount}만원`
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
