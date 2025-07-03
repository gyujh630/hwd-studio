import React from "react";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages < 1) return null;
  return (
    <nav className="flex gap-2">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={[
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
            page === i + 1
              ? "bg-gray-900 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          ].join(" ")}
          aria-current={page === i + 1 ? "page" : undefined}
        >
          {i + 1}
        </button>
      ))}
    </nav>
  );
} 