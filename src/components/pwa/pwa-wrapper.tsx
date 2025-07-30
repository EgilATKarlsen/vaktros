'use client'

import PushNotificationManager from './push-notification-manager'
import InstallPrompt from './install-prompt'

interface PWAWrapperProps {
  demoMode?: boolean
}

export default function PWAWrapper({ demoMode = false }: PWAWrapperProps) {
  return (
    <div className="space-y-4">
      <InstallPrompt forceShow={demoMode} />
      <PushNotificationManager />
    </div>
  )
} 