"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AppNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      label: "Tableau de Bord",
      icon: LayoutDashboard,
    },
    {
      href: "/devis",
      label: "Liste des Devis",
      icon: FileText,
    },
  ]

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                D
              </div>
              <span className="text-xl font-bold">Gestion Devis</span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn("gap-2", isActive && "bg-secondary")}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          <Link href="/devis/nouveau">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Devis
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
