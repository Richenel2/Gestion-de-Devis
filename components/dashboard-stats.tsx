"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, TrendingUp, DollarSign, Calendar } from "lucide-react"
import type { Quote } from "@/lib/types"

interface DashboardStatsProps {
  quotes: Quote[]
}

export function DashboardStats({ quotes }: DashboardStatsProps) {
  const totalQuotes = quotes.length
  const totalRevenue = quotes.reduce((sum, quote) => sum + quote.totaux.totalGeneral, 0)
  const averageQuoteValue = totalQuotes > 0 ? totalRevenue / totalQuotes : 0
  const thisMonthQuotes = quotes.filter((quote) => {
    const quoteDate = new Date(quote.date)
    const now = new Date()
    return quoteDate.getMonth() === now.getMonth() && quoteDate.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Devis</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQuotes}</div>
          <p className="text-xs text-muted-foreground">Tous les devis créés</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} €</div>
          <p className="text-xs text-muted-foreground">Montant total des devis</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valeur Moyenne</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageQuoteValue.toFixed(2)} €</div>
          <p className="text-xs text-muted-foreground">Par devis</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ce Mois</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{thisMonthQuotes}</div>
          <p className="text-xs text-muted-foreground">Devis créés ce mois</p>
        </CardContent>
      </Card>
    </div>
  )
}
