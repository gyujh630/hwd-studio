"use client";
import { usePathname } from "next/navigation";
import KakaoConsultButton from "./KakaoConsultButton";

export default function KakaoConsultButtonGuard() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard-hwd")) return null;
  return <KakaoConsultButton />;
} 