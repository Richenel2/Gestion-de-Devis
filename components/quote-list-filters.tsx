"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search, X } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface QuoteListFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  dateRange: { from: Date | undefined; to: Date | undefined }
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
  minAmount: string
  onMinAmountChange: (value: string) => void
  maxAmount: string
  onMaxAmountChange: (value: string) => void
}

export function QuoteListFilters({
  searchTerm,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  minAmount,
  onMinAmountChange,
  maxAmount,
  onMaxAmountChange,
}: QuoteListFiltersProps) {
  const handleClearFilters = () => {
    onSearchChange("")
    onDateRangeChange({ from: undefined, to: undefined })
    onMinAmountChange("")
    onMaxAmountChange("")
  }

  const hasFilters = searchTerm || dateRange.from || dateRange.to || minAmount || maxAmount

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par numéro ou travail..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd MMM yyyy", { locale: fr })} -{" "}
                    {format(dateRange.to, "dd MMM yyyy", { locale: fr })}
                  </>
                ) : (
                  format(dateRange.from, "dd MMM yyyy", { locale: fr })
                )
              ) : (
                <span>Période</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => onDateRangeChange({ from: range?.from, to: range?.to })}
              numberOfMonths={2}
              locale={fr}
            />
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Montant min"
            value={minAmount}
            onChange={(e) => onMinAmountChange(e.target.value)}
            className="w-32"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Montant max"
            value={maxAmount}
            onChange={(e) => onMaxAmountChange(e.target.value)}
            className="w-32"
          />
        </div>

        {hasFilters && (
          <Button variant="ghost" onClick={handleClearFilters} size="sm">
            <X className="mr-2 h-4 w-4" />
            Réinitialiser
          </Button>
        )}
      </div>
    </div>
  )
}
