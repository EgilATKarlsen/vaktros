"use server"

import { neon } from "@neondatabase/serverless"
import { z } from "zod"

// Create a schema for email validation
const EmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type WaitlistResponse = {
  success: boolean
  message: string
}

export async function joinWaitlist(formData: FormData): Promise<WaitlistResponse> {
  try {
    // Get email from form data
    const email = formData.get("email") as string

    // Validate email
    const result = EmailSchema.safeParse({ email })
    if (!result.success) {
      return {
        success: false,
        message: result.error.errors[0].message,
      }
    }

    // Connect to the database
    const sql = neon(process.env.DATABASE_URL!)

    // Check if email already exists
    const existingUser = await sql`
      SELECT email FROM waitlist WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return {
        success: true,
        message: "You are already on our demo list. Thank you for your interest!",
      }
    }

    // Insert email into waitlist table
    await sql`
      INSERT INTO waitlist (email) VALUES (${email})
    `

    return {
      success: true,
      message: "Thank you for joining our demo list! We'll reach out to you soon.",
    }
  } catch (error) {
    console.error("Error joining waitlist:", error)
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    }
  }
}
