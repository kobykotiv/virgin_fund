"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/providers/auth-provider"
import { UserAvatar } from "@/components/user-avatar"
import { Loader2, Camera, Shield, Bell, Key, Trash2, User } from "lucide-react"

export default function ProfilePage() {
  const { user, isDemoMode } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const [profileData, setProfileData] = useState({
    name: user?.name || "Demo User",
    email: user?.email || "demo@example.com",
    bio: "Passionate trader and investor focused on algorithmic trading strategies.",
    location: "New York, USA",
    website: "https://example.com",
    notifications: {
      email: true,
      push: true,
      trades: true,
      performance: true,
      news: false,
    },
    security: {
      twoFactor: false,
      sessionTimeout: "30m",
    },
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "This feature is not available in demo mode.",
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Button onClick={handleSaveProfile} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center">
            <div className="relative mb-4">
              <UserAvatar user={user} size="lg" />
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                onClick={() =>
                  toast({
                    title: "Upload Photo",
                    description: "This feature is not available in demo mode.",
                  })
                }
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-semibold">{profileData.name}</h2>
            <p className="text-sm text-muted-foreground">{profileData.email}</p>

            <Separator className="my-4" />

            <div className="w-full space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("general")}>
                <User className="mr-2 h-4 w-4" />
                General
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("notifications")}>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("security")}>
                <Shield className="mr-2 h-4 w-4" />
                Security
              </Button>
            </div>

            <Separator className="my-4" />

            <Button variant="destructive" className="w-full mt-auto" onClick={handleDeleteAccount}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          disabled={isDemoMode}
                        />
                        {isDemoMode && (
                          <p className="text-xs text-muted-foreground">Email cannot be changed in demo mode</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={profileData.website}
                          onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={profileData.notifications.email}
                        onCheckedChange={(checked) =>
                          setProfileData({
                            ...profileData,
                            notifications: { ...profileData.notifications, email: checked },
                          })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={profileData.notifications.push}
                        onCheckedChange={(checked) =>
                          setProfileData({
                            ...profileData,
                            notifications: { ...profileData.notifications, push: checked },
                          })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="trade-notifications">Trade Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get notified about your trades</p>
                      </div>
                      <Switch
                        id="trade-notifications"
                        checked={profileData.notifications.trades}
                        onCheckedChange={(checked) =>
                          setProfileData({
                            ...profileData,
                            notifications: { ...profileData.notifications, trades: checked },
                          })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="performance-notifications">Performance Reports</Label>
                        <p className="text-sm text-muted-foreground">Receive weekly performance reports</p>
                      </div>
                      <Switch
                        id="performance-notifications"
                        checked={profileData.notifications.performance}
                        onCheckedChange={(checked) =>
                          setProfileData({
                            ...profileData,
                            notifications: { ...profileData.notifications, performance: checked },
                          })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="news-notifications">News Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified about important market news</p>
                      </div>
                      <Switch
                        id="news-notifications"
                        checked={profileData.notifications.news}
                        onCheckedChange={(checked) =>
                          setProfileData({
                            ...profileData,
                            notifications: { ...profileData.notifications, news: checked },
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        id="two-factor"
                        checked={profileData.security.twoFactor}
                        onCheckedChange={(checked) =>
                          setProfileData({
                            ...profileData,
                            security: { ...profileData.security, twoFactor: checked },
                          })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" placeholder="••••••••" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input id="confirm-password" type="password" placeholder="••••••••" />
                      </div>
                    </div>
                    <Button className="mt-2" variant="outline">
                      <Key className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <h3 className="text-sm font-medium mb-2">Active Sessions</h3>
                  <div className="w-full p-3 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Current Session</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date().toLocaleDateString()} • {navigator.platform}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

