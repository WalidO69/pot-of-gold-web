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

import { APP_URL } from "@/config";

export const metadata: Metadata = {
  title: "Pot of Gold - Win 5$",
  description: "Join the Pot of Gold 🍀! A provably fair micro-lottery on Base. 6 players enter, 1 winner takes all. Are you feeling lucky today?",
  manifest: "/manifest.json",
  openGraph: {
    title: "Pot of Gold - Win 5$ 🍀",
    description: "6 players enter, 1 winner takes all. Provably fair on Base.",
    images: [`${APP_URL}/daily-share-post.png`],
  },
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `${APP_URL}/daily-share-post.png`,
      button: {
        title: "Play Pot of Gold",
        action: {
          type: "launch_frame",
          name: "Pot of Gold",
          url: `${APP_URL}/`,
          splashImageUrl: `${APP_URL}/splash.png`,
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
