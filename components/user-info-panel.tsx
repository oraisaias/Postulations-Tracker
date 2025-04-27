"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Copy, Edit, Check, ClipboardCheck, Trash2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

import type { UserInfo, WorkType } from "@/lib/types"
import { getUserInfo, saveUserInfo } from "@/lib/storage"

export function UserInfoPanel() {
  const [userInfo, setUserInfo] = useState<UserInfo>(getUserInfo())
  const [isEditing, setIsEditing] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Referencias para las secciones
  const personalRef = useRef<HTMLDivElement>(null)
  const professionalRef = useRef<HTMLDivElement>(null)
  const educationRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Cargar datos del localStorage
    const loadUserInfo = () => {
      const data = getUserInfo()
      setUserInfo(data)
    }

    loadUserInfo()

    // Escuchar evento personalizado para recargar información
    window.addEventListener("user-info-updated", loadUserInfo)

    return () => {
      window.removeEventListener("user-info-updated", loadUserInfo)
    }
  }, [])

  useEffect(() => {
    // Scroll a la sección activa cuando cambia
    if (activeSection) {
      const sectionMap: Record<string, React.RefObject<HTMLDivElement>> = {
        personal: personalRef,
        professional: professionalRef,
        education: educationRef,
        skills: skillsRef,
      }

      const ref = sectionMap[activeSection]
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }, [activeSection])

  // Efecto para resetear el estado de copiado después de 2 segundos
  useEffect(() => {
    if (copiedField) {
      const timer = setTimeout(() => {
        setCopiedField(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [copiedField])

  const handleSave = () => {
    saveUserInfo(userInfo)
    setIsEditing(false)
    toast({
      title: "Información guardada",
      description: "Tu información ha sido guardada correctamente.",
    })
  }

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const copyToClipboard = (text: string, fieldName: string) => {
    if (!text) return

    // Usar el API de clipboard directamente
    try {
      navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      toast({
        title: "¡Contenido copiado!",
        description: `${fieldName} copiado al portapapeles.`,
      })
    } catch (err) {
      console.error("Error al copiar: ", err)
      toast({
        title: "Error al copiar",
        description: "No se pudo copiar al portapapeles.",
        variant: "destructive",
      })
    }
  }

  const renderField = (
    field: keyof UserInfo,
    label: string,
    placeholder: string,
    multiline = false,
    options?: { value: string; label: string }[],
  ) => {
    const value = userInfo[field] as string
    const isCopied = copiedField === label

    const clearField = () => {
      // Update the field with empty string
      handleInputChange(field, "")

      // If not in editing mode, save changes immediately
      if (!isEditing) {
        const updatedInfo = {
          ...userInfo,
          [field]: "",
        }
        saveUserInfo(updatedInfo)
        toast({
          title: "Campo borrado",
          description: `${label} ha sido borrado.`,
        })
      }
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={field} className="text-base font-medium">
          {label}
        </Label>

        {isEditing ? (
          <div className="relative">
            {options ? (
              <Select value={value} onValueChange={(newValue) => handleInputChange(field, newValue)}>
                <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : multiline ? (
              <Textarea
                id={field}
                placeholder={placeholder}
                value={value}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="min-h-[100px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <Input
                id={field}
                placeholder={placeholder}
                value={value}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
            )}
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearField}
                className="absolute bottom-1 left-1 h-6 w-6 p-0 rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <span className="sr-only">Borrar {label}</span>×
              </Button>
            )}
          </div>
        ) : (
          <div className="relative rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 min-h-[38px] flex items-center justify-between">
            <div className="flex-grow overflow-hidden">
              {value ? (
                multiline ? (
                  <div className="whitespace-pre-line break-words">{value}</div>
                ) : (
                  <div className="truncate">{value}</div>
                )
              ) : (
                <span className="text-gray-400 dark:text-gray-500">No especificado</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearField}
                  className="h-7 w-7 p-0 rounded-full flex items-center justify-center shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <span className="sr-only">Borrar {label}</span>×
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={`h-7 w-7 p-0 rounded-full flex items-center justify-center shrink-0 border-gray-200 dark:border-gray-700 ${
                  isCopied ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : ""
                }`}
                onClick={() => value && copyToClipboard(value, label)}
                disabled={!value}
              >
                {isCopied ? <ClipboardCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span className="sr-only">Copiar {label}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
          Mi Información
        </h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setUserInfo(getUserInfo())
                  setIsEditing(false)
                }}
                className="border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white"
              >
                <Check className="mr-2 h-4 w-4" />
                Guardar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                onClick={() => {
                  if (
                    window.confirm(
                      "¿Estás seguro de que deseas borrar toda tu información personal? Esta acción no se puede deshacer.",
                    )
                  ) {
                    // Crear un objeto con la misma estructura pero con valores vacíos
                    const emptyUserInfo: UserInfo = {
                      fullName: "",
                      email: "",
                      phone: "",
                      location: "",
                      postalCode: "",
                      linkedinUrl: "",
                      portfolioUrl: "",
                      professionalTitle: "",
                      yearsOfExperience: "",
                      desiredSalary: "",
                      availability: "",
                      preferredWorkType: "remoto" as WorkType,
                      degree: "",
                      institution: "",
                      graduationYear: "",
                      skills: "",
                      languages: "",
                      professionalSummary: "",
                      whyLookingForJob: "",
                    }

                    // Actualizar el estado y guardar en localStorage
                    setUserInfo(emptyUserInfo)
                    saveUserInfo(emptyUserInfo)

                    toast({
                      title: "Información borrada",
                      description: "Toda tu información personal ha sido borrada correctamente.",
                    })
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Borrar todo
              </Button>

              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </>
          )}
        </div>
      </div>

      <Card className="shadow-card border-0 dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Información para Postulaciones</CardTitle>
          <CardDescription>
            Guarda aquí la información que utilizas frecuentemente en tus postulaciones para copiarla fácilmente.
            {isEditing ? (
              <Badge
                variant="outline"
                className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
              >
                Modo edición
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
              >
                Modo visualización
              </Badge>
            )}
          </CardDescription>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
            <p>
              Esta sección te permite almacenar tu información personal y profesional para agilizar el proceso de
              postulación. Usa los botones de copiar para transferir rápidamente tus datos a formularios de empleo.
              <span className="font-medium text-primary-600 dark:text-primary-400">
                {" "}
                ¡Mucha suerte en tu búsqueda laboral! Estamos seguros de que encontrarás la oportunidad perfecta para
                ti.
              </span>
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={activeSection === "personal" ? "default" : "outline"}
              onClick={() => setActiveSection("personal")}
              className={activeSection === "personal" ? "bg-primary text-white" : ""}
            >
              Información Personal
            </Button>
            <Button
              variant={activeSection === "professional" ? "default" : "outline"}
              onClick={() => setActiveSection("professional")}
              className={activeSection === "professional" ? "bg-primary text-white" : ""}
            >
              Información Profesional
            </Button>
            <Button
              variant={activeSection === "education" ? "default" : "outline"}
              onClick={() => setActiveSection("education")}
              className={activeSection === "education" ? "bg-primary text-white" : ""}
            >
              Educación
            </Button>
            <Button
              variant={activeSection === "skills" ? "default" : "outline"}
              onClick={() => setActiveSection("skills")}
              className={activeSection === "skills" ? "bg-primary text-white" : ""}
            >
              Habilidades
            </Button>
          </div>

          <div className="space-y-12">
            {/* Sección de Información Personal */}
            <div ref={personalRef} id="personal" className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField("fullName", "Nombre completo", "Ej: Juan Pérez González")}
                {renderField("email", "Correo electrónico", "Ej: juan.perez@ejemplo.com")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField("phone", "Teléfono", "Ej: +52 55 1234 5678")}
                {renderField("location", "Ubicación", "Ej: Ciudad de México, México")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField("postalCode", "Código postal", "Ej: 06700")}
                {renderField("linkedinUrl", "URL de LinkedIn", "Ej: https://linkedin.com/in/juanperez")}
              </div>
              <div className="grid grid-cols-1 gap-6">
                {renderField("portfolioUrl", "URL de Portafolio/GitHub", "Ej: https://github.com/juanperez")}
              </div>
            </div>

            {/* Sección de Información Profesional */}
            <div ref={professionalRef} id="professional" className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Información Profesional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField("professionalTitle", "Título profesional", "Ej: Desarrollador Frontend Senior")}
                {renderField("yearsOfExperience", "Años de experiencia", "Ej: 5 años")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField("desiredSalary", "Salario pretendido", "Ej: $40,000 - $50,000 MXN mensuales")}
                {renderField("availability", "Disponibilidad", "Ej: Inmediata / 2 semanas")}
              </div>
              <div className="grid grid-cols-1 gap-6">
                {renderField("preferredWorkType", "Tipo de trabajo preferido", "Selecciona una opción", false, [
                  { value: "remoto", label: "Remoto" },
                  { value: "hibrido", label: "Híbrido" },
                  { value: "presencial", label: "Presencial" },
                ])}
              </div>
              <div className="space-y-6">
                {renderField(
                  "professionalSummary",
                  "Resumen profesional",
                  "Breve descripción de tu perfil profesional...",
                  true,
                )}
                {renderField(
                  "whyLookingForJob",
                  "¿Por qué estás buscando trabajo?",
                  "Explica brevemente por qué estás en búsqueda de nuevas oportunidades...",
                  true,
                )}
              </div>
            </div>

            {/* Sección de Educación */}
            <div ref={educationRef} id="education" className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Educación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField("degree", "Grado académico", "Ej: Licenciatura en Ingeniería de Software")}
                {renderField("institution", "Institución", "Ej: Universidad Nacional Autónoma de México")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField("graduationYear", "Año de graduación", "Ej: 2018")}
              </div>
            </div>

            {/* Sección de Habilidades */}
            <div ref={skillsRef} id="skills" className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Habilidades</h3>
              <div className="space-y-6">
                {renderField(
                  "skills",
                  "Habilidades técnicas",
                  "Enumera tus habilidades técnicas separadas por comas...",
                  true,
                )}
                {renderField("languages", "Idiomas", "Ej: Español (nativo), Inglés (avanzado), Francés (básico)", true)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
