import api from "./api"
import type { CartItem } from "./cart"

export interface ShippingAddress {
  address: string
  city: string
  postalCode: string
  country: string
}

export interface PaymentResult {
  id: string
  status: string
  update_time: string
  email_address: string
}

export interface Order {
  _id: string
  user: string
  orderItems: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  paymentResult?: PaymentResult
  itemsPrice: number
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  isPaid: boolean
  paidAt?: Date
  isDelivered: boolean
  deliveredAt?: Date
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
  createdAt: Date
  updatedAt: Date
}

export interface OrderCreateData {
  orderItems: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  itemsPrice: number
  taxPrice: number
  shippingPrice: number
  totalPrice: number
}

export const createOrder = async (orderData: OrderCreateData): Promise<Order> => {
  const response = await api.post("/orders", orderData)
  return response.data
}

export const getOrderById = async (id: string): Promise<Order> => {
  const response = await api.get(`/orders/${id}`)
  return response.data
}

export const updateOrderToPaid = async (id: string, paymentResult: PaymentResult): Promise<Order> => {
  const response = await api.put(`/orders/${id}/pay`, paymentResult)
  return response.data
}

export const getMyOrders = async (): Promise<Order[]> => {
  const response = await api.get("/orders/myorders")
  return response.data
}
