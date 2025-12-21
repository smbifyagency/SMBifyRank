import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/Toast";
import "@/styles/animations.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SMBify Rank | AI-Powered Website Builder for Local Businesses",
    template: "%s | SMBify Rank",
  },
  description: "Generate SEO-optimized websites for local businesses in minutes. AI-powered content, location pages, and one-click deployment. Start free today!",
  keywords: ["website builder", "SEO", "local business", "AI website generator", "small business website", "static website builder", "Netlify deployment"],
  authors: [{ name: "SMBify Agency", url: "https://smbify.agency" }],
  creator: "SMBify Agency",
  publisher: "SMBify Agency",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://smbifyrank.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SMBify Rank | AI-Powered Website Builder",
    description: "Generate SEO-optimized websites for local businesses in minutes. No coding required.",
    url: process.env.NEXTAUTH_URL || "https://smbifyrank.com",
    siteName: "SMBify Rank",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SMBify Rank - AI Website Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SMBify Rank | AI-Powered Website Builder",
    description: "Generate SEO-optimized websites for local businesses in minutes. No coding required.",
    images: ["/og-image.png"],
    creator: "@smbify",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo-circle.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Navigation />
              <main className="page-enter">
                {children}
              </main>
              <Footer />
              <BackToTop />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

