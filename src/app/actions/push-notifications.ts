'use server'

import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:contact@vaktros.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

interface SubscriptionObject {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// Store subscription as a plain object instead of PushSubscription
let subscription: SubscriptionObject | null = null

export async function subscribeUser(sub: {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}) {
  subscription = sub
  console.log('User subscribed to push notifications')
  return { success: true }
}

export async function unsubscribeUser() {
  subscription = null
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  console.log('User unsubscribed from push notifications')
  return { success: true }
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error('No subscription available')
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'VAKTROS Security Alert',
        body: message,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        data: {
          url: '/',
          timestamp: Date.now()
        }
      })
    )
    console.log('Push notification sent successfully')
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
} 