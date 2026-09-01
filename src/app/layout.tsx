import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { LanguageProvider } from "@/context/language-context";
import { ThemeAccentProvider } from "@/context/theme-accent-context";
import { ExperienceProvider } from "@/context/experience-context";
import { SurfaceProvider } from "@/context/surface-context";
import { PwaRegister } from "@/components/layout/pwa-register";
import { Toaster } from "sonner";

const inter = localFont({
  src: "./fonts/inter/Inter-Variable.woff2",
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = localFont({
  src: "./fonts/plus-jakarta-sans/PlusJakartaSans-Variable.woff2",
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono/JetBrainsMono-Variable.woff2",
  variable: "--font-mono",
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
    statusBarStyle: "default",
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
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Velqora" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                    (window.navigator && window.navigator.standalone === true) ||
                    (document.referrer && document.referrer.indexOf('android-app://') !== -1);
                  var surface = isStandalone ? 'app' : 'web';
                  document.documentElement.dataset.surface = surface;
                  document.documentElement.setAttribute('data-surface', surface);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <ThemeAccentProvider>
            <LanguageProvider>
              <SurfaceProvider>
                <ExperienceProvider>
                  {children}
                  <PwaRegister />
                  <Toaster position="top-right" richColors />
                </ExperienceProvider>
              </SurfaceProvider>
            </LanguageProvider>
          </ThemeAccentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

