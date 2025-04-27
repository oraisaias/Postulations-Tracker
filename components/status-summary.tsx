"use client"

import type React from "react"

import { BriefcaseIcon, CheckCircle, Clock, XCircle, BadgeCheck } from "lucide-react"
import type { Application } from "@/lib/types"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

interface StatusSummaryProps {
  applications: Application[]
}

export function StatusSummary({ applications }: StatusSummaryProps) {
  const { theme } = useTheme()

  // Contar aplicaciones por estado
  const counts = {
    total: applications.length,
    enviada: applications.filter((app) => app.status === "enviada").length,
    entrevista: applications.filter((app) => app.status === "entrevista").length,
    rechazada: applications.filter((app) => app.status === "rechazada").length,
    oferta: applications.filter((app) => app.status === "oferta").length,
    aceptada: applications.filter((app) => app.status === "aceptada").length,
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-5"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <StatusCard
          title="Total"
          count={counts.total}
          description="Postulaciones totales"
          icon={<BriefcaseIcon className="h-5 w-5 text-primary-500" />}
          gradient="from-primary-500 to-primary-600"
        />
      </motion.div>
      <motion.div variants={item}>
        <StatusCard
          title="Enviadas"
          count={counts.enviada}
          description="Esperando respuesta"
          icon={<Clock className="h-5 w-5 text-blue-500" />}
          gradient="from-blue-500 to-blue-600"
        />
      </motion.div>
      <motion.div variants={item}>
        <StatusCard
          title="En Entrevista"
          count={counts.entrevista}
          description="En proceso"
          icon={<BadgeCheck className="h-5 w-5 text-violet-500" />}
          gradient="from-violet-500 to-violet-600"
        />
      </motion.div>
      <motion.div variants={item}>
        <StatusCard
          title="Rechazadas"
          count={counts.rechazada}
          description="No seleccionadas"
          icon={<XCircle className="h-5 w-5 text-red-500" />}
          gradient="from-red-500 to-red-600"
        />
      </motion.div>
      <motion.div variants={item}>
        <StatusCard
          title="Ofertas"
          count={counts.oferta + counts.aceptada}
          description="Ofertas recibidas"
          icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
          gradient="from-emerald-500 to-emerald-600"
        />
      </motion.div>
    </motion.div>
  )
}

interface StatusCardProps {
  title: string
  count: number
  description: string
  icon: React.ReactNode
  gradient: string
}

function StatusCard({ title, count, description, icon, gradient }: StatusCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-0 p-6 backdrop-blur-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className={`text-3xl font-bold mt-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {count}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">{icon}</div>
      </div>
    </div>
  )
}
