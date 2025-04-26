"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Application, ApplicationStatus } from "@/lib/types"

const formSchema = z.object({
  company: z.string().min(1, "La empresa es requerida"),
  position: z.string().min(1, "El puesto es requerido"),
  dateApplied: z.date({
    required_error: "La fecha de aplicación es requerida",
  }),
  status: z.enum(["enviada", "entrevista", "rechazada", "oferta", "aceptada"], {
    required_error: "El estado es requerido",
  }),
  salary: z.string().optional(),
  jobUrl: z.string().url("Ingresa una URL válida").optional().or(z.literal("")),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ApplicationFormProps {
  onSubmit: (data: Omit<Application, "id" | "createdAt" | "updatedAt">) => void
  isSubmitting: boolean
  defaultValues?: Application
}

export function ApplicationForm({ onSubmit, isSubmitting, defaultValues }: ApplicationFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          dateApplied: new Date(defaultValues.dateApplied),
          jobUrl: defaultValues.jobUrl || "",
          salary: defaultValues.salary || "",
          notes: defaultValues.notes || "",
        }
      : {
          company: "",
          position: "",
          dateApplied: new Date(),
          status: "enviada" as ApplicationStatus,
          salary: "",
          jobUrl: "",
          notes: "",
        },
  })

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      company: values.company,
      position: values.position,
      dateApplied: values.dateApplied.toISOString(),
      status: values.status,
      salary: values.salary || undefined,
      jobUrl: values.jobUrl || undefined,
      notes: values.notes || undefined,
    })
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="grid gap-6 pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de la empresa" {...field} />
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
                      <Input placeholder="Título del puesto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
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
                        <SelectTrigger>
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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salario (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: $50,000 MXN mensual" {...field} />
                    </FormControl>
                    <FormDescription>Ingresa el salario ofrecido o esperado</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de la Oferta (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Agrega notas sobre la postulación, entrevistas, etc."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={defaultValues ? `/applications/${defaultValues.id}` : "/applications"}>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : defaultValues ? "Actualizar" : "Guardar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
