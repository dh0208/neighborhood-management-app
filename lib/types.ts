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

