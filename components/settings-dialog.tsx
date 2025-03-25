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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/lib/store"
import type { UserSettings } from "@/lib/types"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { toast } = useToast()
  const userSettings = useAppStore((state) => state.userSettings)
  const updateUserSettings = useAppStore((state) => state.updateUserSettings)

  const [settings, setSettings] = useState<UserSettings>(userSettings)

  // Update local state when store changes
  useEffect(() => {
    setSettings(userSettings)
  }, [userSettings])

  const handleSave = () => {
    updateUserSettings(settings)

    toast({
      title: "Settings Updated",
      description: "Your settings have been saved successfully.",
    })

    onOpenChange(false)
  }

  const updateSettings = (category: keyof UserSettings, key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your app experience and notification preferences.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="notifications" className="py-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email updates about your reported issues.</p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.notifications.email}
                onCheckedChange={(checked) => updateSettings("notifications", "email", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications for status updates.</p>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.notifications.push}
                onCheckedChange={(checked) => updateSettings("notifications", "push", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive text messages for urgent updates.</p>
              </div>
              <Switch
                id="sms-notifications"
                checked={settings.notifications.sms}
                onCheckedChange={(checked) => updateSettings("notifications", "sms", checked)}
              />
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-email">Show Email</Label>
                <p className="text-sm text-muted-foreground">Allow others to see your email address.</p>
              </div>
              <Switch
                id="show-email"
                checked={settings.privacy.showEmail}
                onCheckedChange={(checked) => updateSettings("privacy", "showEmail", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-name">Show Name</Label>
                <p className="text-sm text-muted-foreground">Show your name on reports and comments.</p>
              </div>
              <Switch
                id="show-name"
                checked={settings.privacy.showName}
                onCheckedChange={(checked) => updateSettings("privacy", "showName", checked)}
              />
            </div>
          </TabsContent>

          <TabsContent value="display" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Use dark theme for the application.</p>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.display.darkMode}
                onCheckedChange={(checked) => updateSettings("display", "darkMode", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact-view">Compact View</Label>
                <p className="text-sm text-muted-foreground">Show more content with less spacing.</p>
              </div>
              <Switch
                id="compact-view"
                checked={settings.display.compactView}
                onCheckedChange={(checked) => updateSettings("display", "compactView", checked)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

