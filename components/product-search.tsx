"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("")
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(1000)
  const [sort, setSort] = useState("relevance")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const queryParams = new URLSearchParams({
      q: searchQuery,
      category,
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
      sort,
    })
    router.push(`/search?${queryParams.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="search"
          placeholder="Search products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit">Search</Button>
      </div>
      <Select
        value={category}
        onValueChange={setCategory}
        placeholder="Select category"
      >
        <Select.Option value="electronics">Electronics</Select.Option>
        <Select.Option value="clothing">Clothing</Select.Option>
        <Select.Option value="home">Home & Garden</Select.Option>
        <Select.Option value="toys">Toys & Games</Select.Option>
      </Select>
      <div>
        <label className="block text-sm font-medium text-gray-700">Price Range</label>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-24"
          />
          <span>to</span>
          <Input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-24"
          />
        </div>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={[minPrice, maxPrice]}
          onValueChange={([min, max]) => {
            setMinPrice(min)
            setMaxPrice(max)
          }}
          className="mt-2"
        />
      </div>
      <Select
        value={sort}
        onValueChange={setSort}
        placeholder="Sort by"
      >
        <Select.Option value="relevance">Relevance</Select.Option>
        <Select.Option value="price_asc">Price: Low to High</Select.Option>
        <Select.Option value="price_desc">Price: High to Low</Select.Option>
        <Select.Option value="rating">Customer Rating</Select.Option>
      </Select>
    </form>
  )
}

