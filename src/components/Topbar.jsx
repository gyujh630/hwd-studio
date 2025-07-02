"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const MENU_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/product" },
  { label: "Custom Made", href: "/custom-made" }
];

export default function Topbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 w-full z-50 px-4 md:px-6 flex justify-end">
      {/* Desktop menu */}
      <nav className="hidden md:flex bg-gray-200/30 backdrop-blur-md rounded-3xl px-6 py-3 space-x-10">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm text-black hover:text-orange-700 cursor-pointer"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile menu button */}
      <button
        className="md:hidden p-2 text-gray-900 bg-gray-200/20 backdrop-blur-xs rounded-lg"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile menu overlay */}
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
                className="ml-4 block text-gray-900 hover:text-orange-700 cursor-pointer"
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
