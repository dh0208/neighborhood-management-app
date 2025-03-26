"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Issues } from "@/components/issues"
import { ReportIssueButton } from "@/components/report-issue-button"
import { MapPreview } from "@/components/map-preview"
import { UserAuthButton } from "@/components/user-auth-button"
import { StatsBar } from "@/components/stats-bar"
import { contactData, activityData } from "@/lib/data"

export default function HomePage() {
  const [showMyReports, setShowMyReports] = useState(false)

  const handleShowMyReports = () => {
    setShowMyReports(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4 mx-auto">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
              <path d="M9 2v7" />
              <path d="M15 2v7" />
            </svg>
            <span className="text-xl font-bold">NeighborWatch</span>
          </div>
          <div className="flex items-center gap-4">
            <UserAuthButton onShowMyReports={handleShowMyReports} />
          </div>
        </div>
      </header>

      <main className="container py-6 mx-auto">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Community Issues Dashboard</h1>
            <p className="text-muted-foreground">Monitor and report neighborhood issues in your area</p>
          </div>
          <ReportIssueButton />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <StatsBar />
            <MapPreview />
            <Issues showMyReportsOnly={showMyReports} setShowMyReportsOnly={setShowMyReports} />
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="mb-4 text-xl font-semibold">Municipal Contacts</h3>
                <div className="space-y-4">
                  {contactData.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{contact.department}</p>
                        <p className="text-sm text-muted-foreground">{contact.description}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => window.open(`mailto:${contact.email}`)}>
                        Contact
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="mb-4 text-xl font-semibold">Recent Activity</h3>
                <div className="space-y-4">
                  {activityData.map((activity) => (
                    <div key={activity.id} className="space-y-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()} by {activity.user}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

