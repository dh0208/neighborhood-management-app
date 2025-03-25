import { Button } from "@/components/ui/button"
import { Issues } from "@/components/issues"
import { ReportIssueButton } from "@/components/report-issue-button"
import { MapPreview } from "@/components/map-preview"
import { UserAuthButton } from "@/components/user-auth-button"
import { FilterBar } from "@/components/filter-bar"
import { StatsBar } from "@/components/stats-bar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4 px-4 sm:px-6">
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
            <UserAuthButton />
          </div>
        </div>
      </header>

      <main className="container py-6">
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
            <FilterBar />
            <MapPreview />
            <Issues />
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="mb-4 text-xl font-semibold">Municipal Contacts</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Public Works Department</p>
                      <p className="text-sm text-muted-foreground">For infrastructure issues</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Contact
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Parks & Recreation</p>
                      <p className="text-sm text-muted-foreground">For issues in parks</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Contact
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">City Sanitation</p>
                      <p className="text-sm text-muted-foreground">For trash and cleanliness issues</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="mb-4 text-xl font-semibold">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="font-medium">Pothole reported on Main St.</p>
                    <p className="text-sm text-muted-foreground">2 hours ago by John Doe</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Status update: Streetlight repair</p>
                    <p className="text-sm text-muted-foreground">3 hours ago by City Works</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Graffiti cleaned at Central Park</p>
                    <p className="text-sm text-muted-foreground">Yesterday by Cleanup Crew</p>
                  </div>
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  View All Activity
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

