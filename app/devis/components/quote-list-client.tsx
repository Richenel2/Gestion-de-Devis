"use client"

import { useEffect, useState } from "react"
import { loadQuotes, deleteQuote, downloadCSV } from "@/lib/quote-storage"
import type { Quote } from "@/lib/types"
import { QuoteListFilters } from "@/components/quote-list-filters"
import { QuoteListTable } from "@/components/quote-list-table"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function QuotesListClient() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const loadedQuotes = loadQuotes()
    setQuotes(loadedQuotes)
    setFilteredQuotes(loadedQuotes)
  }

  useEffect(() => {
    let filtered = quotes

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (quote) =>
          quote.numeroDevis.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.travailEffectue.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((quote) => {
        const quoteDate = new Date(quote.date)
        if (dateRange.from && quoteDate < dateRange.from) return false
        if (dateRange.to && quoteDate > dateRange.to) return false
        return true
      })
    }

    // Filter by amount range
    if (minAmount) {
      filtered = filtered.filter((quote) => quote.totaux.totalGeneral >= Number.parseFloat(minAmount))
    }
    if (maxAmount) {
      filtered = filtered.filter((quote) => quote.totaux.totalGeneral <= Number.parseFloat(maxAmount))
    }

    setFilteredQuotes(filtered)
  }, [quotes, searchTerm, dateRange, minAmount, maxAmount])

  const handleDelete = (id: string) => {
    deleteQuote(id)
    loadData()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Liste des Devis</h1>
            <p className="text-muted-foreground">Gérez et consultez tous vos devis</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadCSV}>
              <Download className="mr-2 h-4 w-4" />
              Exporter Excel
            </Button>
          </div>
        </div>

        <QuoteListFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          minAmount={minAmount}
          onMinAmountChange={setMinAmount}
          maxAmount={maxAmount}
          onMaxAmountChange={setMaxAmount}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredQuotes.length} devis trouvé(s) sur {quotes.length} total
            </p>
          </div>
          <QuoteListTable quotes={filteredQuotes} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  )
}
