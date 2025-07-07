import React from "react";

export default function IdusBuyButton({ idusUrl }) {
  if (!idusUrl) return null;
  return (
    <a
      href={idusUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform md:hover:scale-105 hover:from-orange-600 hover:to-orange-800"
    >
      <svg
        className="w-4 h-4 mr-2 group-hover:animate-pulse"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      아이디어스에서 구매하기
    </a>
  );
} 