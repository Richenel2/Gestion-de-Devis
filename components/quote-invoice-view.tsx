"use client"
import { Separator } from "@/components/ui/separator"
import type { Quote } from "@/lib/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface QuoteInvoiceViewProps {
  quote: Quote
}

export function QuoteInvoiceView({ quote }: QuoteInvoiceViewProps) {
  return (
  <div id="quote-invoice-wrapper" className="w-full flex justify-center">
    <div id="quote-invoice" className="bg-white text-black p-8 space-y-6 max-w-4xl w-full">
        <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">DEVIS</h1>
          <p className="text-lg font-semibold mt-2">{quote.numeroDevis}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Date</p>
          <p className="font-semibold">{format(new Date(quote.date), "dd MMMM yyyy", { locale: fr })}</p>
        </div>
      </div>

      <Separator className="bg-gray-300" />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Détails de la Prestation</h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-600">Distance parcourue:</span>
              <span className="font-medium">{quote.distanceParcourue} km</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-600">Temps trajet allé:</span>
              <span className="font-medium">{quote.tempsTrajetAlle} h</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-600">Nombre de techniciens:</span>
              <span className="font-medium">{quote.nombreTechniciens}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-600">Total trajet:</span>
              <span className="font-medium">{quote.totalTrajet} h</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-600">Heures travail normales:</span>
              <span className="font-medium">{quote.heuresTravailNormales} h</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-600">Total heures normales:</span>
              <span className="font-medium">{quote.totalHeuresNormales} h</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-600">Heures SUP/Samedi:</span>
              <span className="font-medium">{quote.heuresSUP} h</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-600">Total Hsup:</span>
              <span className="font-medium">{quote.totalHsup} h</span>
            </div>
          </div>
        </div>

        {quote.travailEffectue && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Travail Effectué:</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap border p-3 rounded bg-gray-50">
              {quote.travailEffectue}
            </p>
          </div>
        )}
      </div>

      <Separator className="bg-gray-300" />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Prix Unitaires</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Frais Kilométriques:</span>
              <span className="font-medium">{quote.prixUnitaires.fraisKilometriques.toFixed(2)} € / km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Frais de Route:</span>
              <span className="font-medium">{quote.prixUnitaires.fraisRoute.toFixed(2)} € / h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Temps de Travail:</span>
              <span className="font-medium">{quote.prixUnitaires.tempsTravail.toFixed(2)} € / h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Temps Majoré:</span>
              <span className="font-medium">{quote.prixUnitaires.tempsTravailMajore.toFixed(2)} € / h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Outillage:</span>
              <span className="font-medium">{quote.prixUnitaires.outillageFourniture.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Récapitulatif</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Frais Kilométriques:</span>
              <span className="font-medium">{quote.totaux.fraisKilometriquesTotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Frais de Route:</span>
              <span className="font-medium">{quote.totaux.fraisRouteTotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Temps de Travail:</span>
              <span className="font-medium">{quote.totaux.tempsTravailTotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Temps Majoré:</span>
              <span className="font-medium">{quote.totaux.tempsTravailMajoreTotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Outillage et Fourniture:</span>
              <span className="font-medium">{quote.totaux.outillageTotal.toFixed(2)} €</span>
            </div>
            <Separator className="bg-gray-300 my-2" />
            <div className="flex justify-between text-lg">
              <span className="font-bold">TOTAL:</span>
              <span className="font-bold">{quote.totaux.totalGeneral.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-300">
        <p className="text-xs text-gray-500 text-center">
          Ce devis est valable 30 jours à compter de la date d'émission
        </p>
      </div>
    </div>
    </div>
  )
}
