import { useUser } from "@stackframe/stack";

export async function performLogout(user?: ReturnType<typeof useUser>) {
  try {
    console.log('Starting logout process...');

    // Step 1: Clear service worker cache and unregister
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        // Notify service worker about logout
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.active) {
          registration.active.postMessage({ type: 'LOGOUT' });
        }

        // Clear all caches
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => {
            console.log('Clearing cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
        console.log('Service worker caches cleared');

        // Unregister service worker
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        console.log('Service worker unregistered');
      } catch (error) {
        console.error('Error clearing service worker cache:', error);
      }
    }

    // Step 2: Clear browser storage
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear any cookies that might be related to the app
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        console.log('Browser storage cleared');
      } catch (error) {
        console.error('Error clearing browser storage:', error);
      }
    }

    // Step 3: Sign out the user
    if (user && typeof user.signOut === 'function') {
      try {
        await user.signOut();
        console.log('User signed out successfully');
      } catch (error) {
        console.error('Error signing out user:', error);
      }
    }

    // Step 4: Force a hard redirect to clear any cached state
    console.log('Redirecting to home page...');
    
    // Use a small delay to ensure all cleanup is complete
    setTimeout(() => {
      // Force a hard redirect to avoid any cached content
      window.location.href = '/';
    }, 100);

  } catch (error) {
    console.error('Error during logout process:', error);
    // Fallback: force redirect even if logout fails
    window.location.href = '/';
  }
}

// Hook for components to use logout functionality
export function useLogout() {
  const user = useUser();
  
  return () => performLogout(user);
} 