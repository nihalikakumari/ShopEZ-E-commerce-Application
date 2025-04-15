"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getCart, addToCart as apiAddToCart, updateCartItem, removeFromCart, clearCart } from "@/app/services/cart"
import type { Cart } from "@/app/services/cart"
import { useAuth } from "./AuthContext"
import { useToast } from "@/hooks/use-toast"

interface CartContextType {
  cart: Cart | null
  loading: boolean
  addToCart: (productId: string, quantity: number, size?: string, color?: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  emptyCart: () => Promise<void>
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchCart = async () => {
    if (!user) return

    try {
      setLoading(true)
      const cartData = await getCart()
      setCart(cartData)
    } catch (error) {
      console.error("Error fetching cart:", error)
      toast({
        title: "Error",
        description: "Could not fetch your cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setCart(null)
    }
  }, [user])

  const addToCart = async (productId: string, quantity: number, size?: string, color?: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your cart",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const updatedCart = await apiAddToCart(productId, quantity, size, color)
      setCart(updatedCart)
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      })
    } catch (error: any) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Could not add item to cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoading(true)
      const updatedCart = await updateCartItem(itemId, quantity)
      setCart(updatedCart)
    } catch (error: any) {
      console.error("Error updating cart:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Could not update cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      setLoading(true)
      const updatedCart = await removeFromCart(itemId)
      setCart(updatedCart)
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      })
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "Could not remove item from cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const emptyCart = async () => {
    try {
      setLoading(true)
      await clearCart()
      setCart(null)
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      })
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast({
        title: "Error",
        description: "Could not clear your cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculate total number of items in cart
  const itemCount = cart?.cartItems.reduce((count, item) => count + item.quantity, 0) || 0

  // Calculate subtotal
  const subtotal = cart?.cartItems.reduce((total, item) => total + item.price * item.quantity, 0) || 0

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        emptyCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
