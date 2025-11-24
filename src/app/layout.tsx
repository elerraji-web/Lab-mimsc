import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MIMSC Lab",
  description: "Modern Next.js scaffold optimized . Built with TypeScript, Tailwind CSS, and shadcn/ui.",
  keywords: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "AI development", "React"],
  authors: [{ name: "E. ERRAJI Team" }],
  icons: {
    icon: "./logo.svg",
  },
  openGraph: {
    title: "MIMSC",
    description: "AI-powered development with modern React stack",
    url: "",
    siteName: "mimsc.top",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Scaffold",
    description: "AI-powered development with modern React stack",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <Sonner />
      </body>
    </html>
  );
}
