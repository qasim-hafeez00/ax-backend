"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Share2 } from 'lucide-react'
import { shareWishlist } from "@/lib/api"

export function WishlistShare({ wishlistId }) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await shareWishlist(wishlistId, email)
      setMessage("Wishlist shared successfully!")
      setEmail("")
    } catch (error) {
      console.error("Failed to share wishlist:", error)
      setMessage("Failed to share wishlist. Please try again.")
    }
  }

  return (
    <form onSubmit={handleShare} className="space-y-4">
      <Input
        type="email"
        placeholder="Enter email to share with"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit">
        <Share2 className="mr-2 h-4 w-4" />
        Share Wishlist
      </Button>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </form>
  )
}

