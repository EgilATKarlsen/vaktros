'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Download, 
  Smartphone, 
  Monitor, 
  Chrome, 
  Globe, 
  Copy, 
  Check, 
  ExternalLink,
  FileText,
  QrCode,
  Bookmark
} from 'lucide-react'

export default function DownloadGuide() {
  const [urlCopied, setUrlCopied] = useState(false)
  const [manifestDownloaded, setManifestDownloaded] = useState(false)
  const [shortcutCreated, setShortcutCreated] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    // Set URL after component mounts to avoid hydration mismatch
    setCurrentUrl(window.location.origin)
  }, [])

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
      setManifestDownloaded(true)
      setTimeout(() => setManifestDownloaded(false), 2000)
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

  const createDesktopShortcut = () => {
    try {
      // Detect browser and create appropriate shortcut
      const userAgent = navigator.userAgent.toLowerCase()
      const isWindows = navigator.platform.toLowerCase().includes('win')
      const isMac = navigator.platform.toLowerCase().includes('mac')
      
      if (isWindows) {
        // Create Windows .url shortcut
        const shortcutContent = `[InternetShortcut]
URL=${window.location.origin}
IconFile=${window.location.origin}/icon-256.png
IconIndex=0`
        
        const blob = new Blob([shortcutContent], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'VAKTROS.url'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else if (isMac) {
        // Create Mac .webloc shortcut
        const weblocContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>URL</key>
    <string>${window.location.origin}</string>
</dict>
</plist>`
        
        const blob = new Blob([weblocContent], { type: 'application/xml' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'VAKTROS.webloc'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else {
        // Create generic HTML shortcut for other systems
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=${window.location.origin}">
    <title>VAKTROS - AI Surveillance Platform</title>
    <link rel="icon" href="${window.location.origin}/icon-192.png">
</head>
<body>
    <p>Redirecting to <a href="${window.location.origin}">VAKTROS</a>...</p>
</body>
</html>`
        
        const blob = new Blob([htmlContent], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'VAKTROS.html'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
      
      setShortcutCreated(true)
      setTimeout(() => setShortcutCreated(false), 2000)
    } catch (err) {
      console.error('Failed to create shortcut:', err)
    }
  }

  const installPWA = () => {
    // Try to trigger browser install if available
    if ('serviceWorker' in navigator) {
      // Show instructions or trigger install
      alert('To install VAKTROS:\n\n1. Look for the install icon in your browser\'s address bar\n2. Or use your browser\'s menu to "Install" or "Add to Home Screen"\n3. Follow the prompts to complete installation')
    }
  }

  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Download & Install Options
        </CardTitle>
        <CardDescription>
          Multiple ways to install VAKTROS when the browser install button doesn't work
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Quick Actions */}
        <div>
          <h4 className="font-medium mb-3">Quick Actions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button variant="outline" onClick={copyUrl} className="justify-start">
              {urlCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {urlCopied ? 'URL Copied!' : 'Copy App URL'}
            </Button>
            <Button variant="outline" onClick={downloadManifest} className="justify-start">
              {manifestDownloaded ? <Check className="w-4 h-4 mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
              {manifestDownloaded ? 'Downloaded!' : 'Download Manifest'}
            </Button>
            <Button variant="outline" onClick={createDesktopShortcut} className="justify-start">
              {shortcutCreated ? <Check className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}
              {shortcutCreated ? 'Shortcut Created!' : 'Create Shortcut'}
            </Button>
            <Button variant="outline" onClick={() => window.open('/manifest.json', '_blank')} className="justify-start">
              <ExternalLink className="w-4 h-4 mr-2" />
              View PWA Info
            </Button>
          </div>
        </div>

        {/* Install Button */}
        <div className="border-t pt-4">
          <Button onClick={installPWA} className="w-full" size="lg">
            <Download className="w-4 h-4 mr-2" />
            Try to Install VAKTROS
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This will show browser-specific install instructions
          </p>
        </div>

        {/* Platform-Specific Instructions */}
        <div>
          <h4 className="font-medium mb-3">Platform-Specific Instructions</h4>
          <div className="space-y-4">
            
            {/* Chrome/Edge Desktop */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Chrome className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Chrome/Edge Desktop</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Look for the <strong>install icon</strong> in the address bar (⊕ or 📱)</p>
                <p>• Or: Three dots menu → &quot;Install VAKTROS...&quot;</p>
                <p>• Or: Settings → Apps → Install VAKTROS</p>
              </div>
            </div>

            {/* Safari Desktop */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Safari Desktop</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• File menu → &quot;Add to Dock&quot;</p>
                <p>• Or: Bookmarks → &quot;Add Bookmark&quot; → Save to Favorites</p>
                <p>• Or: Share button → &quot;Add to Reading List&quot;</p>
              </div>
            </div>

            {/* Mobile Safari */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="w-4 h-4 text-blue-500" />
                <span className="font-medium">iPhone/iPad Safari</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Tap <strong>Share button</strong> (⬆️) at bottom</p>
                <p>• Scroll down → Tap <strong>&quot;Add to Home Screen&quot;</strong></p>
                <p>• Tap <strong>&quot;Add&quot;</strong> to confirm</p>
              </div>
            </div>

            {/* Android Chrome */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Android Chrome</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Three dots menu → <strong>&quot;Add to Home screen&quot;</strong></p>
                <p>• Or: Three dots menu → <strong>&quot;Install app&quot;</strong></p>
                <p>• Confirm installation when prompted</p>
              </div>
            </div>

            {/* Other Browsers */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Other Browsers</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Look for &quot;Install&quot;, &quot;Add to Desktop&quot;, or &quot;Create Shortcut&quot;</p>
                <p>• Check browser menu or address bar for install options</p>
                <p>• Bookmark the page and pin to favorites/toolbar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Installation */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Manual Installation</h4>
          <p className="text-sm text-muted-foreground mb-3">
            If none of the above work, you can manually create shortcuts:
          </p>
          <div className="space-y-2 text-sm">
            <p>• <strong>Desktop:</strong> Create a bookmark/shortcut to {currentUrl ? (
              <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{currentUrl}</code>
            ) : (
              <span className="text-muted-foreground">this page</span>
            )}</p>
            <p>• <strong>Mobile:</strong> Bookmark this page and add to home screen</p>
            <p>• <strong>Windows:</strong> Pin this tab or create desktop shortcut</p>
            <p>• <strong>Mac:</strong> Add to Dock from Safari File menu</p>
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="font-medium mb-2">Why Install VAKTROS?</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div>• 🚀 Faster loading</div>
            <div>• 📱 Native app experience</div>
            <div>• 🔔 Push notifications</div>
            <div>• 📴 Works offline</div>
            <div>• 🏠 Home screen access</div>
            <div>• 🔒 Secure & private</div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
} 