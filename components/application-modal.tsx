"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Application, ApplicationStatus, WorkType } from "@/lib/types"
import { addApplication } from "@/lib/storage"

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
})

type FormValues = z.infer<typeof formSchema>

interface ApplicationModalProps {
  open: boolean
  onClose: () => void
  onSave: () => void
}

export function ApplicationModal({ open, onClose, onSave }: ApplicationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      position: "",
      dateApplied: new Date(),
      status: "enviada" as ApplicationStatus,
      location: "",
      workType: "presencial" as WorkType,
      jobUrl: "",
    },
  })

  const handleSubmit = (values: FormValues) => {
    setIsSubmitting(true)

    try {
      const newApplication: Application = {
        ...values,
        id: uuidv4(),
        dateApplied: values.dateApplied.toISOString(),
        location: values.location || undefined,
        jobUrl: values.jobUrl || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      addApplication(newApplication)
      form.reset()
      onSave()
    } catch (error) {
      console.error("Error al guardar la postulación:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold">Nueva Postulación</DialogTitle>
        </DialogHeader>

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
                              "w-full pl-3 text-left font-normal bg-gray-50 dark:bg-gray-800",
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

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                className="border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white"
              >
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
