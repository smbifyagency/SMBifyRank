import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMBify Rank | AI-Powered Website Builder for Local Businesses",
  description: "Generate SEO-optimized websites for local businesses in minutes. AI-powered content, location pages, and one-click deployment.",
  keywords: "website builder, SEO, local business, AI, website generator",
  authors: [{ name: "SMBify", url: "https://smbify.agency" }],
  openGraph: {
    title: "SMBify Rank | AI-Powered Website Builder",
    description: "Generate SEO-optimized websites for local businesses in minutes.",
    type: "website",
    siteName: "SMBify Rank",
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
            <Navigation />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
