"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizontal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Comment } from "@/lib/types"
import { useAppStore } from "@/lib/store"

interface CommentSectionProps {
  issueId: number
}

export function CommentSection({ issueId }: CommentSectionProps) {
  const [commentText, setCommentText] = useState("")
  const { toast } = useToast()
  const comments = useAppStore((state) => state.comments)
  const addComment = useAppStore((state) => state.addComment)

  // Filter comments for the current issue
  const issueComments = comments.filter((c) => c.issueId === issueId)

  const handleAddComment = () => {
    if (!commentText.trim()) return

    // Create a new comment
    const newComment: Omit<Comment, "id"> = {
      issueId,
      author: "You",
      avatarUrl: "/placeholder.svg?height=32&width=32",
      content: commentText,
      timestamp: new Date().toISOString(),
    }

    // Add the comment to the store
    addComment(newComment)

    // Show success toast
    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully.",
    })

    setCommentText("")
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Comments</h4>

      {issueComments.length === 0 ? (
        <div className="rounded-md border border-dashed p-4 text-center">
          <p className="text-sm text-muted-foreground">No comments yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {issueComments.map((comment) => (
            <div
              key={comment.id}
              className={`rounded-lg p-2 sm:p-3 ${comment.isOfficial ? "bg-primary/5" : "bg-muted/50"}`}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                  <AvatarImage src={comment.avatarUrl} alt={comment.author} />
                  <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-medium">{comment.author}</p>
                      {comment.isOfficial && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          Official
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{formatTimestamp(comment.timestamp)}</p>
                  </div>
                  <p className="text-xs sm:text-sm">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 space-y-2">
        <div className="flex items-start gap-2 sm:gap-3">
          <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-[60px] sm:min-h-[80px] resize-none text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            className="gap-1 sm:gap-2 text-xs sm:text-sm"
            size="sm"
            onClick={handleAddComment}
            disabled={!commentText.trim()}
          >
            Post Comment
            <SendHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

