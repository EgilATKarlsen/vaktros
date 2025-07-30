'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, X, Smartphone, Share, Monitor, Chrome, Globe, Copy, Check } from 'lucide-react'

interface WindowWithMSStream extends Window {
  MSStream?: any;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface InstallPromptProps {
  forceShow?: boolean // Add prop to force show in demo
}

export default function InstallPrompt({ forceShow = false }: InstallPromptProps) {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [promptInstall, setPromptInstall] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [showManualInstructions, setShowManualInstructions] = useState(false)
  const [urlCopied, setUrlCopied] = useState(false)
  const [installing, setInstalling] = useState(false)

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as WindowWithMSStream).MSStream
    )

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    const handler = (e: Event) => {
      e.preventDefault()
      setPromptInstall(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // For demo mode, show after a short delay if forceShow is true
    if (forceShow && !dismissed) {
      setTimeout(() => setShowPrompt(true), 1000)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [forceShow, dismissed])

  const onClick = async () => {
    if (!promptInstall) {
      return
    }
    
    setInstalling(true)
    try {
      const result = await promptInstall.prompt()
      console.log('👍', 'userChoice', result)
      setPromptInstall(null)
      setShowPrompt(false)
    } catch (error) {
      console.error('Install prompt failed:', error)
    } finally {
      setInstalling(false)
    }
  }

  const onClose = () => {
    setShowPrompt(false)
    setDismissed(true)
  }

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin)
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = window.location.origin
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 2000)
    }
  }

  const downloadManifest = async () => {
    try {
      const response = await fetch('/manifest.json')
      const manifestData = await response.json()
      const blob = new Blob([JSON.stringify(manifestData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'vaktros-manifest.json'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download manifest:', err)
      // Fallback: direct link
      const link = document.createElement('a')
      link.href = '/manifest.json'
      link.download = 'vaktros-manifest.json'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Don't show if already installed as PWA
  if (isStandalone) {
    return (
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <Download className="w-5 h-5" />
            ✅ VAKTROS is Installed!
          </CardTitle>
          <CardDescription>
            You&apos;re already running VAKTROS as an installed PWA app.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Show iOS install instructions
  if (isIOS) {
    return (
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Install VAKTROS on iOS
            </div>
            {!forceShow && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            Install this app on your iPhone/iPad for the best experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Share className="w-4 h-4 mt-0.5 text-blue-500" />
                <div>
                  <p className="font-medium">1. Tap the Share button</p>
                  <p className="text-muted-foreground">Usually at the bottom of Safari</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Download className="w-4 h-4 mt-0.5 text-blue-500" />
                <div>
                  <p className="font-medium">2. Tap &quot;Add to Home Screen&quot;</p>
                  <p className="text-muted-foreground">Scroll down to find this option</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Smartphone className="w-4 h-4 mt-0.5 text-blue-500" />
                <div>
                  <p className="font-medium">3. Tap &quot;Add&quot; to confirm</p>
                  <p className="text-muted-foreground">VAKTROS will appear on your home screen</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">Alternative: Bookmark Method</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyUrl}>
                  {urlCopied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {urlCopied ? 'Copied!' : 'Copy URL'}
                </Button>
                <Button variant="outline" size="sm" onClick={downloadManifest}>
                  <Download className="w-4 h-4 mr-1" />
                  Download Info
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show for desktop browsers (Chrome, Edge, etc.)
  if (forceShow || showPrompt) {
    return (
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Install VAKTROS App
            </div>
            {!forceShow && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            Install VAKTROS for faster access and offline capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {promptInstall ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button onClick={onClick} className="flex-1" disabled={installing}>
                    <Download className="w-4 h-4 mr-2" />
                    {installing ? 'Installing...' : 'Install App'}
                  </Button>
                  {!forceShow && (
                    <Button variant="outline" onClick={onClose}>
                      Maybe Later
                    </Button>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowManualInstructions(!showManualInstructions)}
                  className="w-full"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {showManualInstructions ? 'Hide' : 'Show'} Manual Install Options
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    💡 <strong>No automatic install available.</strong> Use the manual options below or check your browser&apos;s menu for install options.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowManualInstructions(!showManualInstructions)}
                  className="w-full"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {showManualInstructions ? 'Hide' : 'Show'} Install Options
                </Button>
              </div>
            )}

            {showManualInstructions && (
              <div className="space-y-4 border-t pt-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Chrome className="w-4 h-4 mt-0.5 text-blue-500" />
                    <div>
                      <p className="font-medium">Chrome/Edge Desktop</p>
                      <p className="text-muted-foreground">Look for the install icon in the address bar, or use the three-dot menu → &quot;Install VAKTROS&quot;</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 mt-0.5 text-blue-500" />
                    <div>
                      <p className="font-medium">Safari Desktop</p>
                      <p className="text-muted-foreground">File menu → &quot;Add to Dock&quot; or bookmark and pin to favorites</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Monitor className="w-4 h-4 mt-0.5 text-blue-500" />
                    <div>
                      <p className="font-medium">Other Browsers</p>
                      <p className="text-muted-foreground">Check your browser&apos;s menu for &quot;Install&quot;, &quot;Add to Desktop&quot;, or &quot;Create Shortcut&quot; options</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                    💡 Manual Installation Options:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={copyUrl}>
                      {urlCopied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                      {urlCopied ? 'Copied!' : 'Copy URL'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadManifest}>
                      <Download className="w-4 h-4 mr-1" />
                      Download Manifest
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open('/manifest.json', '_blank')}
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      View PWA Info
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
} 