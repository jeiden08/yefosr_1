"use client"

import Link from "next/link"
import { MobileNav } from "@/components/mobile-nav"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function MainNav({ settings }: { settings: Record<string, any> }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  // Use navigation from settings, or fall back to accurate default data
  const navigation = settings.navigation || {
    links: [
      { title: "Home", href: "/" },
      { title: "About", href: "/about" },
      { title: "Programs", href: "/programs" },
      { title: "Blog", href: "/blog" },
      { title: "Gallery", href: "/gallery" },
      { title: "Resources", href: "/resources" },
      { title: "Contact", href: "/contact" },
    ],
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-white/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-white/60" : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Youth Empowerment Logo" width={40} height={40} className="h-10 w-auto" />
            <span className="hidden font-bold text-primary sm:inline-block">
              Youth Empowerment For Self Reliance - YEFOSR
            </span>
          </Link>
        </div>
        <nav className="hidden gap-6 md:flex ml-auto">
          {navigation.links.map((link: any, index: number) => (
            <Link
              key={index}
              href={link.href}
              className={cn(
                "relative flex items-center text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-['']"
                  : "text-muted-foreground",
              )}
            >
              {link.title}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <MobileNav settings={settings} />
        </div>
      </div>
    </header>
  )
}
