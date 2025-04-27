import Script from "next/script"

export function JobTrackerStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Tracker de Postulaciones",
    description: "Aplicación para gestionar y organizar postulaciones laborales",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Isaías Chávez Martínez",
      url: "https://isiaschavez.com",
    },
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0.0",
    screenshot: "https://postulaciones-tracker.vercel.app/screenshot-1.png",
    featureList: "Seguimiento de postulaciones, Gestión de estados, Filtrado, Exportación de datos",
    keywords: "tracker postulaciones, seguimiento empleo, búsqueda trabajo, gestión postulaciones",
  }

  return (
    <Script id="structured-data" type="application/ld+json">
      {JSON.stringify(structuredData)}
    </Script>
  )
}
