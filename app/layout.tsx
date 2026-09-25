import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trngtnm.github.io"),
  title: {
    default: "Tin Mai — Software Engineer",
    template: "%s · Tin Mai",
  },
  description:
    "Computer Science student building software across AI/ML, mobile development, backend systems, and data.",
  openGraph: {
    title: "Tin Mai — Software Engineer",
    description:
      "Computer Science student building software across AI/ML, mobile development, backend systems, and data.",
    url: "https://trngtnm.github.io",
    siteName: "Tin Mai Portfolio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Tin Mai — Software Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tin Mai — Software Engineer",
    description:
      "Computer Science student building software across AI/ML, mobile development, backend systems, and data.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg-primary font-sans text-text-primary">
        {children}
      </body>
    </html>
  );
}
