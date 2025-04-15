"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getProducts } from "@/app/services/products"
import type { Product } from "@/app/services/products"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, Filter, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [showFilters, setShowFilters] = useState(false)
  const [showNewOnly, setShowNewOnly] = useState(false)
  const [showSaleOnly, setShowSaleOnly] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize filters from URL params
    const keyword = searchParams.get("keyword") || ""
    const categoryParam = searchParams.get("category") || ""
    const pageParam = Number.parseInt(searchParams.get("page") || "1")
    const newParam = searchParams.get("new") === "true"
    const saleParam = searchParams.get("sale") === "true"

    setSearchTerm(keyword)
    setCategory(categoryParam)
    setPage(pageParam)
    setShowNewOnly(newParam)
    setShowSaleOnly(saleParam)

    fetchProducts(keyword, pageParam, categoryParam, "", newParam, saleParam)
  }, [searchParams])

  const fetchProducts = async (
    keyword = searchTerm,
    pageNumber = page,
    categoryFilter = category,
    priceFilter = `${priceRange[0]}-${priceRange[1]}`,
    isNew = showNewOnly,
    isSale = showSaleOnly,
  ) => {
    setLoading(true)
    try {
      const data = await getProducts(
        keyword,
        pageNumber,
        categoryFilter,
        priceFilter,
        "",
        isNew ? "true" : "",
        isSale ? "true" : "",
      )
      setProducts(data.products)
      setTotalPages(data.pages)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error)
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    updateUrlAndFetch()
  }

  const handleFilterChange = () => {
    setPage(1)
    updateUrlAndFetch()
  }

  const updateUrlAndFetch = () => {
    const params = new URLSearchParams()

    if (searchTerm) params.set("keyword", searchTerm)
    if (category) params.set("category", category)
    if (page > 1) params.set("page", page.toString())
    if (showNewOnly) params.set("new", "true")
    if (showSaleOnly) params.set("sale", "true")

    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setCategory("")
    setPriceRange([0, 500])
    setShowNewOnly(false)
    setShowSaleOnly(false)
    setPage(1)
    router.push("/products")
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo(0, 0)

    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile filter toggle */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Filters sidebar */}
        <div className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 space-y-6`}>
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Search</h3>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Categories</h3>
            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value)
                handleFilterChange()
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Bracelets">Bracelets</SelectItem>
                <SelectItem value="Handbags">Handbags</SelectItem>
                <SelectItem value="Jewelry">Jewelry</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Price Range</h3>
            <div className="px-2">
              <Slider
                defaultValue={priceRange}
                min={0}
                max={500}
                step={10}
                onValueChange={(value) => setPriceRange(value as number[])}
                onValueCommit={handleFilterChange}
              />
              <div className="flex justify-between mt-2 text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Product Status</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="new-only"
                  checked={showNewOnly}
                  onCheckedChange={(checked) => {
                    setShowNewOnly(checked as boolean)
                    handleFilterChange()
                  }}
                />
                <Label htmlFor="new-only">New Arrivals</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sale-only"
                  checked={showSaleOnly}
                  onCheckedChange={(checked) => {
                    setShowSaleOnly(checked as boolean)
                    handleFilterChange()
                  }}
                />
                <Label htmlFor="sale-only">On Sale</Label>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>

        {/* Products grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg mb-4">No products found</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
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
      </div>
    </div>
  )
}
