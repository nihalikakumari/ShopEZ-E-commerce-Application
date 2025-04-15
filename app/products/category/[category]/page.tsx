"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getProducts } from "@/app/services/products"
import type { Product } from "@/app/services/products"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function CategoryPage() {
  const { category } = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  const decodedCategory = decodeURIComponent(category as string)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const data = await getProducts("", page, decodedCategory)
        setProducts(data.products)
        setTotalPages(data.pages)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [decodedCategory, page])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo(0, 0)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.push("/products")} className="mr-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">{decodedCategory}</h1>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">No products found in this category</p>
          <Button onClick={() => router.push("/products")}>View All Products</Button>
        </div>
      ) : (
        <>
          <ProductGrid products={products} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <Button variant="outline" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              ))}

              <Button variant="outline" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
