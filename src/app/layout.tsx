
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";

const APP_NAME = "Even";
const APP_TITLE = "Even: AI Chat Agent & Coding Assistant";
const APP_DESCRIPTION = "Meet Even, your intelligent AI chat agent and coding assistant. Get help with general chat, grammar, summaries, code debugging, optimization, translation, and more. Powered by Next.js and Genkit.";
// IMPORTANT: Replace with your actual Vercel deployment URL
const APP_URL = "https://your-vercel-app-url.vercel.app";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_TITLE,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: ["Even", "AI chat", "chat agent", "coding assistant", "AI programming", "Next.js AI", "Genkit AI", "AI tools", "grammar checker", "code optimizer", "code translator", "AI chat app"],
  manifest: "/manifest.json", // Assuming you might add a manifest later for PWA features
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icon.png', // Main favicon
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_TITLE,
      template: `%s | ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    url: APP_URL, // IMPORTANT: Replace with your actual Vercel URL
    images: [
      {
        url: `${APP_URL}/icon.png`, // Use absolute URL for OG images
        width: 256, // Assuming icon.png is square, specify dimensions
        height: 256,
        alt: "Even App Icon",
      },
      // You can add a more descriptive social sharing image here (e.g., 1200x630)
      // {
      //   url: `${APP_URL}/og-image.png`,
      //   width: 1200,
      //   height: 630,
      //   alt: "Even - AI Chat Agent Interface",
      // },
    ],
  },
  twitter: {
    card: "summary", // Can be "summary_large_image" if you have a larger og-image
    title: {
      default: APP_TITLE,
      template: `%s | ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    // creator: "@yourTwitterHandle", // Optional: Add your Twitter handle
    images: [`${APP_URL}/icon.png`], // Must be an absolute URL
  },
  // Optional: If you want to specify a canonical URL
  // alternates: {
  //   canonical: APP_URL,
  // },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F0F4F8" }, // Corresponds to light --background
    { media: "(prefers-color-scheme: dark)", color: "#121212" }, // Corresponds to dark --background (approximated, update if your dark bg is different)
  ],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
