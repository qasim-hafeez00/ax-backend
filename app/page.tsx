import { HeroSection } from "@/components/hero-section"
import { CouponSection } from "@/components/coupon-section"
import { ProductGridServer } from "@/components/product-grid-server"
import { NewUserPromo } from "@/components/new-user-promo"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          <CouponSection />
          <ProductGridServer />
          <NewUserPromo />
        </div>
      </div>
    </div>
  )
}

