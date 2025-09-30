"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Trash2 } from "lucide-react"
import type { Quote } from "@/lib/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

interface QuoteListTableProps {
  quotes: Quote[]
  onDelete: (id: string) => void
}

export function QuoteListTable({ quotes, onDelete }: QuoteListTableProps) {
  if (quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">Aucun devis trouvé</p>
        <p className="text-sm text-muted-foreground">Créez votre premier devis pour commencer</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro</TableHead>
            <TableHead>Date de Création</TableHead>
            <TableHead>Lignes</TableHead>
            <TableHead>Montant Total</TableHead>
            <TableHead>Travaux</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => (
            <TableRow key={quote.id}>
              <TableCell className="font-medium">{quote.numeroDevis}</TableCell>
              <TableCell>{format(new Date(quote.date), "dd MMM yyyy", { locale: fr })}</TableCell>
              <TableCell>
                <Badge variant="secondary">1 ligne(s)</Badge>
              </TableCell>
              <TableCell className="font-semibold">{quote.totaux.totalGeneral.toFixed(2)} €</TableCell>
              <TableCell className="max-w-[200px] truncate">{quote.travailEffectue || "N/A"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/devis?id=${quote.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm("Êtes-vous sûr de vouloir supprimer ce devis ?")) {
                        onDelete(quote.id)
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
