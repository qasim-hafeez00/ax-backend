"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCart, createOrder } from "@/lib/api"

export default function CheckoutPage() {
  const [cart, setCart] = useState([])
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  })
  const router = useRouter()

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCart()
        setCart(response.data)
      } catch (error) {
        console.error("Failed to fetch cart:", error)
      }
    }
    fetchCart()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShippingAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createOrder(cart, shippingAddress)
      router.push("/order-confirmation")
    } catch (error) {
      console.error("Failed to create order:", error)
    }
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="fullName"
              placeholder="Full Name"
              value={shippingAddress.fullName}
              onChange={handleInputChange}
              required
            />
            <Input
              name="address"
              placeholder="Address"
              value={shippingAddress.address}
              onChange={handleInputChange}
              required
            />
            <Input
              name="city"
              placeholder="City"
              value={shippingAddress.city}
              onChange={handleInputChange}
              required
            />
            <Input
              name="country"
              placeholder="Country"
              value={shippingAddress.country}
              onChange={handleInputChange}
              required
            />
            <Input
              name="postalCode"
              placeholder="Postal Code"
              value={shippingAddress.postalCode}
              onChange={handleInputChange}
              required
            />
            <Button type="submit" className="w-full">
              Place Order
            </Button>
          </form>
        </div>
        <div>
          <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="mb-2 flex justify-between">
              <span>
                {item.product.title} x {item.quantity}
              </span>
              <span>US ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>US ${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

