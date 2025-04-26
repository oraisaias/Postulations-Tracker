"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeProvider } from "@/components/theme-provider"
import { Dashboard } from "@/components/dashboard"
import { ApplicationsList } from "@/components/applications-list"
import { ConfigPanel } from "@/components/config-panel"
import { UserInfoPanel } from "@/components/user-info-panel"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ApplicationModal } from "@/components/application-modal"
import { ApplicationDetailsModal } from "@/components/application-details-modal"
import { getApplications, seedExampleData } from "@/lib/storage"
import type { Application } from "@/lib/types"
import { useTheme } from "next-themes"

export default function Home() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newModalOpen, setNewModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const { theme } = useTheme()

  useEffect(() => {
    // Cargar datos del localStorage
    const loadApplications = () => {
      let data = getApplications()

      // Si no hay datos, cargar ejemplos
      if (data.length === 0) {
        seedExampleData()
        data = getApplications()
      }

      setApplications(data)
      setIsLoading(false)
    }

    loadApplications()

    // Escuchar cambios en localStorage de otras pestañas
    window.addEventListener("storage", loadApplications)

    // Escuchar evento personalizado para recargar aplicaciones
    window.addEventListener("applications-updated", loadApplications)

    return () => {
      window.removeEventListener("storage", loadApplications)
      window.removeEventListener("applications-updated", loadApplications)
    }
  }, [])

  const handleApplicationClick = (application: Application) => {
    setSelectedApplication(application)
  }

  const handleCloseDetailsModal = () => {
    setSelectedApplication(null)
  }

  const handleNewApplication = () => {
    setNewModalOpen(true)
  }

  const handleNewModalClose = () => {
    setNewModalOpen(false)
  }

  const handleApplicationSaved = () => {
    // Disparar evento para recargar aplicaciones
    window.dispatchEvent(new Event("applications-updated"))
    setNewModalOpen(false)
  }

  const handleApplicationUpdated = () => {
    // Disparar evento para recargar aplicaciones
    window.dispatchEvent(new Event("applications-updated"))
    setSelectedApplication(null)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <Navbar onNewApplication={handleNewApplication} activeTab={activeTab} />

        <main className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
              >
                Todas las Postulaciones
              </TabsTrigger>
              <TabsTrigger
                value="user-info"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
              >
                Mi Información
              </TabsTrigger>
              <TabsTrigger
                value="config"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
              >
                Configuración
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <Dashboard
                applications={applications}
                isLoading={isLoading}
                onNewApplication={handleNewApplication}
                onApplicationClick={handleApplicationClick}
              />
            </TabsContent>

            <TabsContent value="applications">
              <ApplicationsList
                applications={applications}
                isLoading={isLoading}
                onApplicationClick={handleApplicationClick}
              />
            </TabsContent>

            <TabsContent value="user-info">
              <UserInfoPanel />
            </TabsContent>

            <TabsContent value="config">
              <ConfigPanel />
            </TabsContent>
          </Tabs>
        </main>

        <Footer />

        <ApplicationModal open={newModalOpen} onClose={handleNewModalClose} onSave={handleApplicationSaved} />

        {selectedApplication && (
          <ApplicationDetailsModal
            application={selectedApplication}
            open={!!selectedApplication}
            onClose={handleCloseDetailsModal}
            onUpdate={handleApplicationUpdated}
          />
        )}
      </div>
    </ThemeProvider>
  )
}
