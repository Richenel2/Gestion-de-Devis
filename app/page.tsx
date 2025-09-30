"use client"

import { useEffect, useState } from "react"
import { loadQuotes } from "@/lib/quote-storage"
import type { Quote } from "@/lib/types"
import { DashboardStats } from "@/components/dashboard-stats"
import { RevenueChart } from "@/components/revenue-chart"
import { CostBreakdownChart } from "@/components/cost-breakdown-chart"
import { DashboardFilters } from "@/components/dashboard-filters"

export default function DashboardPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  useEffect(() => {
    const loadedQuotes = loadQuotes()
    setQuotes(loadedQuotes)
    setFilteredQuotes(loadedQuotes)
  }, [])

  useEffect(() => {
    let filtered = quotes

    if (dateRange.from || dateRange.to) {
      filtered = quotes.filter((quote) => {
        const quoteDate = new Date(quote.date)
        if (dateRange.from && quoteDate < dateRange.from) return false
        if (dateRange.to && quoteDate > dateRange.to) return false
        return true
      })
    }

    setFilteredQuotes(filtered)
  }, [quotes, dateRange])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
            <p className="text-muted-foreground">Analyse et gestion de vos devis</p>
          </div>
        </div>

        <DashboardFilters dateRange={dateRange} onDateRangeChange={setDateRange} />

        <DashboardStats quotes={filteredQuotes} />

        <div className="grid gap-6 md:grid-cols-2">
          <RevenueChart quotes={filteredQuotes} />
          <CostBreakdownChart quotes={filteredQuotes} />
        </div>
      </div>
    </div>
  )
}
