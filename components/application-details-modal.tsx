"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarIcon, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/status-badge"
import { WorkTypeBadge } from "@/components/work-type-badge"
import type { Application } from "@/lib/types"
import { updateApplication, deleteApplication } from "@/lib/storage"
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

const formSchema = z.object({
  company: z.string().min(1, "La empresa es requerida"),
  position: z.string().min(1, "El puesto es requerido"),
  dateApplied: z.date({
    required_error: "La fecha de aplicación es requerida",
  }),
  status: z.enum(["enviada", "entrevista", "rechazada", "oferta", "aceptada"], {
    required_error: "El estado es requerido",
  }),
  location: z.string().optional(),
  workType: z.enum(["remoto", "hibrido", "presencial"], {
    required_error: "El tipo de trabajo es requerido",
  }),
  jobUrl: z.string().url("Ingresa una URL válida").optional().or(z.literal("")),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ApplicationDetailsModalProps {
  application: Application
  open: boolean
  onClose: () => void
  onUpdate: () => void
}

export function ApplicationDetailsModal({ application, open, onClose, onUpdate }: ApplicationDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: application.company,
      position: application.position,
      dateApplied: new Date(application.dateApplied),
      status: application.status,
      location: application.location || "",
      workType: application.workType || "presencial",
      jobUrl: application.jobUrl || "",
      notes: application.notes || "",
    },
  })

  const handleSubmit = (values: FormValues) => {
    setIsSubmitting(true)

    try {
      const updatedApplication: Application = {
        ...application,
        ...values,
        dateApplied: values.dateApplied.toISOString(),
        location: values.location || undefined,
        jobUrl: values.jobUrl || undefined,
        notes: values.notes || undefined,
        updatedAt: new Date().toISOString(),
      }

      updateApplication(updatedApplication)
      setIsEditing(false)
      onUpdate()
    } catch (error) {
      console.error("Error al actualizar la postulación:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = () => {
    deleteApplication(application.id)
    onClose()
    onUpdate()
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {isEditing ? "Editar Postulación" : application.company}
            {!isEditing && <StatusBadge status={application.status} />}
          </DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 px-6 pb-6">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre de la empresa"
                        {...field}
                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Puesto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Título del puesto"
                        {...field}
                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                        {...field}
                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dateApplied"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Aplicación</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Selecciona una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                            <SelectValue placeholder="Selecciona un estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="enviada">Enviada</SelectItem>
                          <SelectItem value="entrevista">En Entrevista</SelectItem>
                          <SelectItem value="rechazada">Rechazada</SelectItem>
                          <SelectItem value="oferta">Oferta Recibida</SelectItem>
                          <SelectItem value="aceptada">Aceptada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Ciudad de México"
                          {...field}
                          className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Trabajo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                            <SelectValue placeholder="Selecciona un tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="remoto">Remoto</SelectItem>
                          <SelectItem value="hibrido">Híbrido</SelectItem>
                          <SelectItem value="presencial">Presencial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="jobUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de la Oferta (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        {...field}
                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Agrega notas sobre la postulación, entrevistas, etc."
                        className="min-h-[100px] bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white"
                >
                  {isSubmitting ? "Guardando..." : "Actualizar"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <>
            <div className="grid gap-4 py-4 px-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Empresa</h3>
                  <p className="mt-1 font-medium">{application.company}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Puesto</h3>
                  <p className="mt-1">{application.position}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Fecha de Aplicación</h3>
                  <p className="mt-1">{new Date(application.dateApplied).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Estado</h3>
                  <p className="mt-1">
                    <StatusBadge status={application.status} />
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Ubicación</h3>
                  <p className="mt-1">{application.location || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tipo de Trabajo</h3>
                  <p className="mt-1">
                    {application.workType ? <WorkTypeBadge workType={application.workType} /> : "-"}
                  </p>
                </div>
              </div>

              {application.jobUrl && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">URL de la Oferta</h3>
                  <p className="mt-1">
                    <a
                      href={application.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Ver oferta
                    </a>
                  </p>
                </div>
              )}

              {application.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Notas</h3>
                  <p className="mt-1 whitespace-pre-line">{application.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará permanentemente esta postulación.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
