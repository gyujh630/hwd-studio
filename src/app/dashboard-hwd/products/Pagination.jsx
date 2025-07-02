export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center gap-2 mt-8">
      <button
        className="btn-sub"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        이전
      </button>
      <span className="px-4 py-2">{page} / {totalPages}</span>
      <button
        className="btn-sub"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        다음
      </button>
    </div>
  );
} 