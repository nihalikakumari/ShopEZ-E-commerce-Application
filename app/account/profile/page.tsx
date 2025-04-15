"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getProfile, updateProfile } from "@/app/services/auth"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=account/profile")
      return
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfile()
        setProfileData({
          username: data.username || "",
          email: data.email || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          address: {
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            zipCode: data.address?.zipCode || "",
            country: data.address?.country || "",
          },
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, router])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    setError(null)

    try {
      await updateProfile({
        username: profileData.username,
        email: profileData.email,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        address: profileData.address,
      })
      setSuccess(true)
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setError(error.response?.data?.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    setError(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match")
      setSaving(false)
      return
    }

    try {
      await updateProfile({
        password: passwordData.newPassword,
      })
      setSuccess(true)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      console.error("Error updating password:", error)
      setError(error.response?.data?.message || "Failed to update password")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <Tabs defaultValue="profile" className="max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and address details</CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <Alert className="mb-4 bg-green-50 dark:bg-green-950">
                  <AlertDescription className="text-green-600 dark:text-green-400">
                    Profile updated successfully!
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Personal Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Address Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={profileData.address.street}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: { ...profileData.address, street: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={profileData.address.city}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: { ...profileData.address, city: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={profileData.address.state}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: { ...profileData.address, state: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip/Postal Code</Label>
                      <Input
                        id="zipCode"
                        value={profileData.address.zipCode}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: { ...profileData.address, zipCode: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={profileData.address.country}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: { ...profileData.address, country: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <Alert className="mb-4 bg-green-50 dark:bg-green-950">
                  <AlertDescription className="text-green-600 dark:text-green-400">
                    Password updated successfully!
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
