"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  MapPin,
  ThumbsUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Edit,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { FilterBar } from "./filter-bar"
import { toast } from "sonner"
import type { Issue } from "@/lib/types"
import { useAppStore } from "@/lib/store"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ViewCommentsDialog } from "./view-comments-dialog"

// Update the component definition to accept props
interface IssuesProps {
  showMyReportsOnly?: boolean
  setShowMyReportsOnly?: (value: boolean) => void
}

export function Issues({ showMyReportsOnly = false, setShowMyReportsOnly = () => {} }: IssuesProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null)
  const [editingIssue, setEditingIssue] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [commentText, setCommentText] = useState<Record<number, string>>({})
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [viewingCommentsForIssue, setViewingCommentsForIssue] = useState<Issue | null>(null)

  const issues = useAppStore((state) => state.issues)
  const comments = useAppStore((state) => state.comments)
  const userVotes = useAppStore((state) => state.userVotes)
  const user = useAppStore((state) => state.user)
  const isLoggedIn = useAppStore((state) => state.isLoggedIn)
  const toggleVote = useAppStore((state) => state.toggleVote)
  const addComment = useAppStore((state) => state.addComment)
  const progressIssue = useAppStore((state) => state.progressIssue)
  const editIssue = useAppStore((state) => state.editIssue)
  const deleteIssue = useAppStore((state) => state.deleteIssue)
  const restoreIssue = useAppStore((state) => state.restoreIssue)

  const [filteredIssues, setFilteredIssues] = useState<Issue[]>(issues)
  const [filters, setFilters] = useState({
    search: "",
    categories: {
      pothole: true,
      streetlight: true,
      graffiti: true,
      trash: true,
      sidewalk: true,
      other: true,
    },
  })

  // Update the useEffect to use the prop
  useEffect(() => {
    let result = issues

    // Filter by search query
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchLower) ||
          issue.description.toLowerCase().includes(searchLower) ||
          issue.location.toLowerCase().includes(searchLower),
      )
    }

    // Filter by categories
    result = result.filter((issue) => filters.categories[issue.category])

    // Filter by status (tab)
    if (activeTab !== "all") {
      result = result.filter((issue) => issue.status === activeTab)
    }

    // Filter by my reports only
    if (showMyReportsOnly && user) {
      result = result.filter((issue) => issue.reportedBy === user.name || issue.reportedBy === "You")
    }

    setFilteredIssues(result)
  }, [issues, filters, activeTab, showMyReportsOnly, user])

  const handleFilterChange = useCallback(
    (newFilters: {
      search: string
      categories: Record<string, boolean>
    }) => {
      setFilters(newFilters)
    },
    [],
  )

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

  const getCategoryBadge = (category: string) => {
    const displayName = category.charAt(0).toUpperCase() + category.slice(1)
    return <Badge variant="outline">{displayName}</Badge>
  }

  const handleVote = (issueId: number) => {
    if (!isLoggedIn) {
      toast.error("Please log in to vote on issues")
      return
    }

    toggleVote(issueId)

    const isVoted = userVotes[issueId]
    if (isVoted) {
      toast.info("Vote removed")
    } else {
      toast.success("Vote added")
    }
  }

  const handleAddComment = (issueId: number) => {
    if (!commentText[issueId]?.trim()) return
    if (!isLoggedIn) {
      toast.error("Please log in to add comments")
      return
    }

    // Create a new comment
    const newComment = {
      issueId,
      author: user?.name || "Anonymous",
      avatarUrl: user?.avatar || "/placeholder.svg?height=32&width=32",
      content: commentText[issueId],
      timestamp: new Date().toISOString(),
    }

    // Add the comment to the store
    addComment(newComment)

    // Show success toast
    toast.success("Comment added successfully")

    // Clear the comment text
    setCommentText((prev) => ({
      ...prev,
      [issueId]: "",
    }))
  }

  const handleProgressIssue = (issueId: number) => {
    const issue = issues.find((i) => i.id === issueId)
    if (!issue) return

    let nextStatus
    if (issue.status === "reported") {
      nextStatus = "in_progress"
    } else if (issue.status === "in_progress") {
      nextStatus = "completed"
    } else {
      return
    }

    progressIssue(issueId)
    toast.success(`Issue moved to ${getStatusLabel(nextStatus)}`)
  }

  const handleDeleteIssue = (issueId: number) => {
    const issueToDelete = issues.find((i) => i.id === issueId)
    if (!issueToDelete) return

    deleteIssue(issueId)

    toast("Issue deleted", {
      description: "The issue has been removed",
      action: {
        label: "Undo",
        onClick: () => {
          restoreIssue(issueToDelete)
          toast.success("Issue restored")
        },
      },
    })

    setSelectedIssue(null)
  }

  const startEditIssue = (issue: Issue) => {
    setEditingIssue(issue.id)
    setEditTitle(issue.title)
    setEditDescription(issue.description)
    setEditCategory(issue.category)
  }

  const saveEditIssue = () => {
    if (!editingIssue) return

    editIssue(editingIssue, {
      title: editTitle,
      description: editDescription,
      category: editCategory as any,
    })

    toast.success("Issue updated successfully")
    setEditingIssue(null)
  }

  const cancelEditIssue = () => {
    setEditingIssue(null)
  }

  const nextImage = (images: string[]) => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (images: string[]) => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const selectedIssueData = selectedIssue !== null ? issues.find((issue) => issue.id === selectedIssue) : null
  const isUserIssue = (issue: Issue) => {
    if (!user) return false
    return issue.reportedBy === user.name || issue.reportedBy === "You"
  }

  const issueComments = (issueId: number) => {
    return comments.filter((c) => c.issueId === issueId)
  }

  const handleViewComments = (issue: Issue) => {
    setViewingCommentsForIssue(issue)
  }

  // Update the JSX to use the prop
  return (
    <>
      <FilterBar onFilterChange={handleFilterChange} />

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm mt-6">
        <div className="p-6 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Reported Issues</h3>
          <div className="flex items-center gap-2">
            <Button
              variant={showMyReportsOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMyReportsOnly(!showMyReportsOnly)}
              disabled={!isLoggedIn}
            >
              {showMyReportsOnly ? "Showing My Reports" : "Show My Reports"}
            </Button>
          </div>
        </div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="reported">Reported</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="border-0 p-0 pt-6">
            <div className="space-y-4 px-6 pb-6">
              {filteredIssues.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                  <p className="text-muted-foreground">No issues found</p>
                </div>
              ) : (
                filteredIssues.map((issue) => (
                  <Card key={issue.id} className="overflow-hidden">
                    <CardHeader className="p-3 sm:p-4">
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

                    <CardContent className="grid grid-cols-1 gap-4 p-3 sm:p-4 pt-0">
                      <div>
                        <p className="line-clamp-2 text-sm">{issue.description}</p>

                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{issue.progress}%</span>
                          </div>
                          <Progress value={issue.progress} className="h-2" />
                        </div>
                      </div>

                      {issue.images.length > 0 && (
                        <div>
                          <div className="aspect-video relative overflow-hidden rounded-md">
                            <img
                              src={issue.images[0] || "/placeholder.svg"}
                              alt={issue.title}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      )}

                      {/* Action buttons for user's own issues */}
                      {isUserIssue(issue) && (
                        <div className="flex justify-between items-center border-t pt-3">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => startEditIssue(issue)} className="gap-1">
                              <Edit className="h-3.5 w-3.5" /> Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-600 gap-1"
                              onClick={() => handleDeleteIssue(issue.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </Button>
                          </div>

                          {issue.status !== "completed" && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleProgressIssue(issue.id)}
                              className="gap-1"
                            >
                              <ArrowRight className="h-3.5 w-3.5" />
                              {issue.status === "reported" ? "Start Progress" : "Complete"}
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Comment section directly on the card */}
                      <div className="space-y-3 pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium">Comments ({issue.comments})</h4>
                          {issue.comments > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 px-2"
                              onClick={() => handleViewComments(issue)}
                            >
                              View All
                            </Button>
                          )}
                        </div>

                        {issueComments(issue.id).length > 0 && (
                          <div className="space-y-2">
                            <div className="bg-muted/50 rounded-lg p-2">
                              <div className="flex items-start gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={issueComments(issue.id)[issueComments(issue.id).length - 1].avatarUrl}
                                    alt={issueComments(issue.id)[issueComments(issue.id).length - 1].author}
                                  />
                                  <AvatarFallback>
                                    {issueComments(issue.id)[issueComments(issue.id).length - 1].author.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium">
                                      {issueComments(issue.id)[issueComments(issue.id).length - 1].author}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                      {new Date(
                                        issueComments(issue.id)[issueComments(issue.id).length - 1].timestamp,
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                  <p className="text-xs line-clamp-2">
                                    {issueComments(issue.id)[issueComments(issue.id).length - 1].content}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {issueComments(issue.id).length > 1 && (
                              <p className="text-xs text-muted-foreground">
                                + {issueComments(issue.id).length - 1} more comment
                                {issueComments(issue.id).length > 2 ? "s" : ""}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Comment input */}
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Add a comment..."
                            className="min-h-[60px] text-sm resize-none flex-1"
                            value={commentText[issue.id] || ""}
                            onChange={(e) =>
                              setCommentText((prev) => ({
                                ...prev,
                                [issue.id]: e.target.value,
                              }))
                            }
                            disabled={!isLoggedIn}
                          />
                          <Button
                            size="sm"
                            className="self-end"
                            onClick={() => handleAddComment(issue.id)}
                            disabled={!commentText[issue.id]?.trim() || !isLoggedIn}
                          >
                            Post
                          </Button>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t p-3 sm:p-4 text-sm gap-3 sm:gap-0">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg?height=24&width=24" alt={issue.reportedBy} />
                          <AvatarFallback>{issue.reportedBy.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground text-xs sm:text-sm">
                          Reported by {issue.reportedBy} • {new Date(issue.reportedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-4">
                        <Button
                          variant={userVotes[issue.id] ? "default" : "ghost"}
                          size="sm"
                          className="h-8 gap-1"
                          onClick={() => handleVote(issue.id)}
                          disabled={!isLoggedIn}
                        >
                          <ThumbsUp className="h-4 w-4" /> {issue.votes}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Issue Dialog */}
      <Dialog open={editingIssue !== null} onOpenChange={(open) => !open && cancelEditIssue()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Issue</DialogTitle>
            <DialogDescription>Make changes to your reported issue.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pothole">Pothole</SelectItem>
                  <SelectItem value="streetlight">Streetlight</SelectItem>
                  <SelectItem value="graffiti">Graffiti</SelectItem>
                  <SelectItem value="trash">Trash/Litter</SelectItem>
                  <SelectItem value="sidewalk">Damaged Sidewalk</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={cancelEditIssue}>
              Cancel
            </Button>
            <Button onClick={saveEditIssue}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Viewer Dialog */}
      <Dialog open={selectedIssue !== null} onOpenChange={(open) => !open && setSelectedIssue(null)}>
        {selectedIssueData && (
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedIssueData.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {selectedIssueData.location}
              </DialogDescription>
            </DialogHeader>

            {selectedIssueData.images.length > 0 && (
              <div className="relative">
                <div className="aspect-video overflow-hidden rounded-md border">
                  <img
                    src={selectedIssueData.images[currentImageIndex] || "/placeholder.svg"}
                    alt={`Image ${currentImageIndex + 1} for ${selectedIssueData.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {selectedIssueData.images.length > 1 && (
                  <div className="absolute inset-x-0 top-1/2 flex justify-between -translate-y-1/2 px-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full opacity-80"
                      onClick={() => prevImage(selectedIssueData.images)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full opacity-80"
                      onClick={() => nextImage(selectedIssueData.images)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {selectedIssueData.images.length > 1 && (
                  <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                    {selectedIssueData.images.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 w-1.5 rounded-full ${
                          index === currentImageIndex ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm">{selectedIssueData.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Status</h4>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(selectedIssueData.status)}`}></div>
                  <span className="text-sm">{getStatusLabel(selectedIssueData.status)}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Progress</h4>
                <Progress value={selectedIssueData.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{selectedIssueData.progress}% complete</p>
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedIssue(null)}>
                Close
              </Button>
              {isUserIssue(selectedIssueData) && selectedIssueData.status !== "completed" && (
                <Button onClick={() => handleProgressIssue(selectedIssueData.id)}>Progress Issue</Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      <ViewCommentsDialog
        issue={viewingCommentsForIssue}
        open={viewingCommentsForIssue !== null}
        onOpenChange={(open) => {
          if (!open) setViewingCommentsForIssue(null)
        }}
      />
    </>
  )
}

