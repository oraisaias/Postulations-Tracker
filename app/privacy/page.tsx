"use client"

import Link from "next/link"
import { ArrowLeft, Lock, Database, Shield, Code, Server, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
          Privacidad y Almacenamiento Local
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <Card className="shadow-lg border-0 dark:bg-gray-900">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full">
                <Lock className="h-6 w-6 text-primary-500 dark:text-primary-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Tus datos son 100% privados</CardTitle>
                <CardDescription>Esta aplicación no envía tus datos a ningún servidor externo</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <p>
                <strong>Tracker de Postulaciones</strong> es una aplicación que funciona completamente en el navegador.
                Todos los datos que ingresas (postulaciones, información personal, preferencias) se almacenan
                exclusivamente en tu dispositivo utilizando <strong>localStorage</strong>, una tecnología de
                almacenamiento web que mantiene la información en tu navegador.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center text-center">
                  <Database className="h-8 w-8 text-primary-500 mb-2" />
                  <h3 className="font-medium">Almacenamiento Local</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tus datos nunca salen de tu dispositivo</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center text-center">
                  <Server className="h-8 w-8 text-primary-500 mb-2" />
                  <h3 className="font-medium">Sin Servidores</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">No hay bases de datos remotas ni APIs</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center text-center">
                  <Shield className="h-8 w-8 text-primary-500 mb-2" />
                  <h3 className="font-medium">Control Total</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tú decides cuándo borrar tus datos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="code" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="code">Código Fuente</TabsTrigger>
            <TabsTrigger value="verify">Cómo Verificarlo</TabsTrigger>
            <TabsTrigger value="technical">Detalles Técnicos</TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="space-y-6">
            <Card className="shadow-md border-0 dark:bg-gray-900">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Code className="h-5 w-5 text-primary-500" />
                  <CardTitle className="text-lg">Código de Almacenamiento</CardTitle>
                </div>
                <CardDescription>Así es como guardamos tus datos en localStorage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                  <pre>{`// lib/storage.ts

// Constantes para las claves de localStorage
const STORAGE_KEY = "job-applications"
const USER_INFO_KEY = "user-info"

// Obtener todas las postulaciones
export function getApplications(): Application[] {
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error al obtener las postulaciones:", error)
    return []
  }
}

// Guardar una postulación
export function addApplication(application: Application): void {
  try {
    const applications = getApplications()
    applications.push(application)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
    window.dispatchEvent(new Event("storage"))
  } catch (error) {
    console.error("Error al agregar la postulación:", error)
    throw error
  }
}

// Obtener la información del usuario
export function getUserInfo(): UserInfo {
  if (typeof window === "undefined") return getDefaultUserInfo()

  try {
    const data = localStorage.getItem(USER_INFO_KEY)
    if (!data) {
      const defaultInfo = getDefaultUserInfo()
      saveUserInfo(defaultInfo)
      return defaultInfo
    }
    return JSON.parse(data)
  } catch (error) {
    console.error("Error al obtener la información del usuario:", error)
    return getDefaultUserInfo()
  }
}

// Guardar la información del usuario
export function saveUserInfo(userInfo: UserInfo): void {
  try {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
    window.dispatchEvent(new Event("user-info-updated"))
  } catch (error) {
    console.error("Error al guardar la información del usuario:", error)
    throw error
  }
}`}</pre>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 dark:bg-gray-900">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Code className="h-5 w-5 text-primary-500" />
                  <CardTitle className="text-lg">Sin Llamadas a Servidores</CardTitle>
                </div>
                <CardDescription>No hay código que envíe tus datos a ningún servidor</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Como puedes ver en el código anterior, todas las operaciones de lectura y escritura se realizan
                  exclusivamente con{" "}
                  <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">localStorage</code>. No hay
                  llamadas a APIs, no hay envío de datos a servidores externos, y no hay código que transmita tu
                  información fuera de tu navegador.
                </p>
                <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 p-4 rounded-md">
                  <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">
                    ¿Qué NO encontrarás en nuestro código?
                  </h4>
                  <ul className="list-disc list-inside text-amber-700 dark:text-amber-400 space-y-1">
                    <li>
                      Llamadas a <code>fetch</code> o <code>axios</code> para enviar datos
                    </li>
                    <li>Configuración de Firebase, Supabase u otros servicios de base de datos</li>
                    <li>Funciones de sincronización con servidores</li>
                    <li>Código de autenticación con servicios externos</li>
                    <li>Analíticas o rastreadores que envíen datos de uso</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verify" className="space-y-6">
            <Card className="shadow-md border-0 dark:bg-gray-900">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-primary-500" />
                  <CardTitle className="text-lg">Cómo verificar que tus datos son locales</CardTitle>
                </div>
                <CardDescription>Pasos para comprobar que tus datos permanecen en tu dispositivo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">1. Inspeccionar el localStorage</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Puedes ver directamente los datos almacenados en tu navegador:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li>Abre las herramientas de desarrollador (F12 o clic derecho → Inspeccionar)</li>
                      <li>Ve a la pestaña "Application" (Chrome) o "Storage" (Firefox)</li>
                      <li>Expande "Local Storage" y selecciona la URL de esta aplicación</li>
                      <li>Verás las entradas "job-applications" y "user-info" con tus datos</li>
                    </ol>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mt-2">
                      <img
                        src="/devtools-localstorage-data.png"
                        alt="Captura de pantalla de localStorage"
                        className="rounded-md w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">2. Verificar la red</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Confirma que no se envían datos a servidores externos:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li>En las herramientas de desarrollador, ve a la pestaña "Network" (Red)</li>
                      <li>Agrega o edita una postulación</li>
                      <li>Observa que no hay solicitudes HTTP que envíen tus datos</li>
                    </ol>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">3. Prueba de persistencia local</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Demuestra que los datos están solo en tu navegador:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li>Agrega algunas postulaciones de prueba</li>
                      <li>Desconecta tu internet (modo avión o desconecta el WiFi)</li>
                      <li>Recarga la página - tus datos seguirán ahí</li>
                      <li>Abre la aplicación en un navegador diferente - no verás los mismos datos</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <Card className="shadow-md border-0 dark:bg-gray-900">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-primary-500" />
                  <CardTitle className="text-lg">Detalles técnicos sobre localStorage</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    <strong>localStorage</strong> es una API web que permite a las aplicaciones almacenar datos en el
                    navegador del usuario de forma persistente. A diferencia de las cookies, los datos en localStorage
                    no se envían automáticamente al servidor con cada solicitud HTTP.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Características principales</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-gray-600 dark:text-gray-400">
                        <li>Almacenamiento persistente (no se borra al cerrar la pestaña)</li>
                        <li>Capacidad de aproximadamente 5-10 MB según el navegador</li>
                        <li>Almacena solo cadenas de texto (usamos JSON para objetos)</li>
                        <li>Acceso limitado al dominio que lo creó</li>
                        <li>No caduca automáticamente</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Limitaciones de seguridad</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-gray-600 dark:text-gray-400">
                        <li>Solo accesible desde el mismo dominio</li>
                        <li>No se puede acceder desde otros sitios web</li>
                        <li>No se puede acceder desde servidores</li>
                        <li>No se sincroniza entre dispositivos</li>
                        <li>Se puede borrar si el usuario limpia los datos del navegador</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-4">
                    <h4 className="font-medium mb-2">Cómo usamos localStorage en esta aplicación</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Utilizamos localStorage para almacenar dos tipos principales de datos:
                    </p>
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                      <li>
                        <strong>job-applications</strong>: Un array JSON con todas tus postulaciones
                      </li>
                      <li>
                        <strong>user-info</strong>: Un objeto JSON con tu información personal y profesional
                      </li>
                    </ul>
                    <p className="text-sm mt-3 text-gray-600 dark:text-gray-400">
                      Estos datos se cargan cuando abres la aplicación y se actualizan cada vez que realizas cambios.
                      Todo el procesamiento ocurre en tu navegador, y los datos nunca salen de tu dispositivo.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="shadow-lg border-0 dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Preguntas frecuentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">¿Qué pasa si borro los datos de mi navegador?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Si borras los datos de navegación, incluyendo el almacenamiento local, perderás toda la información
                  guardada en la aplicación. Te recomendamos exportar tus datos periódicamente usando la función de
                  exportación en la sección de postulaciones.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">¿Puedo acceder a mis datos desde otro dispositivo?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No automáticamente. Como los datos se almacenan localmente en tu navegador, no se sincronizan entre
                  dispositivos. Sin embargo, puedes exportar tus datos en un dispositivo e importarlos en otro.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">¿Es seguro guardar información sensible?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Los datos almacenados en localStorage son tan seguros como tu dispositivo. Si otras personas tienen
                  acceso a tu dispositivo, podrían potencialmente ver esta información. Te recomendamos no guardar
                  información altamente sensible como contraseñas o datos financieros.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">¿Hay algún límite a la cantidad de datos que puedo guardar?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Sí, localStorage tiene un límite de aproximadamente 5-10 MB dependiendo del navegador. Esto es
                  suficiente para cientos de postulaciones, pero si notas problemas de rendimiento con muchos datos,
                  considera exportar y archivar postulaciones antiguas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white">
              Volver a la aplicación
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
