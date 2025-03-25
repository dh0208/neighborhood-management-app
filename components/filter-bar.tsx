"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter, MapPin, Search, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FilterBarProps {
  onFilterChange: (filters: {
    search: string
    categories: Record<string, boolean>
    nearMe: boolean
  }) => void
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState({
    pothole: true,
    streetlight: true,
    graffiti: true,
    trash: true,
    sidewalk: true,
    other: true,
  })
  const [nearMe, setNearMe] = useState(false)
  const { toast } = useToast()

  // Update parent component when filters change
  useEffect(() => {
    // Only call onFilterChange when the dependencies actually change
    onFilterChange({
      search: searchQuery,
      categories,
      nearMe,
    })
  }, [searchQuery, categories, nearMe, onFilterChange])

  const toggleCategory = (category: keyof typeof categories) => {
    setCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleNearMe = () => {
    if (navigator.geolocation) {
      setNearMe(true)
      toast({
        title: "Location Access",
        description: "Using your current location to find nearby issues.",
      })
    } else {
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      })
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Trigger search
      toast({
        title: "Search Results",
        description: searchQuery ? `Showing results for "${searchQuery}"` : "Showing all issues",
      })
    }
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-4 p-4 sm:p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search issues..."
              className="pl-8 pr-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            {searchQuery && (
              <button
                className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Filter className="h-4 w-4" />
                  Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={categories.pothole}
                  onCheckedChange={() => toggleCategory("pothole")}
                >
                  Pothole
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={categories.streetlight}
                  onCheckedChange={() => toggleCategory("streetlight")}
                >
                  Streetlight
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={categories.graffiti}
                  onCheckedChange={() => toggleCategory("graffiti")}
                >
                  Graffiti
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={categories.trash} onCheckedChange={() => toggleCategory("trash")}>
                  Trash/Litter
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={categories.sidewalk}
                  onCheckedChange={() => toggleCategory("sidewalk")}
                >
                  Damaged Sidewalk
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={categories.other} onCheckedChange={() => toggleCategory("other")}>
                  Other
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant={nearMe ? "default" : "outline"} size="sm" className="h-9 gap-1" onClick={handleNearMe}>
              <MapPin className="h-4 w-4" />
              Near Me
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 max-w-full overflow-hidden">
          {Object.entries(categories).map(
            ([category, isChecked]) =>
              isChecked && (
                <div
                  key={category}
                  className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                  <button
                    className="ml-1 rounded-full p-0.5 hover:bg-background"
                    onClick={() => toggleCategory(category as keyof typeof categories)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
              ),
          )}

          {nearMe && (
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              Near Current Location
              <button className="ml-1 rounded-full p-0.5 hover:bg-background/20" onClick={() => setNearMe(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Only show Clear All if at least one filter is applied */}
          {(Object.values(categories).some((isChecked) => !isChecked) || nearMe || searchQuery) && (
            <button
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                setCategories({
                  pothole: true,
                  streetlight: true,
                  graffiti: true,
                  trash: true,
                  sidewalk: true,
                  other: true,
                })
                setNearMe(false)
                setSearchQuery("")
              }}
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

FilterBar.defaultProps = {
  onFilterChange: () => {},
}

