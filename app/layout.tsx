import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Absensi Siswa",
  description: "Aplikasi absensi siswa untuk guru / wali kelas.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-linear-to-br from-blue-100 via-indigo-50 to-purple-100 font-sans">
        {children}
      </body>
    </html>
  );
}
