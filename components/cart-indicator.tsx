"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/app/context/CartContext"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export function CartIndicator() {
  const { itemCount } = useCart()
  const router = useRouter()

  return (
    <Button variant="ghost" size="icon" onClick={() => router.push("/cart")} className="relative">
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
          {itemCount}
        </Badge>
      )}
      <span className="sr-only">Cart</span>
    </Button>
  )
}
