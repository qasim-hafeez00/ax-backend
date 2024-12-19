"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { SellerHeatmap } from '@/components/seller-heatmap'
import { RealTimeDashboard } from '@/components/real-time-dashboard'
import { useAnalytics } from '@/hooks/use-analytics'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function DynamicAnalytics() {
  const { data: session } = useSession()
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const { trackCustomEvent } = useAnalytics()

  // Assuming the user's role and products are stored in the session
  const isSeller = session?.user?.role === 'SELLER'
  const products = session?.user?.products || []

  const handleProductChange = (productId: string) => {
    setSelectedProduct(productId)
    trackCustomEvent('product_selected', { productId })
  }

  if (!session) {
    return <div>Please log in to view analytics.</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      
      <RealTimeDashboard userId={session.user.id} isSeller={isSeller} />

      {isSeller && products.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Product Heatmap</h2>
          <Select onValueChange={handleProductChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedProduct && <SellerHeatmap productId={selectedProduct} />}
        </div>
      )}
    </div>
  )
}

