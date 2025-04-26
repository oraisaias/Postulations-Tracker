"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

import { ApplicationForm } from "@/components/application-form"
import type { Application } from "@/lib/types"
import { addApplication } from "@/lib/storage"

export default function NewApplicationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: Omit<Application, "id" | "createdAt" | "updatedAt">) => {
    setIsSubmitting(true)

    try {
      const newApplication: Application = {
        ...data,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      addApplication(newApplication)
      router.push("/applications")
    } catch (error) {
      console.error("Error al guardar la postulación:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Nueva Postulación</h1>
      <ApplicationForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}
