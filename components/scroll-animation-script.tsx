"use client"

import { useEffect } from "react"

export function ScrollAnimationScript() {
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll")
      const staggerItems = document.querySelectorAll(".stagger-item")

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible")
            }
          })
        },
        {
          threshold: 0.1,
        },
      )

      elements.forEach((element) => {
        observer.observe(element)
      })

      staggerItems.forEach((element) => {
        observer.observe(element)
      })

      return () => {
        elements.forEach((element) => {
          observer.unobserve(element)
        })

        staggerItems.forEach((element) => {
          observer.unobserve(element)
        })
      }
    }

    animateOnScroll()

    // Re-run on route changes
    window.addEventListener("popstate", animateOnScroll)

    return () => {
      window.removeEventListener("popstate", animateOnScroll)
    }
  }, [])

  return null
}
