import type { Metadata } from "next";
import { Inter, Work_Sans } from "next/font/google";
import StyledComponentsRegistry from "@/lib/styled-registry";
import { ErrorBoundary } from "@/components/error-boundary";

import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Solace Advocates - Find Your Healthcare Advocate",
  description: "Find an advocate who will help untangle your healthcare—covered by Medicare. Search by name, specialty, location, and more.",
  keywords: ["healthcare", "advocate", "medicare", "health insurance", "patient advocacy"],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Solace Advocates - Find Your Healthcare Advocate",
    description: "Find an advocate who will help untangle your healthcare—covered by Medicare.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${workSans.variable}`}>
        <StyledComponentsRegistry>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
