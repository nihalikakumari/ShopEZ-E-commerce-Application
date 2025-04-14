import api from "./api"

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  image: string
  images?: string[]
  countInStock: number
  rating: number
  numReviews: number
  isNew?: boolean
  isSale?: boolean
  sizes?: string[]
  colors?: string[]
  featured?: boolean
}

export interface ProductsResponse {
  products: Product[]
  page: number
  pages: number
  count: number
}

export const getProducts = async (
  keyword = "",
  pageNumber = 1,
  category = "",
  price = "",
  featured = "",
  isNew = "",
  isSale = "",
): Promise<ProductsResponse> => {
  const response = await api.get(
    `/products?keyword=${keyword}&pageNumber=${pageNumber}&category=${category}&price=${price}&featured=${featured}&new=${isNew}&sale=${isSale}`,
  )
  return response.data
}

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products/featured")
  return response.data
}

export const getNewProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products/new")
  return response.data
}

export const getSaleProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products/sale")
  return response.data
}

export const getTopProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products/top")
  return response.data
}

export const createProductReview = async (
  productId: string,
  review: { rating: number; comment: string },
): Promise<{ message: string }> => {
  const response = await api.post(`/products/${productId}/reviews`, review)
  return response.data
}
