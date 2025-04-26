"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationTable } from "@/components/application-table"
import type { Application, ApplicationStatus, WorkType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FilterIcon, SearchIcon } from "lucide-react"

interface ApplicationsListProps {
  applications: Application[]
  isLoading: boolean
  onApplicationClick: (application: Application) => void
}

export function ApplicationsList({ applications, isLoading, onApplicationClick }: ApplicationsListProps) {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "todas">("todas")
  const [locationFilter, setLocationFilter] = useState("")
  const [workTypeFilter, setWorkTypeFilter] = useState<WorkType | "todas">("todas")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Filtrar aplicaciones
  const filteredApplications = applications.filter((app) => {
    // Filtro por estado
    if (statusFilter !== "todas" && app.status !== statusFilter) {
      return false
    }

    // Filtro por ubicación
    if (locationFilter && !app.location?.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false
    }

    // Filtro por tipo de trabajo
    if (workTypeFilter !== "todas" && app.workType !== workTypeFilter) {
      return false
    }

    // Búsqueda por término
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        app.company.toLowerCase().includes(searchLower) ||
        app.position.toLowerCase().includes(searchLower) ||
        (app.location && app.location.toLowerCase().includes(searchLower))
      )
    }

    return true
  })

  // Ordenar por fecha de aplicación (más reciente primero)
  const sortedApplications = [...filteredApplications].sort(
    (a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime(),
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
          Todas las Postulaciones
        </h2>

        <div className="flex gap-2">
          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar postulaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4" />
            <span className="hidden md:inline">Filtros</span>
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="shadow-card border-0 dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as ApplicationStatus | "todas")}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todos los estados</SelectItem>
                    <SelectItem value="enviada">Enviada</SelectItem>
                    <SelectItem value="entrevista">En Entrevista</SelectItem>
                    <SelectItem value="rechazada">Rechazada</SelectItem>
                    <SelectItem value="oferta">Oferta Recibida</SelectItem>
                    <SelectItem value="aceptada">Aceptada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  placeholder="Estado..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workType">Tipo de Trabajo</Label>
                <Select
                  value={workTypeFilter}
                  onValueChange={(value) => setWorkTypeFilter(value as WorkType | "todas")}
                >
                  <SelectTrigger id="workType" className="w-full">
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todos los tipos</SelectItem>
                    <SelectItem value="remoto">Remoto</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                    <SelectItem value="presencial">Presencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter("todas")
                  setLocationFilter("")
                  setWorkTypeFilter("todas")
                  setSearchTerm("")
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-card border-0 dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Postulaciones</CardTitle>
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
          ) : sortedApplications.length > 0 ? (
            <ApplicationTable
              applications={sortedApplications}
              onApplicationClick={onApplicationClick}
              showLocation
              showWorkType
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {applications.length > 0
                  ? "No hay postulaciones que coincidan con los filtros."
                  : "No hay postulaciones registradas."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
