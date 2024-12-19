"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SellerProductList } from "@/components/seller/seller-product-list"
import { SellerOrderList } from "@/components/seller/seller-order-list"
import { SellerAnalytics } from "@/components/seller/seller-analytics"
import { getSellerProducts, getSellerOrders, getSellerAnalytics } from "@/lib/api"

export default function SellerDashboardPage() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, ordersResponse, analyticsResponse] = await Promise.all([
          getSellerProducts(),
          getSellerOrders(),
          getSellerAnalytics(new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0])
        ])
        setProducts(productsResponse.data)
        setOrders(ordersResponse.data)
        setAnalytics(analyticsResponse.data)
      } catch (error) {
        console.error("Failed to fetch seller data:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-6 text-3xl font-bold">Seller Dashboard</h1>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{products.length}</p>
                <Button className="mt-4" onClick={() => document.querySelector('[data-value="products"]')?.click()}>Manage Products</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{orders.length}</p>
                <Button className="mt-4" onClick={() => document.querySelector('[data-value="orders"]')?.click()}>View Orders</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics && (
                  <p className="text-2xl font-bold">US ${analytics.totalRevenue.toFixed(2)}</p>
                )}
                <Button className="mt-4" onClick={() => document.querySelector('[data-value="analytics"]')?.click()}>View Analytics</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="products">
          <SellerProductList products={products} />
        </TabsContent>
        <TabsContent value="orders">
          <SellerOrderList orders={orders} />
        </TabsContent>
        <TabsContent value="analytics">
          <SellerAnalytics analytics={analytics} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

