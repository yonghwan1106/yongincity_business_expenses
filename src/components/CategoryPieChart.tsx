'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface CategoryPieChartProps {
  data: Array<{
    category: string
    금액: number
    건수: number
    비율: number
  }>
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const chartData = data.map(item => ({
    name: item.category || '기타',
    value: item.금액,
    건수: item.건수,
    비율: item.비율
  }))

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, 비율 }) => `${name} (${비율.toFixed(1)}%)`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string, props: any) => [
              `${Math.round(value / 10000).toLocaleString()}만원 (${props.payload.건수}건)`,
              name
            ]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => (
              `${value}: ${Math.round(entry.payload.value / 10000).toLocaleString()}만원`
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
