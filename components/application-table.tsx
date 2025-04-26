"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/status-badge"
import { WorkTypeBadge } from "@/components/work-type-badge"
import type { Application } from "@/lib/types"
import { ExternalLink } from "lucide-react"

interface ApplicationTableProps {
  applications: Application[]
  onApplicationClick: (application: Application) => void
  showLocation?: boolean
  showWorkType?: boolean
}

export function ApplicationTable({
  applications,
  onApplicationClick,
  showLocation = false,
  showWorkType = false,
}: ApplicationTableProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-900">
            <TableHead className="font-medium">Empresa</TableHead>
            <TableHead className="font-medium">Puesto</TableHead>
            {showLocation && <TableHead className="font-medium">Ubicación</TableHead>}
            {showWorkType && <TableHead className="font-medium">Tipo</TableHead>}
            <TableHead className="font-medium">Fecha</TableHead>
            <TableHead className="font-medium">Estado</TableHead>
            <TableHead className="text-right font-medium">Enlace</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow
              key={application.id}
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:border-gray-700"
              onClick={() => onApplicationClick(application)}
            >
              <TableCell className="font-medium">{application.company}</TableCell>
              <TableCell>{application.position}</TableCell>
              {showLocation && <TableCell>{application.location || "-"}</TableCell>}
              {showWorkType && (
                <TableCell>{application.workType ? <WorkTypeBadge workType={application.workType} /> : "-"}</TableCell>
              )}
              <TableCell>{new Date(application.dateApplied).toLocaleDateString()}</TableCell>
              <TableCell>
                <StatusBadge status={application.status} />
              </TableCell>
              <TableCell className="text-right">
                {application.jobUrl ? (
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Ver oferta</span>
                  </a>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
