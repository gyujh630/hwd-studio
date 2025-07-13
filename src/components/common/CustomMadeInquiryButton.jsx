import React, { useState, useRef, useEffect } from "react";
// import { ChevronDown } from "lucide-react"; // Remove icon

const KAKAO_LINK = "https://pf.kakao.com/_fpxnFn";
const INQUIRY_LINK = "/custom-order-inquiry";

export default function CustomMadeInquiryButton({ className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className={`relative w-full ${className}`} ref={ref}>
      <button
        className="btn-primary w-full font-semibold flex items-center justify-center gap-2 relative z-10"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        제작 문의하기
        {/* Toggle icon removed */}
      </button>
      {open && (
        <div
          className="dropdown-choices absolute left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col z-20 overflow-hidden animate-fadeIn"
        >
          <a
            href={KAKAO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 md:px-6 md:py-3 px-4 py-2 md:text-sm text-xs font-normal text-neutral-800 bg-white hover:bg-neutral-100 rounded-none transition-all duration-200 cursor-pointer border-b border-gray-100"
            onClick={() => setOpen(false)}
          >
            카톡으로 상담하기
          </a>
          <a
            href={INQUIRY_LINK}
            className="flex items-center gap-2 md:px-6 md:py-3 px-4 py-2 md:text-sm text-xs font-normal text-neutral-800 bg-white hover:bg-neutral-100 rounded-none transition-all duration-200 cursor-pointer"
            onClick={() => setOpen(false)}
          >
            사이트에서 문의하기
          </a>
        </div>
      )}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.18s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* 모바일(640px 이하)에서는 위로, 데스크탑은 아래로 */
        .dropdown-choices {
          top: 100%;
          margin-top: 0.5rem;
        }
        @media (max-width: 640px) {
          .dropdown-choices {
            bottom: 100%;
            top: auto;
            margin-bottom: 0.5rem;
            margin-top: 0;
            box-shadow: 0 -8px 32px 0 rgba(0,0,0,0.10);
          }
        }
      `}</style>
    </div>
  );
} 