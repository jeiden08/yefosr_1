"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

export function MobileNav({ settings }: { settings: Record<string, any> }) {
  const [open, setOpen] = React.useState(false)

  const navigation = settings.navigation || {
    links: [
      { title: "Home", href: "/" },
      { title: "About", href: "/about" },
      { title: "Programs", href: "/programs" },
      { title: "Blog", href: "/blog" },
      { title: "Resources", href: "/resources" },
      { title: "Contact", href: "/contact" },
    ],
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <Image src="/logo.png" alt="Youth Empowerment Logo" width={40} height={40} className="h-8 w-auto" />
            <span className="font-bold">YEFOSR</span>
          </Link>
        </div>
        <nav className="mt-8 flex flex-col gap-4 px-7">
          {navigation.links.map((link: any, index: number) => (
            <Link
              key={index}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
