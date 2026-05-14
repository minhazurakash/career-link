import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://career-link.vercel.app"),
  title: {
    default: "CareerLink - Job Portal",
    template: "%s | CareerLink",
  },
  description:
    "CareerLink helps candidates find jobs that match their interests and skills.",
  applicationName: "CareerLink",
  keywords: [
    "CareerLink",
    "job portal",
    "find jobs",
    "hiring",
    "career platform",
  ],
  openGraph: {
    title: "CareerLink - Job Portal",
    description:
      "Find jobs that match your interests and skills with CareerLink.",
    url: "/",
    siteName: "CareerLink",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerLink - Job Portal",
    description:
      "Find jobs that match your interests and skills with CareerLink.",
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
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
