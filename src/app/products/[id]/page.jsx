"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProductById } from "@/lib/firebaseProduct";
import { ArrowLeft } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProductById(id);
        if (!ignore) {
          setProduct(data);
          // 썸네일이 있으면 그 인덱스, 없으면 0
          if (data?.photos?.length) {
            const thumbIdx = data.photos.findIndex((p) => p.isThumbnail);
            setSelectedIdx(thumbIdx >= 0 ? thumbIdx : 0);
          }
        }
      } catch (e) {
        setError("상품 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
    return () => {
      ignore = true;
    };
  }, [id]);

  // 이미지 미리 불러오기 (preload)
  useEffect(() => {
    if (product && Array.isArray(product.photos) && product.photos.length > 0) {
      product.photos.forEach((photo) => {
        if (photo?.fileUrl) {
          const img = new window.Image();
          img.src = photo.fileUrl;
        }
      });
    }
  }, [product]);

  if (loading)
    return (
      <div className="w-full min-h-screen metallic-base-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-700 border-t-transparent"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            오류가 발생했습니다
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );

  if (!product) return null;

  const { name, price, description, idusUrl, photos = [], sizes } = product;
  const selectedPhoto = photos[selectedIdx];

  return (
    <div className="w-full min-h-screen metallic-base-bg overflow-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-36 w-full">
        {/* 상단 공통 영역: 뒤로가기 버튼 */}
        <div className="flex items-center mb-6">
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="md:flex hidden items-center gap-2 text-gray-500 font-medium text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>목록으로</span>
          </button>
        </div>
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
          {/* 좌측: 이미지 갤러리 */}
          <div className="flex flex-col mb-8 lg:mb-0">
            {/* 메인 이미지 */}
            <div className="relative w-full max-w-xs sm:max-w-md mx-auto lg:max-w-none aspect-square bg-white shadow-lg overflow-hidden mb-4">
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10"></div>
              {selectedPhoto?.fileUrl ? (
                <img
                  src={selectedPhoto.fileUrl}
                  alt={name}
                  className="w-full h-full object-contain"
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
                      "w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer",
                      idx === selectedIdx
                        ? "border-2 border-black"
                        : "border border-gray-300"
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

          {/* 우측: 상품 정보 */}
          <div className="flex flex-col h-full min-h-[400px] max-h-[600px] lg:max-h-[700px] px-2 lg:px-0">
            <div className="flex flex-col justify-start space-y-6 overflow-auto pr-1">
              {/* 제품명 & 가격 */}
              <div className="space-y-3">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                  {name}
                </h1>
                <div className="flex items-baseline space-x-2">
                  <span className="text-base lg:text-lg font-normal text-stone-900">
                    ₩{price?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* 사이즈 옵션 */}
              {Array.isArray(sizes) && sizes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    사이즈 옵션
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1">
                    {sizes.map((size, idx) => (
                      <div
                        key={idx}
                        className="py-1 px-2 text-center text-sm font-medium border border-gray-200 bg-white text-gray-500 rounded-sm"
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 상품 설명 */}
              <div className="space-y-2 flex flex-col md:min-h-32 mb-8">
                <h3 className="text-sm font-semibold text-gray-900">
                  상품 설명
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line flex-1">
                  {description}
                </p>
              </div>
            </div>

            {idusUrl && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
