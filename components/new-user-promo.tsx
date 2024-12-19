import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

export function NewUserPromo() {
  const deals = [
    {
      id: 1,
      title: "Anti-theft Backpack",
      image: "/placeholder.svg?height=200&width=200",
      price: 0.99,
      originalPrice: 5.99,
      discount: 83,
    },
    {
      id: 2,
      title: "LED Light Strip",
      image: "/placeholder.svg?height=200&width=200",
      price: 2.08,
      originalPrice: 11.63,
      discount: 82,
    },
    {
      id: 3,
      title: "Phone Holder",
      image: "/placeholder.svg?height=200&width=200",
      price: 3.10,
      originalPrice: 11.09,
      discount: 72,
    },
    {
      id: 4,
      title: "Gel Pen Set",
      image: "/placeholder.svg?height=200&width=200",
      price: 1.72,
      originalPrice: 7.16,
      discount: 75,
    },
  ]

  return (
    <div className="rounded-lg bg-red-600 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-white">
          <h2 className="text-2xl font-bold">New shopper exclusive</h2>
          <p className="text-lg">First order only</p>
        </div>
        <Button
          variant="secondary"
          className="flex items-center space-x-2 bg-white hover:bg-gray-100"
        >
          <span>Welcome deal</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {deals.map((deal) => (
          <Card
            key={deal.id}
            className="overflow-hidden bg-white hover:shadow-lg"
          >
            <img
              src={deal.image}
              alt={deal.title}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="line-clamp-2 text-sm">{deal.title}</h3>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-lg font-bold text-red-600">
                  US ${deal.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  US ${deal.originalPrice.toFixed(2)}
                </span>
              </div>
              <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-1 text-xs text-red-600">
                -{deal.discount}%
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

