"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"
import type { Quote } from "@/lib/types"

function resolveCSSVar(variable: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
}
const COLORS = [
  "#111827", // gris anthracite
  "#374151", // gris foncé
  "#4b5563", // gris moyen
  "#6b7280", // gris clair
  "#9ca3af", // gris encore plus clair
];

interface CostBreakdownChartProps {
  quotes: Quote[]
}

export function CostBreakdownChart({ quotes }: CostBreakdownChartProps) {
  const totals = quotes.reduce(
    (acc, quote) => {
      acc.fraisKilometriques += quote.totaux.fraisKilometriquesTotal
      acc.fraisRoute += quote.totaux.fraisRouteTotal
      acc.tempsTravail += quote.totaux.tempsTravailTotal
      acc.tempsTravailMajore += quote.totaux.tempsTravailMajoreTotal
      acc.outillage += quote.totaux.outillageTotal
      return acc
    },
    {
      fraisKilometriques: 0,
      fraisRoute: 0,
      tempsTravail: 0,
      tempsTravailMajore: 0,
      outillage: 0,
    },
  )

  const chartData = [
    { name: "Frais Kilométriques", value: totals.fraisKilometriques, fill: COLORS[0] },
    { name: "Frais de Route", value: totals.fraisRoute, fill: COLORS[1] },
    { name: "Temps de Travail", value: totals.tempsTravail, fill: COLORS[2] },
    { name: "Temps Majoré", value: totals.tempsTravailMajore, fill: COLORS[3] },
    { name: "Outillage", value: totals.outillage, fill: COLORS[4] },
  ].filter((item) => item.value > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des Coûts</CardTitle>
        <CardDescription>Distribution des différents types de coûts</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            fraisKilometriques: {
              label: "Frais Kilométriques",
              color: COLORS[0],
            },
            fraisRoute: {
              label: "Frais de Route",
              color: COLORS[1],
            },
            tempsTravail: {
              label: "Temps de Travail",
              color: COLORS[2],
            },
            tempsTravailMajore: {
              label: "Temps Majoré",
              color: COLORS[3],
            },
            outillage: {
              label: "Outillage",
              color: COLORS[4],
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
