"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ProductSearch } from "@/components/product-search"
import { ProductGrid } from "@/components/product-grid"
import { searchProducts } from "@/lib/api"

export default function SearchContent() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await searchProducts(
          searchParams.get("q") || "",
          {
            category: searchParams.get("category"),
            minPrice: Number(searchParams.get("minPrice")),
            maxPrice: Number(searchParams.get("maxPrice")),
          },
          searchParams.get("sort") as any,
          1,
          20
        )
        setProducts(response.data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [searchParams])

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-6 text-3xl font-bold">Search Results</h1>
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div>
          <ProductSearch />
        </div>
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

