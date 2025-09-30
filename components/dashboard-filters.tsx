"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface DashboardFiltersProps {
  dateRange: { from: Date | undefined; to: Date | undefined }
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
}

export function DashboardFilters({ dateRange, onDateRangeChange }: DashboardFiltersProps) {
  const handleClearFilters = () => {
    onDateRangeChange({ from: undefined, to: undefined })
  }

  const hasFilters = dateRange.from || dateRange.to

  return (
    <div className="flex flex-wrap items-center gap-4">
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
              <span>Sélectionner une période</span>
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

      {hasFilters && (
        <Button variant="ghost" onClick={handleClearFilters} size="sm">
          <X className="mr-2 h-4 w-4" />
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  )
}
