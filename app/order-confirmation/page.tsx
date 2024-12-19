"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function OrderConfirmationPage() {
  const [orderId, setOrderId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // In a real application, you'd get the order ID from the API response
    // or from a state management solution like Redux
    setOrderId("123456")
  }, [])

  return (
    <div className="container mx-auto py-12 text-center">
      <h1 className="mb-6 text-3xl font-bold">Order Confirmation</h1>
      <p className="mb-4 text-xl">
        Thank you for your order! Your order number is: {orderId}
      </p>
      <p className="mb-8">
        We've sent a confirmation email with order details to your email address.
      </p>
      <Button onClick={() => router.push("/")}>Continue Shopping</Button>
    </div>
  )
}

