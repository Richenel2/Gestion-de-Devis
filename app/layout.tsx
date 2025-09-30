import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AppNavigation } from "@/components/app-navigation"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Gestion de Devis",
  description: "Application de génération et gestion de devis",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
      <Suspense fallback={<div>Loading...</div>}>
          <AppNavigation />
          {children}
        </Suspense>
      </body>
    </html>
  )
}
