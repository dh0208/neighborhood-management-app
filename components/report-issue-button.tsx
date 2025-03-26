"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MapPinPoint } from "./map-pin-point"
import { ImageUpload } from "./image-upload"
import { PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  location: z.string().min(2, { message: "Location is required." }),
  name: z.string().min(2, { message: "Your name is required." }).optional(),
})

export function ReportIssueButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.006 })
  const [images, setImages] = useState<string[]>([])

  const user = useAppStore((state) => state.user)
  const isLoggedIn = useAppStore((state) => state.isLoggedIn)
  const addIssue = useAppStore((state) => state.addIssue)
  const login = useAppStore((state) => state.login)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      location: "",
      name: user?.name || "",
    },
  })

  // Update form when user changes
  useEffect(() => {
    if (user) {
      form.setValue("name", user.name)
    }
  }, [user, form])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // If user is not logged in but provided a name, log them in
    if (!isLoggedIn && values.name) {
      login(values.name)
    }

    // Create a new issue with the form values
    const newIssue = {
      title: values.title,
      description: values.description,
      category: values.category as any,
      status: "reported" as const,
      location: values.location,
      coordinates: location,
      reportedBy: user?.name || values.name || "Anonymous",
      reportedAt: new Date().toISOString(),
      votes: 0,
      comments: 0,
      images: images.length > 0 ? images : ["/placeholder.svg?height=200&width=350"],
      progress: 0,
    }

    // Add the new issue to the store
    const newIssueId = addIssue(newIssue)

    toast.success("Issue reported successfully", {
      description: "Your report has been submitted and will be reviewed by local authorities.",
    })

    setIsOpen(false)
    form.reset({
      title: "",
      category: "",
      description: "",
      location: "",
      name: user?.name || "",
    })
    setImages([])
  }

  const updateLocation = (lat: number, lng: number) => {
    setLocation({ lat, lng })
    form.setValue("location", `${lat.toFixed(6)}, ${lng.toFixed(6)}`)
  }

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Reset form when opening
      form.reset({
        title: "",
        category: "",
        description: "",
        location: "",
        name: user?.name || "",
      })
      setImages([])
    }
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Report an Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle>Report a Neighborhood Issue</DialogTitle>
          <DialogDescription>
            Fill out the form below to report an issue in your neighborhood. Your report will be sent to the appropriate
            department.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 md:py-4">
            {!isLoggedIn && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Broken Streetlight on Main St." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pothole">Pothole</SelectItem>
                      <SelectItem value="streetlight">Streetlight</SelectItem>
                      <SelectItem value="graffiti">Graffiti</SelectItem>
                      <SelectItem value="trash">Trash/Litter</SelectItem>
                      <SelectItem value="sidewalk">Damaged Sidewalk</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Provide details about the issue" className="min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Pin Location on Map</Label>
              <div className="max-w-full overflow-hidden">
                <MapPinPoint initialLocation={location} onLocationChange={updateLocation} />
              </div>
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Location will be filled automatically from map" readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Upload Photos (Optional)</Label>
              <ImageUpload images={images} onChange={setImages} maxImages={3} />
              <p className="text-xs text-muted-foreground">Upload up to 3 images to help describe the issue</p>
            </div>

            <DialogFooter className={cn("pt-2 md:pt-4", form.formState.isSubmitting ? "opacity-50" : "")}>
              <Button variant="outline" onClick={() => setIsOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
                {form.formState.isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

