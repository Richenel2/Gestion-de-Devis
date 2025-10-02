"use client"

import { save } from "@tauri-apps/plugin-dialog"
import { writeFile } from "@tauri-apps/plugin-fs"

export async function generatePDF(elementId: string, filename: string) {
  const html2image = await import("html-to-image")
  const jsPDF = (await import("jspdf")).default

  const element = document.getElementById(elementId)
  if (!element) throw new Error(`Element with id "${elementId}" not found`)

  const dataUrl = await html2image.toPng(element, {
    cacheBust: true,
    backgroundColor: "#ffffff",
    pixelRatio: 2,
  })

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
  const imgProps = pdf.getImageProperties(dataUrl)
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

  pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight)

  // 🔥 PDF en bytes
  const pdfBytes = pdf.output("arraybuffer")

  // Boîte de dialogue native
  const path = await save({
    defaultPath: filename,
    filters: [{ name: "PDF", extensions: ["pdf"] }],
  })

  if (path) {
    await writeFile(path, new Uint8Array(pdfBytes) )
    console.log("✅ PDF enregistré :", path)
  }
}
