import "server-only";
import { stackServerApp } from "@/stack";

/**
 * Get the current authenticated user from the server
 * @returns The current user or null if not authenticated
 */
export async function getCurrentUser() {
  try {
    const user = await stackServerApp.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Get authenticated user or return a 401 response
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
} 