"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const images = ["/images/furnitures/fun1.png", "/images/furnitures/fun2.png"];

export default function HomeProductsSection({ vh }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const prev = () =>
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  const next = () => setCurrentIdx((prev) => (prev + 1) % images.length);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <section
        style={{ height: vh, scrollSnapAlign: "start" }}
        className="flex flex-col lg:flex-row items-center justify-center px-8 gap-12 metallic-base-bg relative overflow-hidden"
      >
        {/* 배경 장식 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        {/* 왼쪽: 이미지 슬라이더 */}
        <div
          className={`relative transition-all duration-1000 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-20 opacity-0"
          }`}
        >
          <div className="relative w-88 h-72 md:w-120 md:h-92 group">
            {/* 메인 이미지 */}
            <div className="relative w-full h-full bg-gradient-to-br from-gray-50/50 to-gray-200/50 rounded-2xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10" />

              {/* 이미지 컨테이너 - 슬라이드 효과 */}
              <div
                className="flex transition-transform duration-700 ease-out w-full h-full"
                style={{ transform: `translateX(-${currentIdx * 100}%)` }}
              >
                {images.map((src, idx) => (
                  <div
                    key={idx}
                    className="w-full h-full flex-shrink-0 relative"
                  >
                    <Image
                      src={src}
                      alt={`Furniture ${idx}`}
                      fill
                      className="object-contain p-12 transition-transform duration-700 group-hover:scale-105"
                      sizes="200px"
                    />
                  </div>
                ))}
              </div>

              {/* 좌우 화살표 - 사진 안에 위치 */}
              <button
                onClick={prev}
                className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-300 sm:opacity-0 sm:group-hover:opacity-100 opacity-100 hover:scale-110 z-20"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={next}
                className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-300 sm:opacity-0 sm:group-hover:opacity-100 opacity-100 hover:scale-110 z-20"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* 인디케이터 */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    idx === currentIdx
                      ? "bg-gray-800 w-6"
                      : "bg-gray-400 hover:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽: 텍스트 + 버튼 */}
        <div
          className={`text-center lg:text-left space-y-6 max-w-lg transition-all duration-1000 delay-300 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-20 opacity-0"
          }`}
        >
          <div className="space-y-4">
            <h2 className="text-xl md:text-3xl lg:text-5xl font-bold leading-tight tracking-tight">
              세상에 없던 가구.
              <br />
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                할리우드에서
              </span>
            </h2>

            <div className="w-16 h-1 bg-gradient-to-r from-gray-800 to-gray-400 mx-auto lg:mx-0 rounded-full" />
          </div>

          <p className="md:leading-7 md:text-base text-sm text-black/80">
            공간에 가치를 더하는 가구를 만듭니다.
            <br />
            독창적인 디자인과 정밀한 제작 공법을 적용하여
            <br />
            차별화된 가구를 제작하고 있습니다.
          </p>

          <p className="text-xs text-gray-500">
            · 모든 제품은 <strong>100% 핸드메이드</strong>로 제작됩니다.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
            <button className="btn-primary w-full font-semibold" onClick={() => router.push("/products")}>제품 보러가기</button>
            {/* <button className="btn-sub">카탈로그 보기</button> */}
          </div>
        </div>
      </section>

      <style jsx>{``}</style>
    </>
  );
}
