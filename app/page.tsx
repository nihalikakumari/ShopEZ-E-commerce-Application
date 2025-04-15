import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { FeaturedProducts } from "@/components/featured-products"
import { CategoryShowcase } from "@/components/category-showcase"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"
import { ShoppingBag, Search, Menu } from "lucide-react"
import Link from "next/link"
import { CartIndicator } from "@/components/cart-indicator"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6" />
              <span className="font-bold text-xl">ShopEZ</span>
            </Link>
            <MainNav />
          </div>
          <div className="flex md:hidden">
            <Link href="/" className="mr-2 flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6" />
              <span className="font-bold">ShopEZ</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
              <CartIndicator />
              <UserNav />
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-rose-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Discover Your Perfect Style
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Explore our curated collection of premium fashion accessories. From elegant bracelets to stylish
                  handbags, find the perfect piece to express your unique style.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/products">Shop Now</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/products">View Collections</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] aspect-square relative overflow-hidden rounded-xl">
                <img
                  alt="Hero Image"
                  className="object-cover w-full h-full"
                  src="/placeholder.svg?height=600&width=600"
                />
              </div>
            </div>
          </div>
        </section>
        <FeaturedProducts />
        <CategoryShowcase />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
