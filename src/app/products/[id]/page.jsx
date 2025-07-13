import { fetchProductById } from "@/lib/firebaseProduct";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/common/Footer";
import IdusBuyButton from "@/components/common/IdusBuyButton";
import KakaoButtonForProductDetail from "@/components/common/KakaoButtonForProductDetail";
import ProductDetailGallery from "./ProductDetailGallery";

// 동적 렌더링 강제 설정
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(props) {
  const { params } = await props;
  const resolvedParams = await params;
  const product = await fetchProductById(resolvedParams.id);
  const name = product?.name || "상품 상세";
  const desc = product?.description?.slice(0, 80) || "할리우드 공방 수제가구";
  return {
    title: `${name} | HOLLYWOOD STUDIO`,
    description: desc,
    keywords: `수제가구, 원목가구, 맞춤가구, 프리미엄 가구, 할리우드 스튜디오, ${name}, 인테리어, 가구 추천, 주문제작 가구`,
  };
}

export default async function ProductDetailPage(props) {
  const { params } = await props;
  const resolvedParams = await params;
  const product = await fetchProductById(resolvedParams.id);
  if (!product) {
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
            상품 정보를 불러올 수 없습니다.
          </h3>
        </div>
      </div>
    );
  }
  const { name, price, description, idusUrl, photos = [], sizes } = product;
  return (
    <div className="min-h-screen flex flex-col overflow-auto">
      <main className="flex-1">
        <div className="w-full metallic-base-bg pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-36 w-full">
            {/* 상단 공통 영역: 뒤로가기 버튼 */}
            <div className="flex items-center mb-6">
              <a
                href="/products"
                className="md:flex hidden items-center gap-2 text-gray-500 font-medium text-sm cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>목록으로</span>
              </a>
            </div>
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
              {/* 좌측: 이미지 갤러리 및 색상 선택 (클라이언트 컴포넌트) */}
              <ProductDetailGallery photos={photos} name={name} />
              {/* 우측: 상품 정보 */}
              <div className="flex flex-col h-full max-h-[600px] lg:max-h-[700px] px-2 lg:px-0">
                <div className="flex flex-col justify-start space-y-6 pr-1">
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
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((size, idx) => (
                          <div
                            key={idx}
                            className="py-2 px-3 text-center text-xs font-medium border border-gray-200 bg-white text-gray-500 rounded-sm whitespace-nowrap"
                          >
                            {size}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* 색상 옵션 */}
                  {Array.isArray(photos) && photos.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-900">
                        색상 옵션
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {photos.map((photo, idx) => (
                          <div
                            key={idx}
                            className="py-2 px-3 text-center text-xs font-medium border border-gray-200 bg-white text-gray-500 rounded-sm whitespace-nowrap"
                          >
                            {photo.colorName}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* 구매/문의 버튼 영역 */}
                <div className="flex flex-col gap-3 mb-6 z-50 mt-6">
                  <KakaoButtonForProductDetail />
                  <IdusBuyButton idusUrl={idusUrl} />
                </div>
              </div>
            </div>
            <div className="w-full max-w-4xl mx-auto px-4 my-16">
              <div className="space-y-2 flex flex-col">
                <h3 className="text-sm font-semibold text-gray-900">상품 설명</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line flex-1">
                  {description}
                </p>
              </div>
            </div>

            {/* 쇼핑몰 상세페이지 이미지 */}
            {Array.isArray(product.detailImages) && product.detailImages.length > 0 && (
              <div className="w-full mx-autoflex flex-col">
                {product.detailImages.map((url, idx) => (
                  <div key={idx} className="w-full flex justify-center">
                    <img
                      src={url}
                      alt={`상세페이지 이미지 ${idx + 1}`}
                      className="w-full object-contain bg-white"
                      style={{ maxHeight: 600 }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
