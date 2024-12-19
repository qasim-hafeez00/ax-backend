import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function HeroSection() {
  return (
    <div className="bg-green-600 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <p className="text-sm">Sale Ends: Dec 16, 07:59 (GMT0)</p>
            <h1 className="mt-2 text-6xl font-bold">GIFT SEASON</h1>
            <p className="mt-4 text-3xl font-semibold">
              UP TO <span className="text-yellow-300">60%</span> OFF
            </p>
            <Button className="mt-6 bg-white text-green-600 hover:bg-gray-100">
              Shop Now
            </Button>
          </div>
          <div className="relative">
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="Gift box"
              className="h-[300px] w-[300px] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

