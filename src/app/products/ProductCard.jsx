"use client";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const router = useRouter();
  const thumbnail = Array.isArray(product.photos) && product.photos.length > 0
    ? product.photos.find((p) => p.isThumbnail)?.fileUrl || product.photos[0]?.fileUrl
    : "";

  const handleColorClick = (colorIndex) => {
    // 즉시 네비게이션
    router.push(`/products/${product.id}?color=${colorIndex}`);
  };

  return (
    <div className="p-2 flex flex-col gap-2">
      {thumbnail && (
        <div
          className="relative w-full aspect-square overflow-hidden mb-2 shadow-lg bg-white cursor-pointer group"
          onClick={() => router.push(`/products/${product.id}`)}
        >
          <img
            src={thumbnail}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      )}
      <div
        className="text-lg font-semibold underline cursor-pointer w-fit"
        onClick={() => router.push(`/products/${product.id}`)}
      >
        {product.name}
      </div>
      <div className="text-gray-900 text-sm">
        ₩{product.price?.toLocaleString()}
      </div>
      <div className="flex gap-1 mt-auto">
        {product.photos?.map((photo, idx) => (
          <span
            key={idx}
            title={photo.colorName}
            className="w-5 h-5 rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform duration-150 active:scale-95"
            style={{ background: photo.colorValue }}
            onClick={(e) => {
              e.stopPropagation();
              handleColorClick(idx);
            }}
          />
        ))}
      </div>
    </div>
  );
} 