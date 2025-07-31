import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { siteConfig } from "@/lib/config";
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

// Amplify設定の初期化
Amplify.configure(outputs);

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ポートフォリオサイト | 27卒IT職採用",
  description: "技術力と人間性を両立したIT人材としてのポートフォリオサイト。Next.js + TypeScript で構築された現代的なWebアプリケーション。",
  keywords: ["ポートフォリオ", "Next.js", "React", "TypeScript", "27卒", "IT", "エンジニア"],
  authors: [{ name: siteConfig.personal.name }],
  creator: siteConfig.personal.name,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteConfig.url,
    title: "ポートフォリオサイト | 27卒IT職採用",
    description: "技術力と人間性を両立したIT人材としてのポートフォリオサイト",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "ポートフォリオサイト | 27卒IT職採用",
    description: "技術力と人間性を両立したIT人材としてのポートフォリオサイト",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-secondary-900">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="border-t border-secondary-200 py-8">
          <div className="container mx-auto max-w-container-xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-secondary-600 text-sm">
                © 2025 {siteConfig.name}. Built with Next.js and Tailwind CSS.
              </p>
              <div className="flex space-x-4">
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-600 hover:text-secondary-900 transition-colors"
                >
                  GitHub
                </a>
                <a
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-600 hover:text-secondary-900 transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
