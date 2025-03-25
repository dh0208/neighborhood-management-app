export interface Issue {
  id: number
  title: string
  description: string
  category: "pothole" | "streetlight" | "graffiti" | "trash" | "sidewalk" | "other"
  status: "reported" | "in_progress" | "completed"
  location: string
  coordinates: { lat: number; lng: number }
  reportedBy: string
  reportedAt: string
  votes: number
  comments: number
  images: string[]
  progress: number
}

export interface Comment {
  id: number
  issueId: number
  author: string
  avatarUrl: string
  content: string
  timestamp: string
  isOfficial?: boolean
}

export interface User {
  id: number
  name: string
  email: string
  avatar: string
  role: "resident" | "official" | "admin"
}

export interface Contact {
  id: number
  department: string
  description: string
  phone: string
  email: string
}

export interface MapLayer {
  id: string
  name: string
  enabled: boolean
  color: string
}

export interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacy: {
    showEmail: boolean
    showName: boolean
  }
  display: {
    darkMode: boolean
    compactView: boolean
  }
}

