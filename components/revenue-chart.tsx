"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import type { Quote } from "@/lib/types"

interface RevenueChartProps {
  quotes: Quote[]
}

export function RevenueChart({ quotes }: RevenueChartProps) {
  // Group quotes by month
  const monthlyData = quotes.reduce(
    (acc, quote) => {
      const date = new Date(quote.date)
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
      const monthName = date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" })

      if (!acc[monthYear]) {
        acc[monthYear] = {
          month: monthName,
          revenue: 0,
          count: 0,
        }
      }

      acc[monthYear].revenue += quote.totaux.totalGeneral
      acc[monthYear].count += 1

      return acc
    },
    {} as Record<string, { month: string; revenue: number; count: number }>,
  )

  const chartData = Object.values(monthlyData).sort((a, b) => {
    const [monthA, yearA] = a.month.split(" ")
    const [monthB, yearB] = b.month.split(" ")
    return new Date(`${monthA} 1, ${yearA}`).getTime() - new Date(`${monthB} 1, ${yearB}`).getTime()
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenu Mensuel</CardTitle>
        <CardDescription>Évolution du chiffre d'affaires par mois</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            revenue: {
              label: "Revenu",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
