"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getProductById } from "@/lib/api"

export function ProductComparison({ productIds }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const productPromises = productIds.map((id) => getProductById(id))
        const productResponses = await Promise.all(productPromises)
        setProducts(productResponses.map((response) => response.data))
      } catch (error) {
        console.error("Failed to fetch products for comparison:", error)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [productIds])

  if (loading) return <div>Loading...</div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Feature</th>
            {products.map((product) => (
              <th key={product.id} className="border p-2">
                {product.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Price</td>
            {products.map((product) => (
              <td key={product.id} className="border p-2">
                ${product.price.toFixed(2)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="border p-2">Rating</td>
            {products.map((product) => (
              <td key={product.id} className="border p-2">
                {product.rating.toFixed(1)} / 5
              </td>
            ))}
          </tr>
          <tr>
            <td className="border p-2">Description</td>
            {products.map((product) => (
              <td key={product.id} className="border p-2">
                {product.description}
              </td>
            ))}
          </tr>
          {/* Add more rows for other features */}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end space-x-2">
        {products.map((product) => (
          <Button
            key={product.id}
            onClick={() => router.push(`/product/${product.id}`)}
          >
            View {product.title}
          </Button>
        ))}
      </div>
    </div>
  )
}

