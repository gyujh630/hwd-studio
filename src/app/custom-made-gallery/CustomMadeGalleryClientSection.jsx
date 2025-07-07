"use client";
import { useState, useEffect } from "react";
import CustomMadeInquiryButton from "@/components/common/CustomMadeInquiryButton";
import Image from "next/image";

function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + "..." : str;
}

export default function CustomMadeGalleryClientSection({ gallery }) {
  const [modal, setModal] = useState(null);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!modal) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") setModal(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-24 pb-8 flex flex-col items-end">
      <div className="w-full flex flex-col items-center mb-8">
        <h2 className="text-xl font-[500] text-center">Custom Made Gallery</h2>
        <p className="text-gray-500 text-sm md:text-base mt-2 text-center">할리우드의 주문제작 상품들을 소개합니다.</p>
      </div>
      <div className="w-full flex justify-end mb-8">
        <CustomMadeInquiryButton className="!w-[200px]" />
      </div>
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-16">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="relative group aspect-square overflow-hidden shadow-md bg-white cursor-pointer"
            onClick={() => setModal(item)}
          >
            <Image
              src={item.imageUrl}
              alt={truncate(item.desc, 30)}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end">
              <span className="w-full text-xs md:text-sm text-white p-2 truncate">
                {truncate(item.desc, 32)}
              </span>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setModal(null)}>
          <div className="relative bg-transparent max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <Image
              src={modal.imageUrl}
              alt={modal.desc}
              width={800}
              height={800}
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center text-white text-base font-medium px-2 break-words">
              {modal.desc}
            </div>
            <button
              className="absolute top-2 right-2 text-white bg-black/60 rounded-full p-2 hover:bg-black/80 transition cursor-pointer"
              onClick={() => setModal(null)}
              aria-label="닫기"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 