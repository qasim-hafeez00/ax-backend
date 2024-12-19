import { Card } from "@/components/ui/card"

export function CouponSection() {
  const coupons = [
    { amount: 100, minSpend: 759, code: "759GS1" },
    { amount: 50, minSpend: 369, code: "369GS5" },
    { amount: 30, minSpend: 239, code: "239GS3" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {coupons.map((coupon) => (
        <Card
          key={coupon.code}
          className="flex items-center justify-between p-4 hover:shadow-lg"
        >
          <div>
            <p className="text-2xl font-bold text-red-600">
              US ${coupon.amount} OFF
            </p>
            <p className="text-sm text-gray-600">
              orders US ${coupon.minSpend}+
            </p>
          </div>
          <div className="rounded-md border border-dashed border-red-600 px-3 py-1">
            <p className="font-mono text-sm">{coupon.code}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}

