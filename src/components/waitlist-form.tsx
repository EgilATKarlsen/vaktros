"use client"

import type React from "react"

import { useState } from "react"
import { joinWaitlist } from "@/app/actions/waitlist"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight } from "lucide-react"

export default function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append("email", email)

      const response = await joinWaitlist(formData)

      if (response.success) {
        setMessage({ text: response.message, type: "success" })
        setEmail("")
      } else {
        setMessage({ text: response.message, type: "error" })
      }
    } catch {
      setMessage({ text: "An error occurred. Please try again later.", type: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 max-w-xs relative">
        <Input
          type="email"
          placeholder="Enter your email"
          className="bg-black/50 border-white/20 h-12"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>
      <Button
        type="submit"
        className="h-12 px-8 bg-red-600 hover:bg-red-700 text-white border-none"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Request Demo"}
        {!isSubmitting && <ChevronRight className="ml-2 h-4 w-4" />}
      </Button>
      {message && (
        <div className={`absolute mt-14 text-sm ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
          {message.text}
        </div>
      )}
    </form>
  )
}
