import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

// Metadatos para SEO
export const metadata: Metadata = {
  title: "Tracker de Postulaciones | Organiza y Gestiona tus Solicitudes de Empleo",
  description:
    "Gestiona todas tus postulaciones laborales en un solo lugar. Organiza, filtra y haz seguimiento del estado de tus solicitudes de empleo de forma eficiente.",
  keywords: [
    "tracker postulaciones",
    "seguimiento empleo",
    "búsqueda trabajo",
    "gestión postulaciones",
    "aplicaciones trabajo",
    "organizar solicitudes empleo",
    "seguimiento entrevistas",
  ],
  authors: [{ name: "Isaías Chávez Martínez", url: "https://isiaschavez.com" }],
  creator: "Isaías Chávez Martínez",
  publisher: "Isaías Chávez Martínez",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://postulaciones-tracker.vercel.app"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://postulaciones-tracker.vercel.app",
    title: "Tracker de Postulaciones | Organiza tus Solicitudes de Empleo",
    description:
      "Gestiona todas tus postulaciones laborales en un solo lugar. Organiza, filtra y haz seguimiento del estado de tus solicitudes de empleo de forma eficiente.",
    siteName: "Tracker de Postulaciones",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tracker de Postulaciones - Organiza tus solicitudes de empleo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tracker de Postulaciones | Organiza tus Solicitudes de Empleo",
    description:
      "Gestiona todas tus postulaciones laborales en un solo lugar. Organiza, filtra y haz seguimiento del estado de tus solicitudes de empleo.",
    images: ["/twitter-image.png"],
    creator: "@isiaschavez",
  },
  category: "Herramientas de Productividad",
    generator: 'v0.dev'
}

// Configuración de viewport
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Favicon y otros iconos */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconectar a dominios importantes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
