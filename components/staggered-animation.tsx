"use client"

import React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface StaggeredAnimationProps {
  children: React.ReactNode
  className?: string
  delay?: number
  staggerDelay?: number
  animation?: "fade-in" | "slide-up" | "slide-right" | "zoom-in" | "none"
}

export function StaggeredAnimation({
  children,
  className,
  delay = 0,
  staggerDelay = 100,
  animation = "slide-up",
}: StaggeredAnimationProps) {
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
        }
      },
      {
        rootMargin: "0px",
        threshold: 0.1,
      },
    )

    observer.observe(ref.current)

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [hasAnimated])

  const getAnimationClass = () => {
    if (animation === "none" || hasAnimated) return ""

    switch (animation) {
      case "fade-in":
        return "opacity-0"
      case "slide-up":
        return "opacity-0 translate-y-8"
      case "slide-right":
        return "opacity-0 -translate-x-8"
      case "zoom-in":
        return "opacity-0 scale-95"
      default:
        return ""
    }
  }

  // Apply staggered animation to children
  const childrenWithStagger = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child

    return React.cloneElement(child as React.ReactElement, {
      className: cn(
        child.props.className,
        "transition-all duration-700 ease-out",
        getAnimationClass(),
        hasAnimated && "opacity-100 translate-y-0 translate-x-0 scale-100",
      ),
      style: {
        ...child.props.style,
        transitionDelay: `${delay + index * staggerDelay}ms`,
      },
    })
  })

  return (
    <div ref={ref} className={className}>
      {childrenWithStagger}
    </div>
  )
}
