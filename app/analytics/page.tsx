"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const DynamicAnalytics = dynamic(() => import('@/components/DynamicAnalytics'), { ssr: false })

export default function AnalyticsDashboard() {
  const { data: session } = useSession()
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  if (!session) {
    return <div>Please log in to view analytics.</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      <DynamicAnalytics userId={session.user.id} isSeller={session.user.role === 'SELLER'} />
      {session.user.role === 'SELLER' && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Product Heatmap</h2>
          <Select onValueChange={(value) => setSelectedProduct(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {/* Add product options here */}
            </SelectContent>
          </Select>
          {selectedProduct && <div>{/* Add SellerHeatmap component here */}</div>}
        </div>
      )}
    </div>
  )
}

