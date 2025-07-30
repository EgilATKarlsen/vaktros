import { stackServerApp } from "@/stack";

/**
 * Safely get the current user from Stack Auth without triggering redirects.
 * Returns the user if authenticated, null if not authenticated.
 * Throws other errors that are not authentication-related.
 */
export async function getAuthenticatedUser() {
  try {
    const user = await stackServerApp.getUser();
    return user;
  } catch (error) {
    // Check if this is a redirect error from Stack Auth
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = String(error.message);
      if (errorMessage.includes('NEXT_REDIRECT') || errorMessage.includes('redirect')) {
        console.log('Auth redirect error caught - treating as unauthenticated:', errorMessage);
        return null;
      }
    }
    
    // Re-throw non-authentication errors
    throw error;
  }
}

/**
 * Get authenticated user or return a 401 response
 */
export async function requireAuth() {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
} 