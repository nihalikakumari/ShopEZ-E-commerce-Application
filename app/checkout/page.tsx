"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "@/app/context/CartContext"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { createOrder } from "@/app/services/orders"
import { ShoppingBag, CreditCard, Truck, Check } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const { cart, subtotal, emptyCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("creditCard")
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA",
    phone: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState("")

  const taxPrice = subtotal * 0.1
  const shippingPrice = subtotal > 50 ? 0 : 10
  const totalPrice = subtotal + taxPrice + shippingPrice

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveStep(2)
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveStep(3)
  }

  const handlePlaceOrder = async () => {
    if (!cart) return

    setIsProcessing(true)

    try {
      const orderData = {
        orderItems: cart.cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          product: typeof item.product === "string" ? item.product : item.product._id,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: {
          address: `${shippingAddress.address}`,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice,
        shippingPrice,
        totalPrice,
      }

      const order = await createOrder(orderData)
      setOrderId(order._id)
      await emptyCart()
      setOrderComplete(true)
    } catch (error) {
      console.error("Error creating order:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400" />
          <h1 className="text-2xl font-bold">Please sign in to checkout</h1>
          <p className="text-gray-500">You need to be logged in to complete your purchase</p>
          <Button asChild>
            <Link href="/login?redirect=checkout">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400" />
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-gray-500">Add some items to your cart before checking out</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p>Thank you for your purchase. Your order has been received and is being processed.</p>
              <p className="font-medium">Order ID: {orderId}</p>
              <p>A confirmation email has been sent to your email address.</p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button asChild className="w-full">
                <Link href="/account/orders">View Order</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div
                className={`rounded-full w-8 h-8 flex items-center justify-center ${activeStep >= 1 ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-500"}`}
              >
                1
              </div>
              <div className={`h-1 flex-1 mx-2 ${activeStep >= 2 ? "bg-primary" : "bg-gray-200"}`}></div>
              <div
                className={`rounded-full w-8 h-8 flex items-center justify-center ${activeStep >= 2 ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-500"}`}
              >
                2
              </div>
              <div className={`h-1 flex-1 mx-2 ${activeStep >= 3 ? "bg-primary" : "bg-gray-200"}`}></div>
              <div
                className={`rounded-full w-8 h-8 flex items-center justify-center ${activeStep >= 3 ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-500"}`}
              >
                3
              </div>
            </div>
          </div>

          {activeStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={shippingAddress.firstName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={shippingAddress.lastName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">Continue to Payment</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="creditCard" id="creditCard" />
                      <Label htmlFor="creditCard" className="flex-1 cursor-pointer">
                        Credit Card
                      </Label>
                      <div className="flex space-x-1">
                        <img src="/placeholder.svg?height=30&width=40&text=Visa" alt="Visa" className="h-6" />
                        <img src="/placeholder.svg?height=30&width=40&text=MC" alt="Mastercard" className="h-6" />
                        <img
                          src="/placeholder.svg?height=30&width=40&text=Amex"
                          alt="American Express"
                          className="h-6"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                        PayPal
                      </Label>
                      <img src="/placeholder.svg?height=30&width=60&text=PayPal" alt="PayPal" className="h-6" />
                    </div>
                  </RadioGroup>

                  {paymentMethod === "creditCard" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input id="expiryDate" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input id="nameOnCard" />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveStep(1)}>
                      Back
                    </Button>
                    <Button type="submit">Review Order</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <p>
                    {shippingAddress.firstName} {shippingAddress.lastName}
                    <br />
                    {shippingAddress.address}
                    <br />
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                    <br />
                    {shippingAddress.country}
                    <br />
                    {shippingAddress.phone}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <p>{paymentMethod === "creditCard" ? "Credit Card" : "PayPal"}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Order Items</h3>
                  <div className="space-y-4">
                    {cart.cartItems.map((item) => (
                      <div key={item._id} className="flex items-center">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && " | "}
                            {item.color && `Color: ${item.color}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${item.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveStep(2)}>
                  Back
                </Button>
                <Button onClick={handlePlaceOrder} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>
              </CardFooter>
            </Card>
          )}
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
                <span>${shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-gray-500" />
              <span className="text-sm">Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-gray-500" />
              <span className="text-sm">Secure payment processing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
