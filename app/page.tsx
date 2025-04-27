"use client"

import { useEffect, useState } from "react"
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
import { DashboardSkeleton, ApplicationTableSkeleton, UserInfoSkeleton } from "@/components/loading-states"
import { AnimatePresence, motion } from "framer-motion"
import { JobTrackerStructuredData } from "@/components/structured-data"

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
      try {
        let data = getApplications()

        // Si no hay datos, cargar ejemplos
        if (data.length === 0) {
          seedExampleData()
          data = getApplications()
        }

        // Simular carga para mostrar los estados de carga
        setTimeout(() => {
          setApplications(data)
          setIsLoading(false)
        }, 800)
      } catch (error) {
        console.error("Error al cargar aplicaciones:", error)
        setIsLoading(false)
      }
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

    // Cerrar el modal de detalles
    setSelectedApplication(null)

    // Recargar aplicaciones directamente
    const loadApplications = () => {
      const data = getApplications()
      setApplications(data)
    }

    loadApplications()
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Datos estructurados para SEO */}
      <JobTrackerStructuredData />

      <Navbar onNewApplication={handleNewApplication} activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeVariants}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "dashboard" &&
              (isLoading ? (
                <DashboardSkeleton />
              ) : (
                <Dashboard
                  applications={applications}
                  isLoading={isLoading}
                  onNewApplication={handleNewApplication}
                  onApplicationClick={handleApplicationClick}
                />
              ))}

            {activeTab === "applications" &&
              (isLoading ? (
                <ApplicationTableSkeleton />
              ) : (
                <ApplicationsList
                  applications={applications}
                  isLoading={isLoading}
                  onApplicationClick={handleApplicationClick}
                />
              ))}

            {activeTab === "user-info" && (isLoading ? <UserInfoSkeleton /> : <UserInfoPanel />)}

            {activeTab === "config" && <ConfigPanel />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {newModalOpen && (
        <ApplicationModal open={newModalOpen} onClose={handleNewModalClose} onSave={handleApplicationSaved} />
      )}

      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          open={!!selectedApplication}
          onClose={handleCloseDetailsModal}
          onUpdate={handleApplicationUpdated}
        />
      )}
    </div>
  )
}
