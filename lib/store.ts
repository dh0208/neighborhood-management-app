import { create } from "zustand"
import { issueData, commentData, userData } from "./data"
import type { Issue, Comment, User, UserSettings } from "./types"

interface AppState {
  issues: Issue[]
  comments: Comment[]
  user: User | null
  isLoggedIn: boolean
  userSettings: UserSettings

  // Actions
  addIssue: (issue: Omit<Issue, "id">) => void
  addComment: (comment: Omit<Comment, "id">) => void
  voteForIssue: (issueId: number) => void
  login: (email: string, password: string) => void
  logout: () => void
  updateUserProfile: (profile: Partial<User>) => void
  updateUserSettings: (settings: Partial<UserSettings>) => void
}

export const useAppStore = create<AppState>((set) => ({
  issues: issueData,
  comments: commentData,
  user: null,
  isLoggedIn: false,
  userSettings: {
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      showEmail: false,
      showName: true,
    },
    display: {
      darkMode: false,
      compactView: false,
    },
  },

  addIssue: (issueData) =>
    set((state) => {
      const newId = Math.max(0, ...state.issues.map((issue) => issue.id)) + 1
      const newIssue: Issue = {
        id: newId,
        ...issueData,
      }
      return { issues: [newIssue, ...state.issues] }
    }),

  addComment: (commentData) =>
    set((state) => {
      const newId = Math.max(0, ...state.comments.map((comment) => comment.id)) + 1
      const newComment: Comment = {
        id: newId,
        ...commentData,
      }
      return { comments: [...state.comments, newComment] }
    }),

  voteForIssue: (issueId) =>
    set((state) => ({
      issues: state.issues.map((issue) => (issue.id === issueId ? { ...issue, votes: issue.votes + 1 } : issue)),
    })),

  login: (email, password) =>
    set(() => ({
      user: userData,
      isLoggedIn: true,
    })),

  logout: () =>
    set(() => ({
      user: null,
      isLoggedIn: false,
    })),

  updateUserProfile: (profile) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...profile } : null,
    })),

  updateUserSettings: (settings) =>
    set((state) => ({
      userSettings: { ...state.userSettings, ...settings },
    })),
}))

