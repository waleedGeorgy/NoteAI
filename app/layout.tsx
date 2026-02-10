import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NoteAI",
  description: "Takes notes with the help of AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="relative min-h-screen bg-[radial-gradient(100%_80%_at_50%_0%,#0b1220_0%,#0a0a0b_60%,#060607_100%)] text-gray-200">
          {children}
          <Toaster position="bottom-right" reverseOrder={true} />
        </main>
      </body>
    </html>
  );
}
