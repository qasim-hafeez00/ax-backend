"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      router.push("/")
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/" })
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <h1 className="mb-6 text-2xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
      <div className="mt-6">
        <p className="text-center">Or login with:</p>
        <div className="mt-2 flex justify-center space-x-4">
          <Button onClick={() => handleSocialLogin("google")} variant="outline">
            <FaGoogle className="mr-2" />
            Google
          </Button>
          <Button onClick={() => handleSocialLogin("facebook")} variant="outline">
            <FaFacebook className="mr-2" />
            Facebook
          </Button>
          <Button onClick={() => handleSocialLogin("apple")} variant="outline">
            <FaApple className="mr-2" />
            Apple
          </Button>
        </div>
      </div>
    </div>
  )
}

