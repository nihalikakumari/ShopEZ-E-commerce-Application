'use client'; // Optional but good for Next.js App Router

import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6" />
              <span className="font-bold text-xl">ShopEZ</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Premium fashion accessories for every style and occasion.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h4 className="font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm">
              {["All Products", "Bracelets", "Handbags", "Jewelry", "Sale"].map((item, idx) => (
                <li key={idx}>
                  <Link href={`/products${item === "All Products" ? "" : `/${item.toLowerCase()}`}`} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h4 className="font-semibold">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/account">My Account</Link></li>
              <li><Link href="/account/orders">Orders</Link></li>
              <li><Link href="/account/wishlist">Wishlist</Link></li>
              <li><Link href="/account/settings">Settings</Link></li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h4 className="font-semibold">Info</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/shipping">Shipping & Returns</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 ShopEZ. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10..." clipRule="evenodd" />
              </svg>
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0..." clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
