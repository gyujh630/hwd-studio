import React from "react";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages < 1) return null;
  return (
    <nav className="flex gap-2 items-center">
      {/* 처음 페이지 */}
      <button
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        className={[
          "w-8 h-8 flex items-center justify-center rounded-full cursor-pointer",
          page === 1 ? "opacity-30 cursor-default" : "hover:bg-gray-200"
        ].join(" ")}
        aria-label="First page"
      >
        <ChevronsLeft size={18} />
      </button>
      {/* 이전 페이지 */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={[
          "w-8 h-8 flex items-center justify-center rounded-full cursor-pointer",
          page === 1 ? "opacity-30 cursor-default" : "hover:bg-gray-200"
        ].join(" ")}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={[
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer",
            page === i + 1
              ? "bg-gray-900 text-white"
              : "bg-transparent text-gray-700 hover:bg-gray-200"
          ].join(" ")}
          aria-current={page === i + 1 ? "page" : undefined}
        >
          {i + 1}
        </button>
      ))}
      {/* 다음 페이지 */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={[
          "w-8 h-8 flex items-center justify-center rounded-full cursor-pointer",
          page === totalPages ? "opacity-30 cursor-default" : "hover:bg-gray-200"
        ].join(" ")}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
      {/* 마지막 페이지 */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages}
        className={[
          "w-8 h-8 flex items-center justify-center rounded-full cursor-pointer",
          page === totalPages ? "opacity-30 cursor-default" : "hover:bg-gray-200"
        ].join(" ")}
        aria-label="Last page"
      >
        <ChevronsRight size={18} />
      </button>
    </nav>
  );
} 