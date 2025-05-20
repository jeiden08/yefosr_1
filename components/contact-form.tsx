"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { AnimatedFormField } from "@/components/animated-form-field"
import { StaggeredAnimation } from "@/components/staggered-animation"
import { Send } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // 1. Store the submission in Supabase
      const { data, error } = await supabase.from("contact_submissions").insert([
        {
          name: values.name,
          email: values.email,
          phone: values.phone || null,
          subject: values.subject,
          message: values.message,
          status: "unread",
        },
      ])

      if (error) throw error

      // 2. Send email notification
      try {
        const response = await fetch("/api/send-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })

        if (!response.ok) {
          console.warn("Email notification failed, but form was submitted successfully")
        }
      } catch (emailError) {
        // Log the error but don't fail the form submission
        console.error("Failed to send email notification:", emailError)
      }

      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      })

      setIsSuccess(true)
      setTimeout(() => {
        form.reset()
        setIsSuccess(false)
      }, 3000)

      router.refresh()
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Something went wrong",
        description: "Your message could not be sent. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <StaggeredAnimation staggerDelay={150}>
          <AnimatedFormField form={form} name="name" label="Name" placeholder="Your full name" />

          <AnimatedFormField form={form} name="email" label="Email" placeholder="your.email@example.com" type="email" />

          <AnimatedFormField form={form} name="phone" label="Phone (Optional)" placeholder="Your phone number" />

          <AnimatedFormField form={form} name="subject" label="Subject" placeholder="What is your message about?" />

          <AnimatedFormField
            form={form}
            name="message"
            label="Message"
            placeholder="Please provide details about your inquiry..."
            isTextarea={true}
            rows={5}
          />

          <div className="pt-4">
            <Button
              type="submit"
              className={`w-full relative overflow-hidden transition-all duration-500 ${
                isSuccess ? "bg-green-600 hover:bg-green-700" : ""
              }`}
              disabled={isSubmitting}
            >
              <span
                className={`flex items-center justify-center gap-2 transition-transform duration-500 ${
                  isSuccess ? "translate-y-20" : ""
                }`}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send className="h-4 w-4" />
              </span>

              <span
                className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${
                  isSuccess ? "translate-y-0" : "-translate-y-20"
                }`}
              >
                Message Sent! Thank You
              </span>
            </Button>
          </div>
        </StaggeredAnimation>
      </form>
    </Form>
  )
}
