"use client";
import Link from "next/link";
import "../globals.css";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user && pathname !== "/dashboard-hwd/login") {
        router.replace("/dashboard-hwd/login");
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [router, pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/dashboard-hwd/login");
  };

  if (!authChecked && pathname !== "/dashboard-hwd/login") {
    return null; // 인증 체크 전에는 아무것도 렌더링하지 않음
  }

  // 로그인 페이지에서는 사이드바 없이 children만 렌더링
  if (pathname === "/dashboard-hwd/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8">관리자</h2>
          <nav className="flex flex-col gap-4">
            <Link href="/dashboard-hwd">대시보드 홈</Link>
            <Link href="/dashboard-hwd/products">상품 관리</Link>
            <Link href="/dashboard-hwd/handmade">핸드메이드 상품 관리</Link>
            <Link href="/dashboard-hwd/custom-orders">주문제작 문의 관리</Link>
          </nav>
        </div>
        <button
          className="mt-8 btn-sub w-full"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </aside>
      <main className="flex-1 bg-gray-50 p-10 overflow-auto">{children}</main>
    </div>
  );
} 