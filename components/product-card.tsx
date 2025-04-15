"use client"

import type React from "react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import type { Product } from "@/app/services/products"
import { useCart } from "@/app/context/CartContext"
import Link from "next/link"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await addToCart(product._id, 1)
  }

  return (
    <Card className="overflow-hidden group h-full flex flex-col">
      <div className="relative">
        <Link href={`/products/${product._id}`}>
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 dark:bg-gray-900/80 dark:hover:bg-gray-900/90"
        >
          <Heart className="h-5 w-5" />
          <span className="sr-only">Add to wishlist</span>
        </Button>
        <div className="absolute top-2 left-2 flex gap-1">
          {product.isNew && <Badge className="bg-teal-500 hover:bg-teal-600">New</Badge>}
          {product.isSale && <Badge className="bg-rose-500 hover:bg-rose-600">Sale</Badge>}
        </div>
      </div>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product._id}`} className="block h-full">
          <div className="text-sm text-gray-500 dark:text-gray-400">{product.category}</div>
          <h3 className="font-semibold text-lg mt-1 line-clamp-2">{product.name}</h3>
          <div className="flex items-center mt-1">
            {product.originalPrice ? (
              <>
                <span className="font-bold text-rose-600 dark:text-rose-400">${product.price.toFixed(2)}</span>
                <span className="ml-2 text-sm line-through text-gray-500">${product.originalPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
