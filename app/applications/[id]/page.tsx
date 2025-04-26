"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import type { Application } from "@/lib/types"
import { getApplicationById, deleteApplication } from "@/lib/storage"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [application, setApplication] = useState<Application | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadApplication = () => {
      const data = getApplicationById(params.id)
      setApplication(data)
      setIsLoading(false)
    }

    loadApplication()
    window.addEventListener("storage", loadApplication)

    return () => {
      window.removeEventListener("storage", loadApplication)
    }
  }, [params.id])

  const handleDelete = () => {
    if (application) {
      deleteApplication(application.id)
      router.push("/applications")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <p className="text-center">Cargando detalles de la postulación...</p>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="container mx-auto py-6">
        <p className="text-center">No se encontró la postulación</p>
        <div className="flex justify-center mt-4">
          <Link href="/applications">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a postulaciones
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/applications">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{application.company}</h1>
          <StatusBadge status={application.status} />
        </div>
        <div className="flex gap-2">
          <Link href={`/applications/${application.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente esta postulación.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Postulación</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Empresa</h3>
            <p className="mt-1">{application.company}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Puesto</h3>
            <p className="mt-1">{application.position}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Fecha de Aplicación</h3>
            <p className="mt-1">{new Date(application.dateApplied).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Estado</h3>
            <p className="mt-1">
              <StatusBadge status={application.status} />
            </p>
          </div>
          {application.salary && (
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Salario</h3>
              <p className="mt-1">{application.salary}</p>
            </div>
          )}
          {application.jobUrl && (
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">URL de la Oferta</h3>
              <p className="mt-1">
                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Ver oferta
                </a>
              </p>
            </div>
          )}
        </CardContent>
        {application.notes && (
          <CardFooter className="flex flex-col items-start">
            <h3 className="font-medium text-sm text-muted-foreground">Notas</h3>
            <p className="mt-1 whitespace-pre-line">{application.notes}</p>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
