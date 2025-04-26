"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationTable } from "@/components/application-table"
import type { Application } from "@/lib/types"
import { getApplications } from "@/lib/storage"

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadApplications = () => {
      const data = getApplications()
      setApplications(data)
      setIsLoading(false)
    }

    loadApplications()
    window.addEventListener("storage", loadApplications)

    return () => {
      window.removeEventListener("storage", loadApplications)
    }
  }, [])

  // Ordenar por fecha de aplicación (más reciente primero)
  const sortedApplications = [...applications].sort(
    (a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime(),
  )

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Todas las Postulaciones</h1>
        <Link href="/applications/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Postulación
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Postulaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-4">Cargando postulaciones...</p>
          ) : sortedApplications.length > 0 ? (
            <ApplicationTable applications={sortedApplications} />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay postulaciones registradas.</p>
              <p className="mt-2">
                <Link href="/applications/new">
                  <Button variant="link">Agregar tu primera postulación</Button>
                </Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
