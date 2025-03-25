"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MapPin, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { useAppStore } from "@/lib/store"

interface MyReportsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MyReportsDialog({ open, onOpenChange }: MyReportsDialogProps) {
  const [activeTab, setActiveTab] = useState("all")
  const issues = useAppStore((state) => state.issues)
  const user = useAppStore((state) => state.user)

  // Filter issues to only show those reported by the current user
  const myIssues = issues.filter((issue) => (user && issue.reportedBy === user.name) || issue.reportedBy === "You")

  // Further filter based on active tab
  const filteredIssues = activeTab === "all" ? myIssues : myIssues.filter((issue) => issue.status === activeTab)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
        return "bg-red-500"
      case "in_progress":
        return "bg-yellow-500"
      case "completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reported":
        return <AlertCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "reported":
        return "Reported"
      case "in_progress":
        return "In Progress"
      case "completed":
        return "Completed"
      default:
        return "Unknown"
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "pothole":
        return <Badge variant="outline">Pothole</Badge>
      case "streetlight":
        return <Badge variant="outline">Streetlight</Badge>
      case "graffiti":
        return <Badge variant="outline">Graffiti</Badge>
      case "trash":
        return <Badge variant="outline">Trash/Litter</Badge>
      case "sidewalk":
        return <Badge variant="outline">Damaged Sidewalk</Badge>
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>My Reports</DialogTitle>
          <DialogDescription>View and manage all the issues you've reported.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="py-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="reported">Reported</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4 space-y-4">
            {filteredIssues.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                <p className="text-muted-foreground">No reports found</p>
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <Card key={issue.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
                      <div>
                        <CardTitle className="text-base sm:text-lg">{issue.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" /> {issue.location}
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {getCategoryBadge(issue.category)}
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {getStatusIcon(issue.status)}
                          {getStatusLabel(issue.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm mb-4">{issue.description}</p>

                    <div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{issue.progress}%</span>
                      </div>
                      <Progress value={issue.progress} className="h-2" />
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="text-sm text-muted-foreground">
                      Reported on {new Date(issue.reportedAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{issue.votes} votes</Badge>
                      <Badge variant="outline">{issue.comments} comments</Badge>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

