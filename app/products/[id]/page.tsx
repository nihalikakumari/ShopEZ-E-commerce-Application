"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getProductById } from "@/app/services/products"
import type { Product } from "@/app/services/products"
import { useCart } from "@/app/context/CartContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingCart, Star, Truck, RefreshCw, Shield } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ProductGrid } from "@/components/product-grid"
import { getFeaturedProducts } from "@/app/services/products"

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const { addToCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const data = await getProductById(id as string)
        setProduct(data)

        // Set default selections if available
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0])
        }
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0])
        }

        // Fetch related products (using featured as a placeholder)
        const related = await getFeaturedProducts()
        setRelatedProducts(related.filter((p) => p._id !== id).slice(0, 4))

        setLoading(false)
      } catch (error) {
        console.error("Error fetching product:", error)
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product._id, quantity, selectedSize, selectedColor)
    }
  }

  const handleBuyNow = async () => {
    if (product) {
      await addToCart(product._id, quantity, selectedSize, selectedColor)
      router.push("/cart")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading product details...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => router.push("/products")}>Back to Products</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.image || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[product.image, ...(product.images || [])].slice(0, 4).map((img, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-md bg-gray-100">
                <img
                  src={img || `/placeholder.svg?height=150&width=150&text=Image${index + 1}`}
                  alt={`${product.name} - View ${index + 1}`}
                  className="h-full w-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline">{product.category}</Badge>
              {product.isNew && <Badge className="bg-teal-500 hover:bg-teal-600">New</Badge>}
              {product.isSale && <Badge className="bg-rose-500 hover:bg-rose-600">Sale</Badge>}
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2 space-x-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {product.originalPrice ? (
              <>
                <span className="text-3xl font-bold text-rose-600">${product.price.toFixed(2)}</span>
                <span className="text-xl line-through text-gray-500">${product.originalPrice.toFixed(2)}</span>
                <Badge className="bg-rose-500">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              </>
            ) : (
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="font-medium">Size</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="font-medium">Color</label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label className="font-medium">Quantity</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                  disabled={quantity >= product.countInStock}
                >
                  +
                </Button>
                <span className="text-sm text-gray-500 ml-2">{product.countInStock} available</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button variant="secondary" className="flex-1" onClick={handleBuyNow}>
              Buy Now
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-gray-500" />
              <span className="text-sm">Free shipping over $50</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 text-gray-500" />
              <span className="text-sm">30-day returns</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-gray-500" />
              <span className="text-sm">Secure checkout</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="mt-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.numReviews})</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="p-4">
          <p className="text-gray-700">{product.description}</p>
        </TabsContent>
        <TabsContent value="details" className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Product Details</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="font-medium">Category:</span> {product.category}
                </li>
                {product.sizes && product.sizes.length > 0 && (
                  <li>
                    <span className="font-medium">Available Sizes:</span> {product.sizes.join(", ")}
                  </li>
                )}
                {product.colors && product.colors.length > 0 && (
                  <li>
                    <span className="font-medium">Available Colors:</span> {product.colors.join(", ")}
                  </li>
                )}
                <li>
                  <span className="font-medium">In Stock:</span> {product.countInStock} units
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Shipping Information</h3>
              <ul className="space-y-2 text-sm">
                <li>Free standard shipping on orders over $50</li>
                <li>Standard delivery: 3-5 business days</li>
                <li>Express delivery: 1-2 business days</li>
                <li>International shipping available</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="p-4">
          {product.numReviews > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="text-4xl font-bold">{product.rating.toFixed(1)}</div>
                <div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">Based on {product.numReviews} reviews</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Sample reviews - in a real app, these would come from the API */}
                <Card className="p-4">
                  <div className="flex justify-between mb-2">
                    <div className="font-medium">Sarah Johnson</div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Absolutely love this product! The quality is exceptional and it looks even better in person.
                    Shipping was fast and the packaging was secure.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Posted 2 weeks ago</p>
                </Card>

                <Card className="p-4">
                  <div className="flex justify-between mb-2">
                    <div className="font-medium">Michael Brown</div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Great product for the price. The material is high quality and the design is elegant. Would
                    definitely recommend to others.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Posted 1 month ago</p>
                </Card>
              </div>

              <Button>Write a Review</Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="mb-4">No reviews yet. Be the first to review this product!</p>
              <Button>Write a Review</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  )
}
