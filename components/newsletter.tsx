"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your API
    setSubmitted(true)
  }

  return (
    <section className="w-full py-12 md:py-24 bg-gradient-to-r from-rose-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Stay Updated</h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Subscribe to our newsletter for exclusive offers, new arrivals, and style inspiration.
            </p>
          </div>
          <div className="w-full max-w-md space-y-2">
            {submitted ? (
              <div className="rounded-lg bg-teal-50 p-6 dark:bg-teal-950">
                <p className="text-teal-700 dark:text-teal-300 font-medium">
                  Thank you for subscribing! Check your email for a special welcome offer.
                </p>
              </div>
            ) : (
              <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubmit}>
                <Input
                  className="flex-1 min-w-0"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit">Subscribe</Button>
              </form>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
