"use client"

import { useCart } from "@/app/context/CartContext"
import { useAuth } from "@/app/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem, emptyCart, subtotal } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [processingCheckout, setProcessingCheckout] = useState(false)

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId)
  }

  const handleCheckout = () => {
    setProcessingCheckout(true)
    // In a real app, you would redirect to checkout page
    setTimeout(() => {
      router.push("/checkout")
      setProcessingCheckout(false)
    }, 1000)
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400" />
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-gray-500">Please sign in to view your cart</p>
          <Button onClick={() => router.push("/login")}>Sign In</Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <p className="text-center py-8">Loading your cart...</p>
      </div>
    )
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400" />
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-gray-500">Looks like you haven't added anything to your cart yet</p>
          <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items ({cart.cartItems.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.cartItems.map((item) => (
                <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
                  <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && " | "}
                      {item.color && `Color: ${item.color}`}
                    </p>
                    <p className="font-bold mt-1">${item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-3">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto text-gray-500 hover:text-red-500"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/products")}>
                Continue Shopping
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(subtotal * 0.1).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${(subtotal + subtotal * 0.1).toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full" onClick={handleCheckout} disabled={processingCheckout}>
                {processingCheckout ? "Processing..." : "Proceed to Checkout"}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => emptyCart()}>
                Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
