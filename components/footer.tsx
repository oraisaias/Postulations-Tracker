"use client"

import { Github, Linkedin, Twitter, Globe, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function Footer() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <footer
      className={`w-full py-6 mt-12 border-t ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Información del desarrollador */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-lg font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Isaías Chávez Martínez
            </h3>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Desarrollador Web</p>
          </div>

          {/* Redes sociales */}
          <div className="flex space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:opacity-90"
              onClick={() => window.open("https://linkedin.com", "_blank")}
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-gray-800 text-white hover:opacity-90"
              onClick={() => window.open("https://github.com", "_blank")}
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:opacity-90"
              onClick={() => window.open("https://twitter.com", "_blank")}
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:opacity-90"
              onClick={() => window.open("https://isaiaschavez.com", "_blank")}
            >
              <Globe className="h-4 w-4" />
              <span className="sr-only">Sitio web</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:opacity-90"
              onClick={() => window.open("mailto:contacto@isaiaschavez.com", "_blank")}
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            © {new Date().getFullYear()} Isaías Chávez Martínez. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
