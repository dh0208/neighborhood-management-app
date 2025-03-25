"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { CommentSection } from "./comment-section";

// Sample issue data
const issueData = [
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
];

export function Issues() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
        return "bg-red-500";
      case "in_progress":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "reported":
        return "Reported";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reported":
        return <AlertCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "pothole":
        return <Badge variant="outline">Pothole</Badge>;
      case "streetlight":
        return <Badge variant="outline">Streetlight</Badge>;
      case "graffiti":
        return <Badge variant="outline">Graffiti</Badge>;
      case "trash":
        return <Badge variant="outline">Trash/Litter</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  // Filter issues based on active tab
  const filteredIssues =
    activeTab === "all"
      ? issueData
      : issueData.filter((issue) => issue.status === activeTab);

  const selectedIssueData =
    selectedIssue !== null
      ? issueData.find((issue) => issue.id === selectedIssue)
      : null;

  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-xl font-semibold">Reported Issues</h3>
        </div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="reported">Reported</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="border-0 p-0 pt-6">
            <div className="space-y-4 px-6 pb-6">
              {filteredIssues.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                  <p className="text-muted-foreground">No issues found</p>
                </div>
              ) : (
                filteredIssues.map((issue) => (
                  <Card key={issue.id} className="overflow-hidden">
                    <CardHeader className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
                        <div>
                          <CardTitle className="text-base sm:text-lg">
                            {issue.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" /> {issue.location}
                          </CardDescription>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {getCategoryBadge(issue.category)}
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {getStatusIcon(issue.status)}
                            {getStatusLabel(issue.status)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 gap-4 p-3 sm:p-4 pt-0">
                      <div>
                        <p className="line-clamp-2 text-sm">
                          {issue.description}
                        </p>

                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{issue.progress}%</span>
                          </div>
                          <Progress value={issue.progress} className="h-2" />
                        </div>
                      </div>

                      {issue.images.length > 0 && (
                        <div>
                          <div className="aspect-video relative overflow-hidden rounded-md">
                            <img
                              src={issue.images[0] || "/placeholder.svg"}
                              alt={issue.title}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t p-3 sm:p-4 text-sm gap-3 sm:gap-0">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src="/placeholder.svg?height=24&width=24"
                            alt={issue.reportedBy}
                          />
                          <AvatarFallback>
                            {issue.reportedBy.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground text-xs sm:text-sm">
                          Reported by {issue.reportedBy} •{" "}
                          {new Date(issue.reportedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-muted-foreground"
                        >
                          <ThumbsUp className="h-4 w-4" /> {issue.votes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-muted-foreground"
                        >
                          <MessageSquare className="h-4 w-4" /> {issue.comments}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setSelectedIssue(issue.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Issue Details Dialog */}
      <Dialog
        open={selectedIssue !== null}
        onOpenChange={(open) => !open && setSelectedIssue(null)}
      >
        {selectedIssueData && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                {selectedIssueData.title}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {selectedIssueData.location}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-6 mt-4">
              {/* Main content section */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Description</h4>
                  <p className="text-sm">{selectedIssueData.description}</p>
                </div>

                {/* Images section - moved up on mobile for better visibility */}
                {selectedIssueData.images.length > 0 && (
                  <div className="md:hidden">
                    <h4 className="text-sm font-medium mb-2">Images</h4>
                    <div className="space-y-2">
                      {selectedIssueData.images.map((image, index) => (
                        <div
                          key={index}
                          className="overflow-hidden rounded-md border"
                        >
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Image ${index + 1} for ${
                              selectedIssueData.title
                            }`}
                            className="w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-2">Status Timeline</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-3 w-3 rounded-full bg-red-500 ring-2 ring-red-100`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Reported</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            selectedIssueData.reportedAt
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {selectedIssueData.status === "in_progress" ||
                    selectedIssueData.status === "completed" ? (
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-3 w-3 rounded-full bg-yellow-500 ring-2 ring-yellow-100`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">In Progress</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              new Date(selectedIssueData.reportedAt).getTime() +
                                86400000
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {selectedIssueData.status === "completed" ? (
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-3 w-3 rounded-full bg-green-500 ring-2 ring-green-100`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Completed</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              new Date(selectedIssueData.reportedAt).getTime() +
                                172800000
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Details section - displayed in a row on mobile for better space usage */}
                <div className="md:hidden">
                  <h4 className="text-sm font-medium mb-2">Details</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md border p-2">
                      <p className="text-xs text-muted-foreground">Category</p>
                      <p className="text-sm font-medium">
                        {selectedIssueData.category.charAt(0).toUpperCase() +
                          selectedIssueData.category.slice(1)}
                      </p>
                    </div>
                    <div className="rounded-md border p-2">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <div
                          className={`h-2 w-2 rounded-full ${getStatusColor(
                            selectedIssueData.status
                          )}`}
                        ></div>
                        {getStatusLabel(selectedIssueData.status)}
                      </p>
                    </div>
                    <div className="rounded-md border p-2">
                      <p className="text-xs text-muted-foreground">Votes</p>
                      <p className="text-sm font-medium">
                        {selectedIssueData.votes}
                      </p>
                    </div>
                    <div className="rounded-md border p-2">
                      <p className="text-xs text-muted-foreground">Comments</p>
                      <p className="text-sm font-medium">
                        {selectedIssueData.comments}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reporter info - compact on mobile */}
                <div className="md:hidden">
                  <h4 className="text-sm font-medium mb-2">Reported By</h4>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt={selectedIssueData.reportedBy}
                      />
                      <AvatarFallback>
                        {selectedIssueData.reportedBy.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {selectedIssueData.reportedBy}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          selectedIssueData.reportedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <CommentSection issueId={selectedIssueData.id} />
              </div>

              {/* Sidebar content - only visible on desktop */}
              <div className="hidden md:block md:space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Details</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Category:</dt>
                      <dd>
                        {selectedIssueData.category.charAt(0).toUpperCase() +
                          selectedIssueData.category.slice(1)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Status:</dt>
                      <dd className="flex items-center gap-1">
                        <div
                          className={`h-2 w-2 rounded-full ${getStatusColor(
                            selectedIssueData.status
                          )}`}
                        ></div>
                        {getStatusLabel(selectedIssueData.status)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Votes:</dt>
                      <dd>{selectedIssueData.votes}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Comments:</dt>
                      <dd>{selectedIssueData.comments}</dd>
                    </div>
                  </dl>
                </div>

                {selectedIssueData.images.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Images</h4>
                    <div className="space-y-2">
                      {selectedIssueData.images.map((image, index) => (
                        <div
                          key={index}
                          className="overflow-hidden rounded-md border"
                        >
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Image ${index + 1} for ${
                              selectedIssueData.title
                            }`}
                            className="w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-2">Reported By</h4>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt={selectedIssueData.reportedBy}
                      />
                      <AvatarFallback>
                        {selectedIssueData.reportedBy.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {selectedIssueData.reportedBy}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          selectedIssueData.reportedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
