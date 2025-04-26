"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationTable } from "@/components/application-table"
import { StatusSummary } from "@/components/status-summary"
import { PlusCircle } from "lucide-react"
import type { Application } from "@/lib/types"

interface DashboardProps {
  applications: Application[]
  isLoading: boolean
  onNewApplication: () => void
  onApplicationClick: (application: Application) => void
}

export function Dashboard({ applications, isLoading, onNewApplication, onApplicationClick }: DashboardProps) {
  // Obtener las 5 postulaciones más recientes
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
          Dashboard
        </h2>
        <Button
          onClick={onNewApplication}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white shadow-md transition-all duration-300 hover:shadow-lg"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Postulación
        </Button>
      </div>

      <StatusSummary applications={applications} />

      <Card className="shadow-card border-0 dark:bg-gray-900">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Postulaciones Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : recentApplications.length > 0 ? (
            <ApplicationTable applications={recentApplications} onApplicationClick={onApplicationClick} />
          ) : (
            <div className="text-center py-12 px-4">
              <div className="bg-primary-50 dark:bg-gray-800 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <BriefcaseIcon className="h-8 w-8 text-primary-500 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No hay postulaciones registradas
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Comienza a registrar tus postulaciones para hacer seguimiento de tu búsqueda laboral.
              </p>
              <Button
                onClick={onNewApplication}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Agregar tu primera postulación
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

import { BriefcaseIcon } from "lucide-react"
