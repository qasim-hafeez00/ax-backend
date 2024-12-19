"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getProfile, updateProfile } from "@/lib/api"

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  })
  const [message, setMessage] = useState({ type: "", content: "" })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile()
        setProfile(response.data)
      } catch (error) {
        console.error("Failed to fetch profile:", error)
        setMessage({ type: "error", content: "Failed to load profile" })
      }
    }
    fetchProfile()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile(profile)
      setMessage({ type: "success", content: "Profile updated successfully" })
    } catch (error) {
      console.error("Failed to update profile:", error)
      setMessage({ type: "error", content: "Failed to update profile" })
    }
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <h1 className="mb-6 text-2xl font-bold">Your Profile</h1>
      {message.content && (
        <p className={`mb-4 ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>
          {message.content}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={profile.email}
          onChange={handleInputChange}
          disabled
        />
        <Input
          name="firstName"
          placeholder="First Name"
          value={profile.firstName}
          onChange={handleInputChange}
        />
        <Input
          name="lastName"
          placeholder="Last Name"
          value={profile.lastName}
          onChange={handleInputChange}
        />
        <Input
          name="phoneNumber"
          placeholder="Phone Number"
          value={profile.phoneNumber}
          onChange={handleInputChange}
        />
        <Input
          name="address"
          placeholder="Address"
          value={profile.address}
          onChange={handleInputChange}
        />
        <Button type="submit" className="w-full">
          Update Profile
        </Button>
      </form>
    </div>
  )
}

