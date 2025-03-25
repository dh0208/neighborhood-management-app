"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizontal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CommentSectionProps {
  issueId: number
}

// Sample comment data
const commentData = [
  {
    id: 1,
    issueId: 1,
    author: "Jane Smith",
    avatarUrl: "/placeholder.svg?height=32&width=32",
    content: "I drive by this pothole every day. It's getting larger and has already damaged several cars.",
    timestamp: "2023-04-10T16:30:00Z",
  },
  {
    id: 2,
    issueId: 1,
    author: "City Works Dept",
    avatarUrl: "/placeholder.svg?height=32&width=32",
    content: "Thank you for reporting this issue. We have scheduled repairs for next week.",
    timestamp: "2023-04-11T09:15:00Z",
    isOfficial: true,
  },
  {
    id: 3,
    issueId: 2,
    author: "Michael Brown",
    avatarUrl: "/placeholder.svg?height=32&width=32",
    content: "This has been an issue for a while. It's very dark at night and feels unsafe.",
    timestamp: "2023-04-08T19:45:00Z",
  },
  {
    id: 4,
    issueId: 3,
    author: "Community Center Director",
    avatarUrl: "/placeholder.svg?height=32&width=32",
    content: "Thank you all for reporting this issue. The graffiti has been removed and the wall repainted.",
    timestamp: "2023-04-06T14:20:00Z",
    isOfficial: true,
  },
]

export function CommentSection({ issueId }: CommentSectionProps) {
  const [comment, setComment] = useState("")
  const { toast } = useToast()

  // Filter comments for the current issue
  const issueComments = commentData.filter((c) => c.issueId === issueId)

  const handleAddComment = () => {
    if (!comment.trim()) return

    // In a real app, this would send the comment to the backend
    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully.",
    })

    setComment("")
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
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[60px] sm:min-h-[80px] resize-none text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            className="gap-1 sm:gap-2 text-xs sm:text-sm"
            size="sm"
            onClick={handleAddComment}
            disabled={!comment.trim()}
          >
            Post Comment
            <SendHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

