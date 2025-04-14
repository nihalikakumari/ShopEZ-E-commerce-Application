import api from "./api"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface User {
  _id: string
  username: string
  email: string
  isAdmin: boolean
  token: string
}

export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await api.post("/auth/login", credentials)

  // Store the token in localStorage
  if (response.data.token) {
    localStorage.setItem("userToken", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data))
  }

  return response.data
}

export const register = async (data: RegisterData): Promise<User> => {
  const response = await api.post("/users", data)

  // Store the token in localStorage
  if (response.data.token) {
    localStorage.setItem("userToken", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data))
  }

  return response.data
}

export const logout = (): void => {
  localStorage.removeItem("userToken")
  localStorage.removeItem("user")
}

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user")
  if (userStr) {
    return JSON.parse(userStr)
  }
  return null
}

export const getProfile = async (): Promise<User> => {
  const response = await api.get("/auth/profile")
  return response.data
}

export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  const response = await api.put("/users/profile", userData)
  return response.data
}
