import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import '@rainbow-me/rainbowkit/styles.css';

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
});

export const metadata: Metadata = {
  title: "Pot of Gold - Win 5$ Instantly",
  description: "Join the Pot of Gold 🍀! A provably fair micro-lottery on Base. 6 players enter, 1 winner takes all. Are you feeling lucky today?",
  manifest: "/manifest.json",
  openGraph: {
    title: "Pot of Gold - Win 5$ Instantly 🍀",
    description: "6 players enter, 1 winner takes all. Provably fair on Base.",
    images: ["https://pot-of-gold-web.vercel.app/splash.png"],
  },
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://pot-of-gold-web.vercel.app/splash.png",
      button: {
        title: "Play Pot of Gold",
        action: {
          type: "launch_frame",
          name: "Pot of Gold",
          url: "https://pot-of-gold-web.vercel.app/",
          splashImageUrl: "https://pot-of-gold-web.vercel.app/splash.png",
          splashBackgroundColor: "#18181b"
        }
      }
    })
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} font-pixel antialiased bg-retro-gray text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
