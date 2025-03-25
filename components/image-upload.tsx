"use client"

import type React from "react"

import { useState } from "react"
import { ImagePlus, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onChange, maxImages = 3 }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsLoading(true)

    // In a real app, this would upload files to a server or blob storage
    // Here we just create local object URLs as a simulation
    const newImages: string[] = []

    Array.from(files).forEach((file) => {
      if (images.length + newImages.length >= maxImages) return

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result as string)

          if (newImages.length === files.length || images.length + newImages.length >= maxImages) {
            onChange([...images, ...newImages])
            setIsLoading(false)
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    onChange(newImages)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <div key={index} className="relative h-24 w-24 rounded-md border overflow-hidden">
            <img
              src={image || "/placeholder.svg"}
              alt={`Uploaded image ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              className="absolute right-1 top-1 rounded-full bg-foreground/80 p-1 text-background"
              onClick={() => removeImage(index)}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label
            className={cn(
              "flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed",
              isLoading ? "opacity-50" : "hover:border-primary",
            )}
          >
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
            <span className="mt-1 text-xs text-muted-foreground">Upload</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </label>
        )}
      </div>
    </div>
  )
}

