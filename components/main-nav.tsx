import Link from "next/link"

export function MainNav() {
  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      <Link href="/products" className="transition-colors hover:text-foreground/80 text-foreground/60">
        All Products
      </Link>
      <Link
        href="/products/category/Bracelets"
        className="transition-colors hover:text-foreground/80 text-foreground/60"
      >
        Bracelets
      </Link>
      <Link
        href="/products/category/Handbags"
        className="transition-colors hover:text-foreground/80 text-foreground/60"
      >
        Handbags
      </Link>
      <Link href="/products/category/Jewelry" className="transition-colors hover:text-foreground/80 text-foreground/60">
        Jewelry
      </Link>
      <Link
        href="/products?sale=true"
        className="transition-colors text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-semibold"
      >
        Sale
      </Link>
    </nav>
  )
}
