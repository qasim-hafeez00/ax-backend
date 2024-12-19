'use client'

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCart, useUpdateCartItem, useRemoveFromCart } from "@/lib/api"

export default function CartPage() {
  const { data: cart, isLoading, error } = useCart()
  const updateCartItemMutation = useUpdateCartItem()
  const removeFromCartMutation = useRemoveFromCart()
  const router = useRouter()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading cart</div>

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    await updateCartItemMutation.mutateAsync({ id, quantity })
  }

  const handleRemoveItem = async (id: string) => {
    await removeFromCartMutation.mutateAsync(id)
  }

  const calculateTotal = () => {
    return cart?.reduce((total, item) => total + item.price * item.quantity, 0) || 0
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>
      {!cart || cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="mb-4 flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.title}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div>
                  <h2 className="font-semibold">{item.product.title}</h2>
                  <p className="text-sm text-gray-600">
                    US ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity === 1}
                >
                  -
                </Button>
                <span>{item.quantity}</span>
                <Button
                  variant="outline"
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </Button>
                <Button variant="ghost" onClick={() => handleRemoveItem(item.id)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xl font-semibold">
              Total: US ${calculateTotal().toFixed(2)}
            </p>
            <Button onClick={() => router.push("/checkout")}>
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

