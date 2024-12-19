import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Camera, ChevronDown, Menu, Search, ShoppingCart, User } from 'lucide-react'
import { Button, Input, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-red-600">
              AliExpress Clone
            </Link>
            <form onSubmit={handleSearch} className="relative flex w-full max-w-[600px] items-center">
              <Input
                type="search"
                placeholder="Search products"
                className="pr-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 text-muted-foreground"
                type="button"
              >
                <Camera className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="destructive" className="ml-2" type="submit">
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="flex items-center space-x-1">
              <span>EN</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="flex items-center space-x-1">
              <span>USD</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-1">
                    <User className="h-5 w-5" />
                    <span>{user.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => router.push('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => router.push('/orders')}>
                    Orders
                  </DropdownMenuItem>
                  {user.role === 'SELLER' && (
                    <DropdownMenuItem onSelect={() => router.push('/seller/dashboard')}>
                      Seller Dashboard
                    </DropdownMenuItem>
                  )}
                  {user.role === 'ADMIN' && (
                    <DropdownMenuItem onSelect={() => router.push('/admin/dashboard')}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onSelect={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" onClick={() => router.push('/login')}>Sign in / Register</Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => router.push('/cart')}>
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <nav className="mt-4">
          <div className="flex items-center space-x-6">
            <Button variant="ghost" className="flex items-center space-x-2">
              <Menu className="h-5 w-5" />
              <span>All Categories</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Link href="/super-deals" className="text-sm hover:text-red-600">
              SuperDeals
            </Link>
            <Link href="/featured" className="text-sm hover:text-red-600">
              Featured
            </Link>
            <Link href="/business" className="text-sm hover:text-red-600">
              Business
            </Link>
            <Link href="/clothing" className="text-sm hover:text-red-600">
              Clothing
            </Link>
            <Link href="/accessories" className="text-sm hover:text-red-600">
              Accessories
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

