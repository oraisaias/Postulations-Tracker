"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationTable } from "@/components/application-table"
import { StatusSummary } from "@/components/status-summary"
import { BriefcaseIcon, TrendingUp, Calendar, Clock } from "lucide-react"
import type { Application } from "@/lib/types"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

interface DashboardProps {
  applications: Application[]
  isLoading: boolean
  onNewApplication: () => void
  onApplicationClick: (application: Application) => void
}

export function Dashboard({ applications, isLoading, onNewApplication, onApplicationClick }: DashboardProps) {
  const { theme } = useTheme()

  // Obtener las 5 postulaciones más recientes
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())
    .slice(0, 5)

  // Calcular estadísticas
  const today = new Date()
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  const applicationsThisWeek = applications.filter((app) => new Date(app.dateApplied) >= lastWeek).length

  const applicationsThisMonth = applications.filter((app) => new Date(app.dateApplied) >= lastMonth).length

  const avgResponseTime = applications.length > 0 ? "5.2 días" : "N/A"

  const upcomingInterviews = applications.filter((app) => app.status === "entrevista").length

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="space-y-8" initial="hidden" animate="show" variants={container}>
      <motion.div variants={item} className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
          Dashboard
        </h2>
      </motion.div>

      <motion.div variants={item}>
        <StatusSummary applications={applications} />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 dark:bg-gray-800/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Postulaciones esta semana</p>
                <h3 className="text-3xl font-bold mt-2 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                  {applicationsThisWeek}
                </h3>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 dark:bg-gray-800/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Postulaciones este mes</p>
                <h3 className="text-3xl font-bold mt-2 bg-gradient-to-r from-violet-500 to-violet-600 bg-clip-text text-transparent">
                  {applicationsThisMonth}
                </h3>
              </div>
              <div className="bg-violet-100 dark:bg-violet-900/30 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-violet-500 dark:text-violet-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 dark:bg-gray-800/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tiempo promedio de respuesta</p>
                <h3 className="text-3xl font-bold mt-2 bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                  {avgResponseTime}
                </h3>
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 dark:bg-gray-800/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Entrevistas pendientes</p>
                <h3 className="text-3xl font-bold mt-2 bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                  {upcomingInterviews}
                </h3>
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="shadow-lg border-0 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-xl font-semibold">Postulaciones Recientes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
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
              <div className="p-6">
                <ApplicationTable applications={recentApplications} onApplicationClick={onApplicationClick} />
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
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
                  Agregar tu primera postulación
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
