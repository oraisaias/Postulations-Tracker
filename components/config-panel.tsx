"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { StatusBadge } from "@/components/status-badge"
import { MoonIcon, SunIcon } from "lucide-react"

export function ConfigPanel() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
        Configuración
      </h2>

      <Card className="shadow-card border-0 dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Apariencia</CardTitle>
          <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                {theme === "dark" ? (
                  <MoonIcon className="h-5 w-5 text-primary-500" />
                ) : (
                  <SunIcon className="h-5 w-5 text-amber-500" />
                )}
                <Label htmlFor="theme-toggle" className="text-base font-medium">
                  Tema {theme === "dark" ? "Oscuro" : "Claro"}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">Cambia entre tema claro y oscuro</p>
            </div>
            <Switch
              id="theme-toggle"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card border-0 dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Estados de Postulación</CardTitle>
          <CardDescription>Estos son los estados disponibles para tus postulaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="space-y-0.5">
                <Label className="text-base">Enviada</Label>
                <p className="text-sm text-muted-foreground">Postulación enviada, esperando respuesta</p>
              </div>
              <StatusBadge status="enviada" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="space-y-0.5">
                <Label className="text-base">En Entrevista</Label>
                <p className="text-sm text-muted-foreground">En proceso de entrevistas</p>
              </div>
              <StatusBadge status="entrevista" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="space-y-0.5">
                <Label className="text-base">Rechazada</Label>
                <p className="text-sm text-muted-foreground">Postulación rechazada</p>
              </div>
              <StatusBadge status="rechazada" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="space-y-0.5">
                <Label className="text-base">Oferta Recibida</Label>
                <p className="text-sm text-muted-foreground">Has recibido una oferta</p>
              </div>
              <StatusBadge status="oferta" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="space-y-0.5">
                <Label className="text-base">Aceptada</Label>
                <p className="text-sm text-muted-foreground">Oferta aceptada</p>
              </div>
              <StatusBadge status="aceptada" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
