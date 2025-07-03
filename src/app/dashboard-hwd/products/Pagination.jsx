import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  // 버튼 비활성화 조건: 1페이지만 있거나, 첫/마지막 페이지
  const isFirst = page === 1;
  const isLast = page === totalPages;
  const onlyOne = totalPages <= 1;

  const btnClass = (disabled) =>
    `p-2 rounded transition-colors ${
      disabled
        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
        : "bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600 cursor-pointer"
    }`;

  return (
    <div className="flex justify-center gap-2 mt-8">
      <button
        className={btnClass(isFirst || onlyOne)}
        onClick={() => onPageChange(1)}
        disabled={isFirst || onlyOne}
        aria-label="맨 앞으로"
      >
        <ChevronsLeft size={20} />
      </button>
      <button
        className={btnClass(isFirst || onlyOne)}
        onClick={() => onPageChange(page - 1)}
        disabled={isFirst || onlyOne}
        aria-label="이전"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="px-4 py-2 select-none text-gray-700 font-semibold">
        {page} / {totalPages}
      </span>
      <button
        className={btnClass(isLast || onlyOne)}
        onClick={() => onPageChange(page + 1)}
        disabled={isLast || onlyOne}
        aria-label="다음"
      >
        <ChevronRight size={20} />
      </button>
      <button
        className={btnClass(isLast || onlyOne)}
        onClick={() => onPageChange(totalPages)}
        disabled={isLast || onlyOne}
        aria-label="맨 뒤로"
      >
        <ChevronsRight size={20} />
      </button>
    </div>
  );
} 