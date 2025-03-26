"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizontal } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import type { Issue } from "@/lib/types"

interface ViewCommentsDialogProps {
  issue: Issue | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewCommentsDialog({ issue, open, onOpenChange }: ViewCommentsDialogProps) {
  const [commentText, setCommentText] = useState("")

  const comments = useAppStore((state) => state.comments)
  const user = useAppStore((state) => state.user)
  const isLoggedIn = useAppStore((state) => state.isLoggedIn)
  const addComment = useAppStore((state) => state.addComment)

  // Filter comments for the current issue
  const issueComments = issue ? comments.filter((c) => c.issueId === issue.id) : []

  const handleAddComment = () => {
    if (!issue || !commentText.trim() || !isLoggedIn) return

    // Create a new comment
    const newComment = {
      issueId: issue.id,
      author: user?.name || "Anonymous",
      avatarUrl: user?.avatar || "/placeholder.svg?height=32&width=32",
      content: commentText,
      timestamp: new Date().toISOString(),
    }

    // Add the comment to the store
    addComment(newComment)

    // Show success toast
    toast.success("Comment added successfully")

    setCommentText("")
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  if (!issue) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comments for {issue.title}</DialogTitle>
          <DialogDescription>View and add comments to this issue</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {issueComments.length === 0 ? (
            <div className="rounded-md border border-dashed p-4 text-center">
              <p className="text-sm text-muted-foreground">No comments yet</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
              {issueComments.map((comment) => (
                <div
                  key={comment.id}
                  className={`rounded-lg p-3 ${comment.isOfficial ? "bg-primary/5" : "bg-muted/50"}`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.avatarUrl} alt={comment.author} />
                      <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{comment.author}</p>
                          {comment.isOfficial && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                              Official
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{formatTimestamp(comment.timestamp)}</p>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} alt="You" />
                <AvatarFallback>{user?.name?.charAt(0) || "Y"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder={isLoggedIn ? "Add a comment..." : "Login to comment"}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[80px] resize-none text-sm"
                  disabled={!isLoggedIn}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                className="gap-2 text-sm"
                size="sm"
                onClick={handleAddComment}
                disabled={!commentText.trim() || !isLoggedIn}
              >
                Post Comment
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

