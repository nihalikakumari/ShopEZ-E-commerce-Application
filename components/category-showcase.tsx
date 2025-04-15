import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CategoryShowcase() {
  const categories = [
    {
      name: "Bracelets",
      description: "Elegant designs for every occasion",
      image: "/placeholder.svg?height=400&width=300",
      link: "/products/category/Bracelets",
    },
    {
      name: "Handbags",
      description: "Stylish and functional accessories",
      image: "/placeholder.svg?height=400&width=300",
      link: "/products/category/Handbags",
    },
    {
      name: "Jewelry",
      description: "Timeless pieces that make a statement",
      image: "/placeholder.svg?height=400&width=300",
      link: "/products/category/Jewelry",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Shop by Category</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Explore our collections and find your perfect style
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {categories.map((category) => (
            <div key={category.name} className="relative overflow-hidden rounded-lg group">
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold">{category.name}</h3>
                <p className="mt-2 text-white/90">{category.description}</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent border-white text-white hover:bg-white hover:text-black transition-colors w-fit"
                  asChild
                >
                  <Link href={category.link}>Explore</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
