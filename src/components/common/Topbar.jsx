"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Custom Made", href: "/custom-made" },
];

export default function Topbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (pathname?.startsWith("/dashboard-hwd")) return null;

  return (
    <header
      className={`fixed top-4 ${isHome ? "right-0" : "w-full left-0"} z-50 px-4 md:px-6 flex justify-end`}
    >
      <div className={`hidden sm:flex w-full items-center ${!isHome ? "justify-between" : "justify-end"} bg-gray-200/30 backdrop-blur-md rounded-3xl px-6 py-3`}>
        {!isHome && (
          <span className="font-bold tracking-widest text-stone-900">
            HOLLYWOOD STORE
          </span>
        )}
        <nav className="flex space-x-10">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "text-sm cursor-pointer",
                pathname === item.href ? "text-orange-700" : "text-black",
                "hover:text-orange-700"
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <button
        className="sm:hidden p-2 text-gray-900 bg-gray-200/20 backdrop-blur-xs rounded-lg cursor-pointer"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-lg z-50 flex flex-col p-6">
          <div className="flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-900 hover:text-orange-700 cursor-pointer"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="mt-8 space-y-8 text-lg">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "ml-4 block cursor-pointer",
                  pathname === item.href ? "text-orange-700" : "text-gray-900",
                  "hover:text-orange-700"
                ].join(" ")}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
} 