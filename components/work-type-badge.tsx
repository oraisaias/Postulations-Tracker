import { Badge } from "@/components/ui/badge"
import type { WorkType } from "@/lib/types"

interface WorkTypeBadgeProps {
  workType: WorkType
}

export function WorkTypeBadge({ workType }: WorkTypeBadgeProps) {
  switch (workType) {
    case "remoto":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800"
        >
          Remoto
        </Badge>
      )
    case "hibrido":
      return (
        <Badge
          variant="outline"
          className="bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900 dark:text-violet-300 dark:border-violet-800"
        >
          Híbrido
        </Badge>
      )
    case "presencial":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800"
        >
          Presencial
        </Badge>
      )
    default:
      return <Badge variant="outline">{workType}</Badge>
  }
}
