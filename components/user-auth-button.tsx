"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"

interface UserAuthButtonProps {
  onShowMyReports?: () => void
}

export function UserAuthButton({ onShowMyReports }: UserAuthButtonProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [name, setName] = useState("")

  const isLoggedIn = useAppStore((state) => state.isLoggedIn)
  const user = useAppStore((state) => state.user)
  const login = useAppStore((state) => state.login)
  const logout = useAppStore((state) => state.logout)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      login(name)
      setIsLoginOpen(false)
      setName("")
      toast.success("Logged in successfully", {
        description: `Welcome to NeighborWatch, ${name}!`,
      })
    }
  }

  const handleLogout = () => {
    logout()
    toast("Logged out", {
      description: "You have been logged out successfully",
    })
  }

  if (!isLoggedIn) {
    return (
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogTrigger asChild>
          <Button>Login</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-4 sm:p-6 max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Login to NeighborWatch</DialogTitle>
            <DialogDescription>Enter your name to report and track neighborhood issues.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 py-2 sm:py-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => setIsLoginOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Login</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar || "/placeholder.svg?height=40&width=40"} alt="User avatar" />
              <AvatarFallback>{user?.name.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => toast.info("Profile feature coming soon")}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={onShowMyReports}>My Reports</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

UserAuthButton.defaultProps = {
  onShowMyReports: () => {},
}

