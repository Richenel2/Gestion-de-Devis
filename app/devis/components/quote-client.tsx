"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getQuoteById } from "@/lib/quote-storage"
import type { Quote } from "@/lib/types"
import { QuoteInvoiceView } from "@/components/quote-invoice-view"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import { generatePDF } from "@/lib/pdf-utils"

export function QuoteClient({ id }: { id: string }) {
  const router = useRouter()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadedQuote = getQuoteById(id)
    if (loadedQuote) {
      setQuote(loadedQuote)
    } else {
      router.push("/devis")
    }
  }, [id, router])

  const handleDownloadPDF = async () => {
    if (!quote) return

    setIsGeneratingPDF(true)
    try {
      await generatePDF("quote-invoice", `devis_${quote.numeroDevis}.pdf`)
    } catch (error) {
      setError("Erreur lors de la génération du PDF")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/devis")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Button>
          <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF}>
            <Download className="mr-2 h-4 w-4" />
            {isGeneratingPDF ? "Génération..." : "Télécharger PDF"}
          </Button>
        </div>

        <QuoteInvoiceView quote={quote} />
      </div>
    </div>
  )
}