"use client";
import Link from "next/link";
import "../globals.css";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";



export default function AdminLayout({ children }) {
  // 클라이언트 컴포넌트로 동작하도록 use client 선언
  // 로그아웃 버튼 클릭 시 signOut 및 라우팅
  if (typeof window !== "undefined") {
    // use client
  }
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const router = typeof window !== "undefined" ? require("next/navigation").useRouter() : null;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      // 로그인 안된 경우 로그인 페이지로 리다이렉트
      if (!user) {
        // 현재 경로가 /dashboard-hwd/login 이 아니면 리다이렉트
        if (window.location.pathname !== "/dashboard-hwd/login") {
          router.push("/dashboard-hwd/login");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/dashboard-hwd/login");
  };

  if (isLoggedIn === null) {
    // 인증 상태 확인 중
    return <div className="flex items-center justify-center h-screen text-gray-500">로딩 중...</div>;
  }

  return (
    <div className="flex h-screen">
      {isLoggedIn && (
        <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 justify-between">
          <div>
            <h3 className="text-xl font-bold mb-8">할리우드 관리자페이지</h3>
            <nav className="flex flex-col gap-4">
              <Link href="/dashboard-hwd">대시보드 홈</Link>
              <Link href="/dashboard-hwd/site-config">사이트 관리</Link>
              <Link href="/dashboard-hwd/products">상품 관리</Link>
              <Link href="/dashboard-hwd/custom-orders">주문제작 문의 관리</Link>
              <Link href="/dashboard-hwd/custom-made-gallery">주문제작 갤러리 관리</Link>
            </nav>
          </div>
          <button
            className="mt-8 w-full text-left"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </aside>
      )}
      <main className="flex-1 bg-gray-50 p-10 overflow-auto">{children}</main>
    </div>
  );
} 