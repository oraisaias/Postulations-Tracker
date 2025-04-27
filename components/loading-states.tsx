"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ApplicationTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-14 w-[250px]" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-xl" />
          ))}
      </div>
      <Skeleton className="h-[450px] rounded-xl" />
    </div>
  )
}

export function UserInfoSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <Skeleton className="h-14 w-[250px]" />
        <Skeleton className="h-10 w-[120px] rounded-lg" />
      </div>
      <Skeleton className="h-[600px] rounded-xl" />
    </div>
  )
}
