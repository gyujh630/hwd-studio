import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Topbar from "@/components/common/Topbar"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HOLLYWOOD STUDIO - 수제가구공방",
  description: "HOLLYWOOD STUDIO에서 만드는 아름다운 수제가구. 개성 있는 디자인과 정성스러운 제작으로 당신의 공간을 특별하게 만들어드립니다.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <Topbar />
        {children}
      </body>
    </html>
  );
}

