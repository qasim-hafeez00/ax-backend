import { Card } from "@/components/ui"
import Link from "next/link"
import { useProducts } from "@/lib/api"

export function ProductGrid() {
  const { data: products, isLoading, error } = useProducts()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading products</div>

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.id}`}>
          <Card className="h-full overflow-hidden hover:shadow-lg">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="line-clamp-2 text-sm">{product.title}</h3>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-lg font-bold text-red-600">
                  US ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  US ${product.originalPrice.toFixed(2)}
                </span>
              </div>
              <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-1 text-xs text-red-600">
                -{product.discount}%
              </span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}

