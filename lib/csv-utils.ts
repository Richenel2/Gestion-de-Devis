import { type Quote, type PrixUnitaires, type Totaux, DEFAULT_PRIX_UNITAIRES } from "./types"

export function calculateTotaux(quote: Partial<Quote>, prixUnitaires: PrixUnitaires): Totaux {
  const totalDistance = quote.distanceParcourue || 0
  const totalHeuresTravail = quote.totalHeuresNormales || 0
  const totalHeuresMajorees = quote.totalHsup || 0
  const totalOutillage = quote.outillageFourniture || 0
  const totalTrajetHours = quote.totalTrajet || 0

  const fraisKilometriquesTotal = totalDistance * prixUnitaires.fraisKilometriques
  const fraisRouteTotal = prixUnitaires.fraisRoute * totalTrajetHours
  const tempsTravailTotal = totalHeuresTravail * prixUnitaires.tempsTravail
  const tempsTravailMajoreTotal = totalHeuresMajorees * prixUnitaires.tempsTravailMajore
  const outillageTotal = totalOutillage * prixUnitaires.outillageFourniture

  const totalGeneral =
    fraisKilometriquesTotal + fraisRouteTotal + tempsTravailTotal + tempsTravailMajoreTotal + outillageTotal

  return {
    totalDistance,
    totalHeuresTravail,
    totalHeuresMajorees,
    totalOutillage,
    fraisKilometriquesTotal,
    fraisRouteTotal,
    tempsTravailTotal,
    tempsTravailMajoreTotal,
    outillageTotal,
    totalGeneral,
  }
}
// Petite fonction utilitaire
function formatNumber(value: any): string {
  if (typeof value === "number") {
    return String(value).replace(".", ",")
  }
  if (typeof value === "string" && /^\d+\.\d+$/.test(value)) {
    return value.replace(".", ",")
  }
  return String(value) // si ce n’est pas un nombre, on le garde tel quel
}


export function quotesToCSV(quotes: Quote[]): string {
  const headers = [
    "ID",
    "Numero Devis",
    "Date",
    "Distance Parcourue",
    "Temps Trajet Alle",
    "Nombre Techniciens",
    "Total Trajet",
    "Heures Travail Normales",
    "Total Heures Normales",
    "Heures SUP",
    "Total Hsup",
    "Outillage Fourniture",
    "Travail Effectue",
    "PU Frais Kilometriques",
    "PU Frais Route",
    "PU Temps Travail",
    "PU Temps Travail Majore",
    "PU Outillage",
    "Total General",
  ]

  const rows = quotes.map((quote) => [
    quote.id,
    quote.numeroDevis,
    quote.date,
    formatNumber(quote.distanceParcourue),
    formatNumber(quote.tempsTrajetAlle),
    formatNumber(quote.nombreTechniciens),
    formatNumber(quote.totalTrajet),
    formatNumber(quote.heuresTravailNormales),
    formatNumber(quote.totalHeuresNormales),
    formatNumber(quote.heuresSUP),
    formatNumber(quote.totalHsup),
    formatNumber(quote.outillageFourniture),
    quote.travailEffectue, // texte → on ne touche pas
    formatNumber(quote.prixUnitaires.fraisKilometriques),
    formatNumber(quote.prixUnitaires.fraisRoute),
    formatNumber(quote.prixUnitaires.tempsTravail),
    formatNumber(quote.prixUnitaires.tempsTravailMajore),
    formatNumber(quote.prixUnitaires.outillageFourniture),
    formatNumber(quote.totaux.totalGeneral),
  ])

  return [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\n")
}

export function csvToQuotes(csv: string): Quote[] {
  const lines = csv.split("\n").filter((line) => line.trim())
  if (lines.length < 2) return []

  const quotes: Quote[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",")
    const [
      id,
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
      puFraisKm,
      puFraisRoute,
      puTempsTravail,
      puTempsTravailMajore,
      puOutillage,
      totalGeneral,
    ] = values

    const prixUnitaires = {
      fraisKilometriques: Number.parseFloat(puFraisKm) || DEFAULT_PRIX_UNITAIRES.fraisKilometriques,
      fraisRoute: Number.parseFloat(puFraisRoute) || DEFAULT_PRIX_UNITAIRES.fraisRoute,
      tempsTravail: Number.parseFloat(puTempsTravail) || DEFAULT_PRIX_UNITAIRES.tempsTravail,
      tempsTravailMajore: Number.parseFloat(puTempsTravailMajore) || DEFAULT_PRIX_UNITAIRES.tempsTravailMajore,
      outillageFourniture: Number.parseFloat(puOutillage) || DEFAULT_PRIX_UNITAIRES.outillageFourniture,
    }

    quotes.push({
      id,
      numeroDevis,
      date,
      distanceParcourue: Number.parseFloat(distanceParcourue) || 0,
      tempsTrajetAlle: Number.parseFloat(tempsTrajetAlle) || 0,
      nombreTechniciens: Number.parseFloat(nombreTechniciens) || 0,
      totalTrajet: Number.parseFloat(totalTrajet) || 0,
      heuresTravailNormales: Number.parseFloat(heuresTravailNormales) || 0,
      totalHeuresNormales: Number.parseFloat(totalHeuresNormales) || 0,
      heuresSUP: Number.parseFloat(heuresSUP) || 0,
      totalHsup: Number.parseFloat(totalHsup) || 0,
      outillageFourniture: Number.parseFloat(outillageFourniture) || 0,
      travailEffectue,
      prixUnitaires,
      totaux: {
        totalDistance: 0,
        totalHeuresTravail: 0,
        totalHeuresMajorees: 0,
        totalOutillage: 0,
        fraisKilometriquesTotal: 0,
        fraisRouteTotal: 0,
        tempsTravailTotal: 0,
        tempsTravailMajoreTotal: 0,
        outillageTotal: 0,
        totalGeneral: Number.parseFloat(totalGeneral) || 0,
      },
    })
  }

  return quotes
}
