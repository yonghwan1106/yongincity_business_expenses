'use client'

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { MayorData } from '@/lib/mayorsComparisonData'

interface Props {
  data: any[]
  mayors: MayorData[]
  type: 'line' | 'bar'
}

export function MayorsComparisonChart({ data, mayors, type = 'line' }: Props) {
  const formatYAxis = (value: number) => {
    return `${(value / 10000000).toFixed(1)}천만`
  }

  const formatTooltip = (value: number) => {
    return `${(value / 10000).toLocaleString()}만원`
  }

  const Chart = type === 'line' ? LineChart : BarChart

  return (
    <ResponsiveContainer width="100%" height={400}>
      <Chart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="yearMonth"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          tickFormatter={formatYAxis}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={formatTooltip}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '12px'
          }}
        />
        <Legend
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="circle"
        />

        {mayors.map(mayor => (
          type === 'line' ? (
            <Line
              key={mayor.name}
              type="monotone"
              dataKey={mayor.name}
              stroke={mayor.color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name={mayor.name}
            />
          ) : (
            <Bar
              key={mayor.name}
              dataKey={mayor.name}
              fill={mayor.color}
              name={mayor.name}
              radius={[4, 4, 0, 0]}
            />
          )
        ))}
      </Chart>
    </ResponsiveContainer>
  )
}
