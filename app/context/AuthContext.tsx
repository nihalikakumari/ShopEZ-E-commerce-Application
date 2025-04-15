"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from "@/app/services/auth"
import type { User, LoginCredentials, RegisterData } from "@/app/services/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already logged in
    const checkLoggedIn = () => {
      const currentUser = getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }

    checkLoggedIn()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null)
      const userData = await apiLogin(credentials)
      setUser(userData)
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed")
      throw err
    }
  }

  const register = async (data: RegisterData) => {
    try {
      setError(null)
      const userData = await apiRegister(data)
      setUser(userData)
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed")
      throw err
    }
  }

  const logout = () => {
    apiLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, error }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
