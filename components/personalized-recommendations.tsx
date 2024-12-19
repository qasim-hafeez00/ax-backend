"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { ProductGrid } from "@/components/product-grid"
import { getPersonalizedRecommendations } from "@/lib/api"

export function PersonalizedRecommendations() {
  const [recommendations, setRecommendations] = useState([])
  const { data: session } = useSession()

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (session?.user?.id) {
        try {
          const response = await getPersonalizedRecommendations(session.user.id)
          setRecommendations(response.data)
        } catch (error) {
          console.error("Failed to fetch recommendations:", error)
        }
      }
    }
    fetchRecommendations()
  }, [session])

  if (!session || recommendations.length === 0) return null

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Recommended for You</h2>
      <ProductGrid products={recommendations} />
    </div>
  )
}

