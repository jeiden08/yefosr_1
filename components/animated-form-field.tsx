"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface AnimatedFormFieldProps {
  form: any
  name: string
  label: string
  placeholder?: string
  type?: string
  className?: string
  isTextarea?: boolean
  rows?: number
}

export function AnimatedFormField({
  form,
  name,
  label,
  placeholder,
  type = "text",
  className,
  isTextarea = false,
  rows = 4,
}: AnimatedFormFieldProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("relative", className)}>
          <FormLabel
            className={cn(
              "absolute transition-all duration-200 pointer-events-none",
              isFocused || field.value
                ? "-top-2 left-2 text-xs bg-background px-1 text-primary"
                : "top-3 left-3 text-muted-foreground",
            )}
          >
            {label}
          </FormLabel>
          <FormControl>
            {isTextarea ? (
              <Textarea
                {...field}
                placeholder={isFocused ? placeholder : ""}
                className={cn(
                  "border-muted-foreground/20 focus:border-primary transition-all duration-300",
                  isFocused && "border-primary ring-1 ring-primary",
                )}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                rows={rows}
              />
            ) : (
              <Input
                {...field}
                type={type}
                placeholder={isFocused ? placeholder : ""}
                className={cn(
                  "border-muted-foreground/20 focus:border-primary transition-all duration-300",
                  isFocused && "border-primary ring-1 ring-primary",
                )}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
