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
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/lib/store"
import { ProfileDialog } from "./profile-dialog"
import { SettingsDialog } from "./settings-dialog"
import { MyReportsDialog } from "./my-reports-dialog"

export function UserAuthButton() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()

  const isLoggedIn = useAppStore((state) => state.isLoggedIn)
  const user = useAppStore((state) => state.user)
  const login = useAppStore((state) => state.login)
  const logout = useAppStore((state) => state.logout)

  const [profileOpen, setProfileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [myReportsOpen, setMyReportsOpen] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would authenticate with a backend
    if (email && password) {
      login(email, password)
      setIsLoginOpen(false)
      setEmail("")
      setPassword("")
      toast({
        title: "Logged in successfully",
        description: "Welcome back to NeighborWatch!",
      })
    }
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
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
            <DialogDescription>Sign in to your account to report and track neighborhood issues.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 py-2 sm:py-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
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
            <DropdownMenuItem onClick={() => setProfileOpen(true)}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMyReportsOpen(true)}>My Reports</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSettingsOpen(true)}>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <MyReportsDialog open={myReportsOpen} onOpenChange={setMyReportsOpen} />
    </>
  )
}

