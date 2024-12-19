"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getOrders } from "@/lib/api"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders()
        setOrders(response.data)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      }
    }
    fetchOrders()
  }, [])

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-6 text-3xl font-bold">Your Orders</h1>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border p-4 shadow-sm">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="mt-2 text-gray-600">Status: {order.status}</p>
              <ul className="mt-4 space-y-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.product.title} x {item.quantity}</span>
                    <span>US ${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t pt-4">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold">
                  US $
                  {order.items
                    .reduce((total, item) => total + item.price * item.quantity, 0)
                    .toFixed(2)}
                </span>
              </div>
              <Link href={`/orders/${order.id}`} className="mt-4 inline-block text-blue-600 hover:underline">
                View Order Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

