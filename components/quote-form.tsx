"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import type { Quote, PrixUnitaires } from "@/lib/types"
import { DEFAULT_PRIX_UNITAIRES } from "@/lib/types"
import { calculateTotaux } from "@/lib/csv-utils"
import { addQuote } from "@/lib/quote-storage"
import { useRouter } from "next/navigation"

function showNotification(title: string, body: string) {
  new Notification(title, { body })
}

export function QuoteForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [distanceParcourue, setDistanceParcourue] = useState(0)
  const [tempsTrajetAlle, setTempsTrajetAlle] = useState(0)
  const [nombreTechniciens, setNombreTechniciens] = useState(0)
  const [heuresTravailNormales, setHeuresTravailNormales] = useState(0)
  const [heuresSUP, setHeuresSUP] = useState(0)
  const [outillageFourniture, setOutillageFourniture] = useState(0)
  const [travailEffectue, setTravailEffectue] = useState("")
  const [prixUnitaires, setPrixUnitaires] = useState<PrixUnitaires>(DEFAULT_PRIX_UNITAIRES)

  const totalTrajet = tempsTrajetAlle * nombreTechniciens
  const totalHeuresNormales = heuresTravailNormales * nombreTechniciens
  const totalHsup = heuresSUP * nombreTechniciens
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const dateObj = new Date(date)
      const year = dateObj.getFullYear()
      const month = String(dateObj.getMonth() + 1).padStart(2, "0")
      const day = String(dateObj.getDate()).padStart(2, "0")
      const numeroDevis = `DEVIS-${year}${month}${day}-${Date.now().toString().slice(-3)}`

      const quoteData: Partial<Quote> = {
        distanceParcourue,
        tempsTrajetAlle,
        nombreTechniciens,
        totalTrajet,
        heuresTravailNormales,
        totalHeuresNormales,
        heuresSUP,
        totalHsup,
        outillageFourniture,
      }

      const totaux = calculateTotaux(quoteData, prixUnitaires)

      const quote: Quote = {
        id: `devis-${Date.now()}`,
        numeroDevis,
        date,
        distanceParcourue,
        tempsTrajetAlle,
        nombreTechniciens,
        totalTrajet,
        heuresTravailNormales,
        totalHeuresNormales,
        heuresSUP,
        totalHsup,
        outillageFourniture,
        travailEffectue,
        prixUnitaires,
        totaux,
      }

      addQuote(quote)
      showNotification("Done","Devis créé avec succès!")
      router.push("/devis")
    } catch (error) {
      setError("Erreur lors de l'enregistrement du devis: " + (error instanceof Error ? error.message : "Erreur inconnue"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const quoteData: Partial<Quote> = {
    distanceParcourue,
    tempsTrajetAlle,
    nombreTechniciens,
    totalTrajet,
    heuresTravailNormales,
    totalHeuresNormales,
    heuresSUP,
    totalHsup,
    outillageFourniture,
  }
  const totaux = calculateTotaux(quoteData, prixUnitaires)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations du Devis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date du Devis</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prix Unitaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="puKm">Frais Kilométriques (€/km)</Label>
              <Input
                id="puKm"
                type="number"
                step="0.01"
                value={prixUnitaires.fraisKilometriques}
                onChange={(e) =>
                  setPrixUnitaires({ ...prixUnitaires, fraisKilometriques: Number.parseFloat(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="puRoute">Frais de Route (€/h)</Label>
              <Input
                id="puRoute"
                type="number"
                step="0.01"
                value={prixUnitaires.fraisRoute}
                onChange={(e) => setPrixUnitaires({ ...prixUnitaires, fraisRoute: Number.parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="puTravail">Temps de Travail (€/h)</Label>
              <Input
                id="puTravail"
                type="number"
                step="0.01"
                value={prixUnitaires.tempsTravail}
                onChange={(e) =>
                  setPrixUnitaires({ ...prixUnitaires, tempsTravail: Number.parseFloat(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="puMajore">Temps Majoré (€/h)</Label>
              <Input
                id="puMajore"
                type="number"
                step="0.01"
                value={prixUnitaires.tempsTravailMajore}
                onChange={(e) =>
                  setPrixUnitaires({ ...prixUnitaires, tempsTravailMajore: Number.parseFloat(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="puOutillage">Outillage (€)</Label>
              <Input
                id="puOutillage"
                type="number"
                step="0.01"
                value={prixUnitaires.outillageFourniture}
                onChange={(e) =>
                  setPrixUnitaires({ ...prixUnitaires, outillageFourniture: Number.parseFloat(e.target.value) })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Détails de la Prestation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Distance (km)</Label>
              <Input
                type="number"
                value={distanceParcourue}
                onChange={(e) => setDistanceParcourue(Number.parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Temps Trajet Allé (h)</Label>
              <Input
                type="number"
                step="0.5"
                value={tempsTrajetAlle}
                onChange={(e) => setTempsTrajetAlle(Number.parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Nombre Techniciens</Label>
              <Input
                type="number"
                value={nombreTechniciens}
                onChange={(e) => setNombreTechniciens(Number.parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Trajet (h)</Label>
              <Input type="number" value={totalTrajet} disabled className="bg-muted" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Heures Travail Normales</Label>
              <Input
                type="number"
                step="0.5"
                value={heuresTravailNormales}
                onChange={(e) => setHeuresTravailNormales(Number.parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Heures Normales</Label>
              <Input type="number" value={totalHeuresNormales} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Heures SUP/Samedi</Label>
              <Input
                type="number"
                step="0.5"
                value={heuresSUP}
                onChange={(e) => setHeuresSUP(Number.parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Hsup</Label>
              <Input type="number" value={totalHsup} disabled className="bg-muted" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Outillage et Fourniture</Label>
            <Input
              type="number"
              value={outillageFourniture}
              onChange={(e) => setOutillageFourniture(Number.parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label>Travail Effectué</Label>
            <Textarea
              value={travailEffectue}
              onChange={(e) => setTravailEffectue(e.target.value)}
              placeholder="Description du travail effectué..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Récapitulatif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Frais Kilométriques</p>
              <p className="text-lg font-semibold">{totaux.fraisKilometriquesTotal.toFixed(2)} €</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Frais de Route</p>
              <p className="text-lg font-semibold">{totaux.fraisRouteTotal.toFixed(2)} €</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Temps de Travail</p>
              <p className="text-lg font-semibold">{totaux.tempsTravailTotal.toFixed(2)} €</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Temps Majoré</p>
              <p className="text-lg font-semibold">{totaux.tempsTravailMajoreTotal.toFixed(2)} €</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Outillage et Fourniture</p>
              <p className="text-lg font-semibold">{totaux.outillageTotal.toFixed(2)} €</p>
            </div>
            <div className="space-y-1 md:col-span-2 lg:col-span-1">
              <p className="text-sm text-muted-foreground">TOTAL GÉNÉRAL</p>
              <p className="text-2xl font-bold text-primary">{totaux.totalGeneral.toFixed(2)} €</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/devis")} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Enregistrement..." : "Enregistrer le Devis"}
        </Button>
      </div>
    </form>
  )
}
