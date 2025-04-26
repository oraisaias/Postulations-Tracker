"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ApplicationForm } from "@/components/application-form"
import type { Application } from "@/lib/types"
import { getApplicationById, updateApplication } from "@/lib/storage"

export default function EditApplicationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [application, setApplication] = useState<Application | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadApplication = () => {
      const data = getApplicationById(params.id)
      setApplication(data)
      setIsLoading(false)
    }

    loadApplication()
  }, [params.id])

  const handleSubmit = async (data: Omit<Application, "id" | "createdAt" | "updatedAt">) => {
    if (!application) return

    setIsSubmitting(true)

    try {
      const updatedApplication: Application = {
        ...data,
        id: application.id,
        createdAt: application.createdAt,
        updatedAt: new Date().toISOString(),
      }

      updateApplication(updatedApplication)
      router.push(`/applications/${application.id}`)
    } catch (error) {
      console.error("Error al actualizar la postulación:", error)
      setIsSubmitting(false)
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
      <div className="flex items-center gap-4">
        <Link href={`/applications/${application.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Editar Postulación</h1>
      </div>
      <ApplicationForm onSubmit={handleSubmit} isSubmitting={isSubmitting} defaultValues={application} />
    </div>
  )
}
