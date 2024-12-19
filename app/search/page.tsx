"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ProductSearch } from "@/components/product-search"
import { ProductGrid } from "@/components/product-grid"
import { searchProducts } from "@/lib/api"
import SearchContent from '@/components/SearchContent'

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}

