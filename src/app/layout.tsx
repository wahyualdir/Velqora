import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { LanguageProvider } from "@/context/language-context";
import { ThemeAccentProvider } from "@/context/theme-accent-context";
import { PwaRegister } from "@/components/layout/pwa-register";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#0b0f19",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://velqora.app"),
  title: "Velqora — Modern Platform for Progressive Learning",
  description:
    "Platform digital modern untuk penyimpanan dan pengelolaan modul pembelajaran, tugas, ruang kelas, dan dokumen perkuliahan berbasis AI.",
  applicationName: "Velqora",
  authors: [{ name: "JOBLIB505 FORUM GROUP" }],
  generator: "Next.js",
  keywords: [
    "Velqora",
    "Learning Platform",
    "Modul Belajar",
    "Manajemen Kuliah",
    "Tugas Kuliah",
    "AI Tutor",
    "Education Platform",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Velqora",
  },
  openGraph: {
    title: "Velqora — Modern Platform for Progressive Learning",
    description:
      "Platform digital modern untuk penyimpanan dan pengelolaan modul pembelajaran, tugas, ruang kelas, dan dokumen perkuliahan berbasis AI.",
    siteName: "Velqora",
    images: [
      {
        url: "/logo-banner.png",
        width: 1200,
        height: 630,
        alt: "Velqora Learning Platform",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Velqora — Modern Platform for Progressive Learning",
    description:
      "Platform digital modern untuk penyimpanan dan pengelolaan modul pembelajaran, tugas, dan perkuliahan berbasis AI.",
    images: ["/logo-banner.png"],
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
    <html lang="id" suppressHydrationWarning className={`${inter.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <ThemeAccentProvider>
            <LanguageProvider>
              {children}
              <PwaRegister />
              <Toaster position="top-right" richColors />
            </LanguageProvider>
          </ThemeAccentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

