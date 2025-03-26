import { create } from "zustand"
import { persist } from "zustand/middleware"
import { issueData, commentData } from "./data"
import type { Issue, Comment, User } from "./types"

interface AppState {
  issues: Issue[]
  comments: Comment[]
  user: User | null
  isLoggedIn: boolean
  userVotes: Record<number, boolean>

  // Actions
  addIssue: (issue: Omit<Issue, "id">) => number
  editIssue: (id: number, updates: Partial<Issue>) => void
  deleteIssue: (id: number) => void
  restoreIssue: (issue: Issue) => void
  addComment: (comment: Omit<Comment, "id">) => void
  toggleVote: (issueId: number) => void
  progressIssue: (issueId: number) => void
  login: (name: string) => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      issues: issueData,
      comments: commentData,
      user: null,
      isLoggedIn: false,
      userVotes: {},

      addIssue: (issueData) => {
        const newId = Math.max(0, ...get().issues.map((issue) => issue.id)) + 1
        const newIssue: Issue = {
          id: newId,
          ...issueData,
        }
        set((state) => ({ issues: [newIssue, ...state.issues] }))
        return newId
      },

      editIssue: (id, updates) => {
        set((state) => ({
          issues: state.issues.map((issue) => (issue.id === id ? { ...issue, ...updates } : issue)),
        }))
      },

      deleteIssue: (id) => {
        set((state) => ({
          issues: state.issues.filter((issue) => issue.id !== id),
        }))
      },

      restoreIssue: (issue) => {
        set((state) => ({
          issues: [...state.issues, issue],
        }))
      },

      addComment: (commentData) => {
        const newId = Math.max(0, ...get().comments.map((comment) => comment.id)) + 1
        const newComment: Comment = {
          id: newId,
          ...commentData,
        }

        // Update comment count on the issue
        set((state) => ({
          comments: [...state.comments, newComment],
          issues: state.issues.map((issue) =>
            issue.id === commentData.issueId ? { ...issue, comments: issue.comments + 1 } : issue,
          ),
        }))
      },

      toggleVote: (issueId) => {
        const currentVoted = get().userVotes[issueId] || false

        set((state) => ({
          userVotes: {
            ...state.userVotes,
            [issueId]: !currentVoted,
          },
          issues: state.issues.map((issue) =>
            issue.id === issueId
              ? {
                  ...issue,
                  votes: currentVoted ? Math.max(0, issue.votes - 1) : issue.votes + 1,
                }
              : issue,
          ),
        }))
      },

      progressIssue: (issueId) => {
        set((state) => ({
          issues: state.issues.map((issue) => {
            if (issue.id !== issueId) return issue

            let newStatus = issue.status
            let newProgress = issue.progress

            if (issue.status === "reported") {
              newStatus = "in_progress"
              newProgress = 50
            } else if (issue.status === "in_progress") {
              newStatus = "completed"
              newProgress = 100
            }

            return {
              ...issue,
              status: newStatus,
              progress: newProgress,
            }
          }),
        }))
      },

      login: (name) =>
        set(() => ({
          user: {
            id: 1,
            name,
            email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
            avatar: "/placeholder.svg?height=40&width=40",
            role: "resident",
          },
          isLoggedIn: true,
        })),

      logout: () =>
        set(() => ({
          user: null,
          isLoggedIn: false,
        })),
    }),
    {
      name: "neighborhood-app-storage",
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        userVotes: state.userVotes,
        comments: state.comments,
        issues: state.issues,
      }),
    },
  ),
)

