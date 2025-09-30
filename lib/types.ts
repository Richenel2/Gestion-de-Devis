export interface Quote {
  id: string
  numeroDevis: string
  date: string // Main date field for the quote (editable by user)
  distanceParcourue: number
  tempsTrajetAlle: number
  nombreTechniciens: number
  totalTrajet: number
  heuresTravailNormales: number
  totalHeuresNormales: number
  heuresSUP: number
  totalHsup: number
  outillageFourniture: number
  travailEffectue: string
  prixUnitaires: PrixUnitaires
  totaux: Totaux
}

export interface PrixUnitaires {
  fraisKilometriques: number
  fraisRoute: number
  tempsTravail: number
  tempsTravailMajore: number
  outillageFourniture: number
}

export interface Totaux {
  totalDistance: number
  totalHeuresTravail: number
  totalHeuresMajorees: number
  totalOutillage: number
  fraisKilometriquesTotal: number
  fraisRouteTotal: number
  tempsTravailTotal: number
  tempsTravailMajoreTotal: number
  outillageTotal: number
  totalGeneral: number
}

export const DEFAULT_PRIX_UNITAIRES: PrixUnitaires = {
  fraisKilometriques: 1.8,
  fraisRoute: 50,
  tempsTravail: 58,
  tempsTravailMajore: 72.5,
  outillageFourniture: 1,
}
