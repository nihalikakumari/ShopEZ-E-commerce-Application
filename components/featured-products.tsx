import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"

export function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "Crystal Charm Bracelet",
      price: 89.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Bracelets",
      isNew: true,
      isSale: false,
    },
    {
      id: 2,
      name: "Leather Crossbody Bag",
      price: 129.99,
      originalPrice: 159.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Handbags",
      isNew: false,
      isSale: true,
    },
    {
      id: 3,
      name: "Pearl Drop Earrings",
      price: 69.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Jewelry",
      isNew: true,
      isSale: false,
    },
    {
      id: 4,
      name: "Gold Chain Necklace",
      price: 99.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Jewelry",
      isNew: false,
      isSale: false,
    },
  ]

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Products</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Discover our most popular items and latest arrivals
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden group">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
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
              <CardContent className="p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">{product.category}</div>
                <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
                <div className="flex items-center mt-1">
                  {product.originalPrice ? (
                    <>
                      <span className="font-bold text-rose-600 dark:text-rose-400">${product.price.toFixed(2)}</span>
                      <span className="ml-2 text-sm line-through text-gray-500">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="font-bold">${product.price.toFixed(2)}</span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}

