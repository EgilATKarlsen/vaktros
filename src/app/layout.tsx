import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { StackProviderWrapper } from "@/components/stack-provider-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VAKTROS",
  description: "AI-Powered Surveillance For The Modern World",
  keywords: [
    "AI Video Analytics",
    "Intelligent CCTV",
    "Real-time Threat Detection",
    "Computer Vision Security",
    "AI Surveillance Platform",
    "Smart Video Monitoring",
    "Physical Security Analytics",
    "Automated Security Alerts",
    "CCTV Data Collection",
    "Security AI Solutions"
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VAKTROS",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "VAKTROS",
    title: "VAKTROS",
    description: "AI-Powered Surveillance For The Modern World",
  },
  twitter: {
    card: "summary",
    title: "VAKTROS",
    description: "AI-Powered Surveillance For The Modern World",
  },
  icons: {
    icon: [
      { url: '/vaktros.svg', type: 'image/svg+xml' }, // SVG favicon for website
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }, // Fallback PNG
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }, // PWA icon for Apple devices
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0070f3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VAKTROS" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0070f3" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="msapplication-TileImage" content="/icon-256.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', {
                    scope: '/',
                    updateViaCache: 'none'
                  }).then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }).catch(function(error) {
                    console.log('ServiceWorker registration failed: ', error);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      ><StackProviderWrapper>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="vaktros-theme"
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </StackProviderWrapper></body>
    </html>
  );
}
