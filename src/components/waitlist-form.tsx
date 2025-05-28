"use client"

import type React from "react"

import { useState } from "react"
import { joinWaitlist } from "@/app/actions/waitlist"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight } from "lucide-react"
import { toast } from "sonner"

export default function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("email", email)

      const response = await joinWaitlist(formData)

      if (response.success) {
        toast.success(response.message)
        setEmail("")
      } else {
        toast.error(response.message)
      }
    } catch {
      toast.error("An error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="w-full sm:flex-1 sm:max-w-xs">
          <Input
            type="email"
            placeholder="Enter your email"
            className="h-12 w-full bg-background border-border dark:bg-secondary dark:border-secondary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>
        <Button
          type="submit"
          className="h-12 w-full sm:w-auto sm:px-8 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white border-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Request Demo"}
          {!isSubmitting && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}
