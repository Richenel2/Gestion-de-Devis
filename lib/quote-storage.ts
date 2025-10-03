"use client"

import type { Quote } from "./types"
import { quotesToCSV, csvToQuotes } from "./csv-utils"
import { writeTextFile, readTextFile, BaseDirectory,create,mkdir} from "@tauri-apps/plugin-fs"
import { exists } from "@tauri-apps/plugin-fs"
import { save } from "@tauri-apps/plugin-dialog"
import { resolveResource } from "@tauri-apps/api/path"

const STORAGE_KEY = "quotes_data"
const FILE_NAME = "quotes_data.json"

// Helper : sauvegarde asynchrone dans AppData
async function saveToFileAsync(quotes: Quote[]) {
  try {
    // On résout le chemin vers AppData
    const folderExists = await exists("", { baseDir: BaseDirectory.AppData })
    if (!folderExists) await mkdir("", { baseDir: BaseDirectory.AppData })
    const fileExists = await exists(FILE_NAME, { baseDir: BaseDirectory.AppData })

    if (!fileExists) (await create(FILE_NAME,{baseDir:BaseDirectory.AppData})).close()
    await writeTextFile(FILE_NAME, JSON.stringify(quotes, null, 2), { baseDir: BaseDirectory.AppData })

    console.log("[v1] Quotes saved to AppData:", FILE_NAME)
  } catch (error) {
    console.error("[v1] Error saving quotes to file:", error)
  }
}

// Chargement initial depuis fichier AppData (appelé une fois au start)
export async function loadQuotesFromFile(): Promise<void> {
  try {
    const fileExists = await exists(FILE_NAME, { baseDir: BaseDirectory.AppData })
    if (!fileExists) return

    const json = await readTextFile(FILE_NAME, { baseDir: BaseDirectory.AppData })
    localStorage.setItem(STORAGE_KEY, json)
    console.log("[v1] Quotes loaded from AppData:", JSON.parse(json).length)
  } catch (error) {
    console.error("[v1] Error loading quotes from file:", error)
  }
}

// ----------------- Fonctions synchrones -----------------

export function saveQuotes(quotes: Quote[]): void {
  try {
    const json = JSON.stringify(quotes)
    localStorage.setItem(STORAGE_KEY, json)
    console.log("[v0] Quotes saved successfully:", quotes.length)

    // Sauvegarde asynchrone sur disque (ne bloque pas)
    saveToFileAsync(quotes)
  } catch (error) {
    console.error("[v0] Error saving quotes:", error)
    throw error
  }
}

export function loadQuotes(): Quote[] {
  if (typeof window === "undefined") return []

  try {
    const json = localStorage.getItem(STORAGE_KEY)
    if (!json) return []
    return JSON.parse(json) as Quote[]
  } catch (error) {
    console.error("[v0] Error loading quotes:", error)
    return []
  }
}

export function getAllQuotes(): Quote[] {
  return loadQuotes()
}

export function getAllQuoteIds(): string[] {
  return loadQuotes().map((value) => value.id)
}

export function addQuote(quote: Quote): void {
  const quotes = loadQuotes()
  quotes.push(quote)
  saveQuotes(quotes)
}

export function updateQuote(id: string, updatedQuote: Quote): void {
  const quotes = loadQuotes()
  const index = quotes.findIndex((q) => q.id === id)
  if (index !== -1) {
    quotes[index] = updatedQuote
    saveQuotes(quotes)
  }
}

export function deleteQuote(id: string): void {
  const quotes = loadQuotes().filter((q) => q.id !== id)
  saveQuotes(quotes)
}

export function getQuoteById(id: string): Quote | undefined {
  return loadQuotes().find((q) => q.id === id)
}

// ----------------- CSV -----------------

export function downloadCSV(): void {
  try {
    const quotes = loadQuotes()
    const csv = quotesToCSV(quotes)

    // Boîte de dialogue native pour choisir le chemin
    save({
      defaultPath: `devis_${new Date().toISOString().split("T")[0]}.csv`,
      filters: [{ name: "CSV Files", extensions: ["csv"] }],
    }).then((path) => {
      if (path) {
        // Écriture asynchrone sur disque
        writeTextFile(path, csv, { baseDir: BaseDirectory.Desktop }).then(() => {
          console.log("[v1] CSV exporté avec succès :", path)
        }).catch((err) => console.error("[v1] Erreur écriture CSV :", err))
      } else {
        console.log("[v1] Export CSV annulé par l'utilisateur")
      }
    }).catch((err) => console.error("[v1] Erreur dialogue CSV :", err))
  } catch (error) {
    console.error("[v1] Erreur downloadCSV :", error)
  }
}

export function uploadCSV(file: File): Promise<Quote[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string
        const quotes = csvToQuotes(csv)
        saveQuotes(quotes)
        resolve(quotes)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}
