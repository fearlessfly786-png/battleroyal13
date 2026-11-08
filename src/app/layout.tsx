import type { Metadata, Viewport } from "next";
import {
  Anton,
  Barlow,
  Barlow_Condensed,
  Geist,
  Geist_Mono,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** LOBBY DASHBOARD fonts: Anton = display headings, Barlow Condensed =
 *  angled game-UI labels, Barlow = general dashboard sans. */
const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

const barlowCond = Barlow_Condensed({
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow-cond",
  subsets: ["latin"],
});

const barlow = Barlow({
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "three.js webgl - geometry - minecraft",
  description: "three.js minecraft demo set up in a Next.js workspace, ready for game conversion.",
  keywords: ["Z.ai", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "AI development", "React"],
  authors: [{ name: "Z.ai Team" }],
  icons: {
    icon: [
      {
        url: "/grasslands-6600.png",
        type: "image/png",
        sizes: "1024x1024",
      },
    ],
    apple: [
      {
        url: "/grasslands-6600.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
    shortcut: "/grasslands-6600.png",
  },
  openGraph: {
    title: "Z.ai Code Scaffold",
    description: "AI-powered development with modern React stack",
    url: "https://chat.z.ai",
    siteName: "Z.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Z.ai Code Scaffold",
    description: "AI-powered development with modern React stack",
  },
  /** Installed-app path to a maximized game: when the player uses
   *  "Add to Home Screen", RATFIRE launches with NO Safari chrome at all
   *  (the black-translucent status bar floats transparently over the
   *  canvas). Works together with the in-browser Fullscreen API
   *  auto-request in page.tsx and the web app manifest. */
  appleWebApp: {
    capable: true,
    title: "RATFIRE",
    statusBarStyle: "black-translucent",
  },
};

/** Mobile game viewport: no pinch-zoom / double-tap zoom interference with
 *  the touch controls, and `viewportFit: cover` exposes the iOS safe-area
 *  insets the touch HUD pads itself with. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${barlowCond.variable} ${barlow.variable} antialiased bg-background text-foreground overscroll-none`}
      >
        {children}
      </body>
    </html>
  );
}
