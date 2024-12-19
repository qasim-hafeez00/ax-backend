"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useProduct, useAddToCart, useAddToWishlist } from "@/lib/api"
import { Star, Heart } from 'lucide-react'

export default function ProductPage() {
  const { id } = useParams()
  const { data: product, isLoading, error } = useProduct(id as string)
  const addToCartMutation = useAddToCart()
  const addToWishlistMutation = useAddToWishlist()
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState({ type: "", content: "" })
  const router = useRouter()

  const handleAddToCart = async () => {
    try {
      await addToCartMutation.mutateAsync({ productId: id as string, quantity })
      setMessage({ type: "success", content: "Added to cart successfully" })
    } catch (error) {
      console.error("Failed to add to cart:", error)
      setMessage({ type: "error", content: "Failed to add to cart" })
    }
  }

  const handleAddToWishlist = async () => {
    try {
      await addToWishlistMutation.mutateAsync(id as string)
      setMessage({ type: "success", content: "Added to wishlist successfully" })
    } catch (error) {
      console.error("Failed to add to wishlist:", error)
      setMessage({ type: "error", content: "Failed to add to wishlist" })
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading product</div>
  if (!product) return <div>Product not found</div>

  return (
    <div className="container mx-auto py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-full rounded-lg object-cover"
          />
        </div>
        <div>
          <h1 className="mb-4 text-3xl font-bold">{product.title}</h1>
          <p className="mb-4 text-xl font-semibold text-red-600">
            US ${product.price.toFixed(2)}
          </p>
          <div className="mb-4 flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({product.numReviews} reviews)
            </span>
          </div>
          <p className="mb-6">{product.description}</p>
          <div className="mb-6 flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <span>{quantity}</span>
            <Button
              variant="outline"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
          <div className="flex space-x-4">
            <Button onClick={handleAddToCart} className="flex-grow">
              Add to Cart
            </Button>
            <Button variant="outline" onClick={handleAddToWishlist}>
              <Heart className="h-5 w-5" />
            </Button>
          </div>
          {message.content && (
            <p className={`mt-4 ${
              message.type === "error" ? "text-red-500" : "text-green-500"
            }`}
            >
              {message.content}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

