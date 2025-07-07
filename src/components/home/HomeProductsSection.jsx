"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageCarousel from "@/components/common/ImageCarousel";
import { fetchSectionConfig } from "@/lib/firebaseSiteConfig";

export default function HomeProductsSection({ vh }) {
  const router = useRouter();
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchSectionConfig("productSection");
        if (!ignore) setSection(data);
      } catch {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  if (loading) return null;
  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;
  if (!section) return null;

  return (
    <>
      <section
        style={{ height: vh, scrollSnapAlign: "start" }}
        className="flex flex-col lg:flex-row items-center justify-center px-8 gap-12 metallic-base-bg relative overflow-hidden"
      >
        {/* 배경 장식 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        {/* 왼쪽: 이미지 슬라이더 */}
        <div className="relative">
          <ImageCarousel
            images={section.images || []}
            imageClassName="object-cover"
          />
        </div>

        {/* 오른쪽: 텍스트 + 버튼 */}
        <div className="text-center lg:text-left space-y-6 max-w-lg">
          <div className="space-y-4">
            <h2 className="text-xl md:text-3xl lg:text-5xl font-bold leading-tight tracking-tight">
              {section.titles?.[0] || "세상에 없던 가구."}
              <br />
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {section.titles?.[1] || "할리우드에서"}
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-gray-800 to-gray-400 mx-auto lg:mx-0 rounded-full" />
          </div>

          <p className="md:leading-7 md:text-base text-sm text-black/80">
            {section.descs?.[0] || "공간에 가치를 더하는 가구를 만듭니다."}
            <br />
            {section.descs?.[1] || "독창적인 디자인과 정밀한 제작 공법을 적용하여"}
            <br />
            {section.descs?.[2] || "차별화된 가구를 제작하고 있습니다."}
          </p>

          <p className="text-xs text-gray-500">
            {section.caption || "· 모든 제품은 100% 핸드메이드로 제작됩니다."}
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
            <button className="btn-primary w-full font-semibold" onClick={() => router.push("/products")}>제품 보러가기</button>
          </div>
        </div>
      </section>
    </>
  );
}
