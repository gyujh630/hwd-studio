import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Topbar from "@/components/common/Topbar";
import KakaoConsultButtonGuard from "@/components/common/KakaoConsultButtonGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HOLLYWOOD STUDIO | 수제가구공방 할리우드",
  description: "특별함과 아름다움이 조화를 이루는, 세상에 하나뿐인 가구를 만듭니다.",
  openGraph: {
    title: "HOLLYWOOD STUDIO | 수제가구공방 할리우드",
    description: "특별함과 아름다움이 조화를 이루는, 세상에 하나뿐인 가구를 만듭니다.",
    siteName: "HOLLYWOOD STUDIO",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 628,
        alt: "HOLLYWOOD STUDIO | 수제가구공방 할리우드"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "HOLLYWOOD STUDIO | 수제가구공방 할리우드",
    description: "특별함과 아름다움이 조화를 이루는, 세상에 하나뿐인 가구를 만듭니다.",
    images: [
      {
        url: "/twitter-image.png",
        width: 1200,
        height: 628,
        alt: "HOLLYWOOD STUDIO | 수제가구공방 할리우드"
      }
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <Topbar />
        {children}
        <KakaoConsultButtonGuard />
      </body>
    </html>
  );
}

