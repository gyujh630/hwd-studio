"use client";
import { useState, useEffect } from "react";

export default function ProductDetailGallery({ photos, name, initialColorIndex = null }) {
  // 초기 상태를 더 빠르게 설정
  const getInitialIndex = () => {
    if (!photos?.length) return 0;
    
    // URL 파라미터로 전달된 색상 인덱스가 있으면 그것을 사용
    if (initialColorIndex !== null && initialColorIndex >= 0 && initialColorIndex < photos.length) {
      return initialColorIndex;
    }
    
    // 기본값: 썸네일이 있으면 썸네일, 없으면 첫 번째
    const thumbIdx = photos.findIndex((p) => p.isThumbnail);
    return thumbIdx >= 0 ? thumbIdx : 0;
  };

  const [selectedIdx, setSelectedIdx] = useState(getInitialIndex);

  // 이미지 미리 불러오기 (preload) - 성능 최적화
  useEffect(() => {
    if (photos && Array.isArray(photos) && photos.length > 0) {
      // 선택된 이미지부터 먼저 로드
      const selectedPhoto = photos[selectedIdx];
      if (selectedPhoto?.fileUrl) {
        const img = new window.Image();
        img.src = selectedPhoto.fileUrl;
      }
      
      // 나머지 이미지들도 백그라운드에서 로드
      photos.forEach((photo, idx) => {
        if (idx !== selectedIdx && photo?.fileUrl) {
          const img = new window.Image();
          img.src = photo.fileUrl;
        }
      });
    }
  }, [photos, selectedIdx]);

  const selectedPhoto = photos[selectedIdx];

  return (
    <div className="flex flex-col mb-8 lg:mb-0">
      {/* 메인 이미지 */}
      <div className="relative w-full max-w-xs sm:max-w-md mx-auto lg:max-w-none aspect-square bg-white shadow-lg overflow-hidden mb-4">
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10"></div>
        {selectedPhoto?.fileUrl ? (
          <img
            src={selectedPhoto.fileUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
      {/* 색상 선택 */}
      {photos.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {photos.map((photo, idx) => (
            <button
              key={idx}
              title={photo.colorName}
              className={[
                "w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-150",
                idx === selectedIdx
                  ? "border-2 border-black scale-110"
                  : "border border-gray-300 hover:scale-105",
              ].join(" ")}
              style={{ background: photo.colorValue }}
              onClick={() => setSelectedIdx(idx)}
            >
              <span className="sr-only">{photo.colorName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 