import { QuoteForm } from "@/components/quote-form"

export default function NewQuotePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouveau Devis</h1>
          <p className="text-muted-foreground">Créez un nouveau devis avec tous les détails nécessaires</p>
        </div>

        <QuoteForm />
      </div>
    </div>
  )
}
