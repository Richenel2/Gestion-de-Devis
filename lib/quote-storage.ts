"use client"

import type { Quote } from "./types"
import { quotesToCSV, csvToQuotes } from "./csv-utils"

const STORAGE_KEY = "quotes_data"

export function saveQuotes(quotes: Quote[]): void {
  try {
    const json = JSON.stringify(quotes)
    localStorage.setItem(STORAGE_KEY, json)
    console.log("[v0] Quotes saved successfully:", quotes.length)
  } catch (error) {
    console.error("[v0] Error saving quotes:", error)
    throw error
  }
}

export function loadQuotes(): Quote[] {
  if (typeof window === "undefined") return []

  try {
    const json = localStorage.getItem(STORAGE_KEY)
    if (!json) {
      console.log("[v0] No quotes found in storage")
      return []
    }

    const quotes = JSON.parse(json) as Quote[]
    console.log("[v0] Quotes loaded successfully:", quotes.length)
    return quotes
  } catch (error) {
    console.error("[v0] Error loading quotes:", error)
    return []
  }
}

export function getAllQuotes(): Quote[] {
  return loadQuotes()
}

export function getAllQuoteIds(): string[] {
  return loadQuotes().map((value)=>value.id)
}

export function addQuote(quote: Quote): void {
  console.log("[v0] addQuote called with:", quote)
  try {
    const quotes = loadQuotes()
    console.log("[v0] Existing quotes loaded:", quotes.length)
    quotes.push(quote)
    saveQuotes(quotes)
    console.log("[v0] Quote saved, total quotes now:", quotes.length)
  } catch (error) {
    console.error("[v0] Error in addQuote:", error)
    throw error
  }
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
  const quotes = loadQuotes()
  const filtered = quotes.filter((q) => q.id !== id)
  saveQuotes(filtered)
}

export function getQuoteById(id: string): Quote | undefined {
  const quotes = loadQuotes()
  return quotes.find((q) => q.id === id)
}

export function downloadCSV(): void {
  const quotes = loadQuotes()
  const csv = quotesToCSV(quotes)
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `devis_${new Date().toISOString().split("T")[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
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
