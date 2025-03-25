"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Clock, CheckCircle, Users, TrendingUp } from "lucide-react"
import { statsData } from "@/lib/data"

export function StatsBar() {
  // Use the stats from our data file
  const stats = statsData

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-3 sm:p-4">
          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-red-100 text-red-500">
            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <div className="mt-1 sm:mt-2 text-center">
            <div className="text-lg sm:text-2xl font-bold">{stats.reported}</div>
            <p className="text-xs text-muted-foreground">Reported</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-3 sm:p-4">
          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <div className="mt-1 sm:mt-2 text-center">
            <div className="text-lg sm:text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-3 sm:p-4">
          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-green-100 text-green-500">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <div className="mt-1 sm:mt-2 text-center">
            <div className="text-lg sm:text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-3 sm:p-4">
          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-blue-100 text-blue-500">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <div className="mt-1 sm:mt-2 text-center">
            <div className="text-lg sm:text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Active Users</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-3 sm:p-4">
          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-purple-100 text-purple-500">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <div className="mt-1 sm:mt-2 text-center">
            <div className="text-lg sm:text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">Completion Rate</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

