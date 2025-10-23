import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { formatCurrency, formatNumber } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: number
  type?: 'currency' | 'number'
  change?: number
  icon: LucideIcon
  description?: string
}

export function StatsCard({
  title,
  value,
  type = 'number',
  change,
  icon: Icon,
  description
}: StatsCardProps) {
  const formattedValue = type === 'currency'
    ? formatCurrency(value)
    : formatNumber(value)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {change !== undefined && (
          <p className={`text-xs mt-1 ${
            change > 0 ? 'text-red-500' : change < 0 ? 'text-green-500' : 'text-gray-500'
          }`}>
            {change > 0 ? '↑' : change < 0 ? '↓' : '→'} {Math.abs(change).toFixed(1)}% 전년 대비
          </p>
        )}
      </CardContent>
    </Card>
  )
}
