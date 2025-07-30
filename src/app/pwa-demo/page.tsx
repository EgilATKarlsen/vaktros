import PWAWrapper from '@/components/pwa/pwa-wrapper'
import DownloadGuide from '@/components/pwa/download-guide'

export default function PWADemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold text-white">
            VAKTROS PWA Demo
          </h1>
          <p className="text-gray-300 text-lg">
            Test the Progressive Web App features & install options
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - PWA Features */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4">
                PWA Features
              </h2>
              <div className="text-gray-300 space-y-2 mb-6">
                <p>✅ <strong>Installable:</strong> Add VAKTROS to your home screen</p>
                <p>✅ <strong>Push Notifications:</strong> Get real-time security alerts</p>
                <p>✅ <strong>Offline Support:</strong> Basic functionality works offline</p>
                <p>✅ <strong>Responsive:</strong> Optimized for mobile and desktop</p>
              </div>
              
              <PWAWrapper demoMode={true} />
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">
                How to Test
              </h3>
              <div className="text-gray-300 space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-white">1. Install App</h4>
                  <p>Try the automatic install prompt, or use the comprehensive download guide on the right.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white">2. Enable Notifications</h4>
                  <p>Click &quot;Subscribe to Notifications&quot; and allow permissions when prompted.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white">3. Test Notifications</h4>
                  <p>Enter a message and click &quot;Send Test Notification&quot; to see push notifications in action.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white">4. Test Offline</h4>
                  <p>Turn off your internet connection and refresh - basic functionality should still work.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Download Guide */}
          <div className="space-y-6">
            <DownloadGuide />
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">
                Troubleshooting
              </h3>
              <div className="text-gray-300 space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-white">Install Button Not Showing?</h4>
                  <p>• Try refreshing the page</p>
                  <p>• Use Chrome or Edge for best PWA support</p>
                  <p>• Check the manual install options above</p>
                </div>
                <div>
                  <h4 className="font-medium text-white">Notifications Not Working?</h4>
                  <p>• Make sure notifications are enabled in browser settings</p>
                  <p>• Try using HTTPS (required for PWA features)</p>
                  <p>• Check if Do Not Disturb is enabled</p>
                </div>
                <div>
                  <h4 className="font-medium text-white">App Not Installing?</h4>
                  <p>• Use the &quot;Copy URL&quot; and bookmark method</p>
                  <p>• Download the manifest file for manual setup</p>
                  <p>• Create a desktop shortcut as fallback</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
} 