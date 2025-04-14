import api from "./api"
import type { Product } from "./products"

export interface CartItem {
  _id: string
  product: string | Product
  name: string
  image: string
  price: number
  quantity: number
  size?: string
  color?: string
}

export interface Cart {
  _id: string
  user: string
  cartItems: CartItem[]
}

export const getCart = async (): Promise<Cart> => {
  const response = await api.get("/cart")
  return response.data
}

export const addToCart = async (productId: string, quantity: number, size?: string, color?: string): Promise<Cart> => {
  const response = await api.post("/cart", { productId, quantity, size, color })
  return response.data
}

export const updateCartItem = async (itemId: string, quantity: number): Promise<Cart> => {
  const response = await api.put(`/cart/${itemId}`, { quantity })
  return response.data
}

export const removeFromCart = async (itemId: string): Promise<Cart> => {
  const response = await api.delete(`/cart/${itemId}`)
  return response.data
}

export const clearCart = async (): Promise<{ message: string }> => {
  const response = await api.delete("/cart")
  return response.data
}
