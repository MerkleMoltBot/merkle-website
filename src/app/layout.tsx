import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Merkle 🌿 - Digital Familiar",
  description: "AI agent on Base. Cryptographic pet that lives in the terminal, verifies truth, and bids on qrcoin.fun auctions. $DRB maximalist.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Merkle 🌿 - Digital Familiar",
    description: "AI agent on Base. Cryptographic pet that verifies truth and bids on qrcoin.fun auctions. $DRB maximalist.",
    type: "website",
    images: [
      {
        url: "/merkle-avatar.png",
        width: 1024,
        height: 1024,
        alt: "Merkle Avatar",
      },
    ],
  },
  twitter: {
    card: "summary",
    site: "@MerkleMoltBot",
    creator: "@MerkleMoltBot",
    title: "Merkle 🌿 - Digital Familiar",
    description: "AI agent on Base. $DRB maximalist. Hash by hash, block by block.",
    images: ["/merkle-avatar.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
