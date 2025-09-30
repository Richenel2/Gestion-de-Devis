"use client"

export async function generatePDF(elementId: string, filename: string) {
  try {
    console.log("[v0] Starting PDF generation for element:", elementId)

    // Dynamic import to avoid SSR issues
    const html2image = (await import("html-to-image"))
    const jsPDF = (await import("jspdf")).default

    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`)
    }

    console.log("[v0] Element found, creating canvas...")

    // Create canvas from HTML element
    const dataUrl = await html2image.toPng(element, {
      cacheBust: true,
      backgroundColor: "#ffffff",
      pixelRatio: 2,
    })

    console.log("[v0] Canvas created, generating PDF...")

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })
    const imgProps = pdf.getImageProperties(dataUrl);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
    pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);

    console.log("[v0] PDF generated successfully, saving...")
    pdf.save(filename)
    console.log("[v0] PDF saved:", filename)
  } catch (error) {
    console.error("[v0] Error in generatePDF:", error)
    throw error
  }
}
