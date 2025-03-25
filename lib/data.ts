// This file serves as our "mock database" for the application

import type { Issue, Comment, User, Contact } from "./types"

// Sample user data
export const userData: User = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=40&width=40",
  role: "resident",
}

// Sample issue data
export const issueData: Issue[] = [
  {
    id: 1,
    title: "Pothole on Main Street",
    description:
      "Large pothole at the intersection of Main and Oak streets. Approximately 2 feet wide and 6 inches deep.",
    category: "pothole",
    status: "reported",
    location: "Main Street & Oak Avenue",
    coordinates: { lat: 40.7128, lng: -74.006 },
    reportedBy: "John Doe",
    reportedAt: "2023-04-10T14:30:00Z",
    votes: 12,
    comments: 4,
    images: ["/placeholder.svg?height=200&width=350"],
    progress: 0,
  },
  {
    id: 2,
    title: "Streetlight Out on Elm Street",
    description:
      "The streetlight on the corner of Elm and Pine streets has been out for over a week, creating a safety hazard at night.",
    category: "streetlight",
    status: "in_progress",
    location: "Elm Street & Pine Street",
    coordinates: { lat: 40.7148, lng: -74.008 },
    reportedBy: "Jane Smith",
    reportedAt: "2023-04-08T18:15:00Z",
    votes: 8,
    comments: 2,
    images: ["/placeholder.svg?height=200&width=350"],
    progress: 50,
  },
  {
    id: 3,
    title: "Graffiti on Community Center",
    description:
      "Large graffiti tags on the north wall of the community center. Approximately 8 feet wide and 5 feet tall.",
    category: "graffiti",
    status: "completed",
    location: "123 Community Dr",
    coordinates: { lat: 40.7118, lng: -74.003 },
    reportedBy: "Michael Brown",
    reportedAt: "2023-04-05T09:45:00Z",
    votes: 5,
    comments: 6,
    images: ["/placeholder.svg?height=200&width=350"],
    progress: 100,
  },
  {
    id: 4,
    title: "Trash Accumulation in Park",
    description:
      "Significant amount of litter and trash has accumulated in Central Park, particularly around the playground area.",
    category: "trash",
    status: "reported",
    location: "Central Park",
    coordinates: { lat: 40.7135, lng: -74.0046 },
    reportedBy: "Sarah Johnson",
    reportedAt: "2023-04-09T10:15:00Z",
    votes: 15,
    comments: 8,
    images: ["/placeholder.svg?height=200&width=350"],
    progress: 0,
  },
  {
    id: 5,
    title: "Damaged Sidewalk on Oak Street",
    description:
      "Several sections of sidewalk on Oak Street between 5th and 6th Avenue are cracked and uneven, creating a tripping hazard.",
    category: "sidewalk",
    status: "in_progress",
    location: "Oak Street",
    coordinates: { lat: 40.7142, lng: -74.0052 },
    reportedBy: "Robert Wilson",
    reportedAt: "2023-04-07T16:45:00Z",
    votes: 7,
    comments: 3,
    images: ["/placeholder.svg?height=200&width=350"],
    progress: 35,
  },
  {
    id: 6,
    title: "Broken Bench in Riverside Park",
    description: "Wooden bench near the river entrance is broken and unsafe to sit on.",
    category: "other",
    status: "completed",
    location: "Riverside Park",
    coordinates: { lat: 40.7125, lng: -74.0065 },
    reportedBy: "Emily Davis",
    reportedAt: "2023-04-03T11:30:00Z",
    votes: 4,
    comments: 2,
    images: ["/placeholder.svg?height=200&width=350"],
    progress: 100,
  },
]

// Sample comment data
export const commentData: Comment[] = [
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
  {
    id: 5,
    issueId: 4,
    author: "Park Visitor",
    avatarUrl: "/placeholder.svg?height=32&width=32",
    content: "The trash situation is getting worse. We need more frequent cleanups.",
    timestamp: "2023-04-09T15:20:00Z",
  },
  {
    id: 6,
    issueId: 5,
    author: "Local Resident",
    avatarUrl: "/placeholder.svg?height=32&width=32",
    content: "I've seen elderly people almost trip on this sidewalk. It needs urgent attention.",
    timestamp: "2023-04-08T10:45:00Z",
  },
  {
    id: 7,
    issueId: 6,
    author: "Park Maintenance",
    avatarUrl: "/placeholder.svg?height=32&width=32",
    content: "The bench has been replaced with a new one. Thank you for reporting.",
    timestamp: "2023-04-04T13:10:00Z",
    isOfficial: true,
  },
]

// Sample municipal contacts
export const contactData: Contact[] = [
  {
    id: 1,
    department: "Public Works Department",
    description: "For infrastructure issues",
    phone: "555-123-4567",
    email: "publicworks@cityname.gov",
  },
  {
    id: 2,
    department: "Parks & Recreation",
    description: "For issues in parks",
    phone: "555-234-5678",
    email: "parks@cityname.gov",
  },
  {
    id: 3,
    department: "City Sanitation",
    description: "For trash and cleanliness issues",
    phone: "555-345-6789",
    email: "sanitation@cityname.gov",
  },
]

// Sample activity data
export const activityData = [
  {
    id: 1,
    title: "Pothole reported on Main St.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    user: "John Doe",
  },
  {
    id: 2,
    title: "Status update: Streetlight repair",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    user: "City Works",
  },
  {
    id: 3,
    title: "Graffiti cleaned at Central Park",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    user: "Cleanup Crew",
  },
]

// Stats data
export const statsData = {
  reported: 42,
  inProgress: 18,
  completed: 76,
  activeUsers: 124,
  completionRate: 83,
}

