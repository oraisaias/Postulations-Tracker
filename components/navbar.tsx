"use client"

import { BriefcaseIcon, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { ModeToggle } from "@/components/mode-toggle"

interface NavbarProps {
  onNewApplication: () => void
  activeTab: string
}

export function Navbar({ onNewApplication, activeTab }: NavbarProps) {
  const { theme } = useTheme()
  const showNewButton = activeTab === "dashboard" || activeTab === "applications"

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-primary-400 to-secondary-400 p-2 rounded-lg">
              <BriefcaseIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Tracker de Postulaciones
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />
            {showNewButton && (
              <Button
                onClick={onNewApplication}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Nueva Postulación
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
