'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  // Ensure that theme is applied only on the client side
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</> // Return children without applying theme during SSR
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
