"use client"

import { BriefcaseIcon, PlusCircle, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { ModeToggle } from "@/components/mode-toggle"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface NavbarProps {
  onNewApplication: () => void
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Navbar({ onNewApplication, activeTab, onTabChange }: NavbarProps) {
  const { theme } = useTheme()
  const showNewButton = activeTab === "dashboard" || activeTab === "applications"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "applications", label: "Postulaciones" },
    { id: "user-info", label: "Mi Información" },
    { id: "config", label: "Configuración" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <nav className="mr-4">
              <ul className="flex space-x-1">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <Button
                      variant="ghost"
                      className={`relative px-3 py-2 ${
                        activeTab === tab.id
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                      onClick={() => onTabChange(tab.id)}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 dark:bg-primary-400"
                          layoutId="activeTab"
                        />
                      )}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
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

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="ml-2">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => {
                      onTabChange(tab.id)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    {tab.label}
                  </Button>
                ))}
              </nav>
              {showNewButton && (
                <Button
                  onClick={() => {
                    onNewApplication()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full mt-4 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nueva Postulación
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
