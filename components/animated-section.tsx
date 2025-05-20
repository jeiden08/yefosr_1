"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"
import { type ReactNode, useEffect, useState } from "react"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  animation?: "fade-in" | "slide-up" | "slide-right" | "none"
}

export function AnimatedSection({ children, className, delay = 0, animation = "slide-up" }: AnimatedSectionProps) {
  const { ref, isIntersecting } = useScrollAnimation()
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isIntersecting && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [isIntersecting, hasAnimated])

  const getAnimationClass = () => {
    if (animation === "none" || hasAnimated) return ""

    switch (animation) {
      case "fade-in":
        return "opacity-0"
      case "slide-up":
        return "opacity-0 translate-y-8"
      case "slide-right":
        return "opacity-0 -translate-x-8"
      default:
        return ""
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        getAnimationClass(),
        hasAnimated && "opacity-100 translate-y-0 translate-x-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
