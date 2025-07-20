"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageCarousel from "@/components/common/ImageCarousel";
import CustomMadeInquiryButton from "@/components/common/CustomMadeInquiryButton";
import { fetchSectionConfig } from "@/lib/firebaseSiteConfig";

export default function HomeCustomMadeSection({ vh }) {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchSectionConfig("customMadeSection");
        if (!ignore) setSection(data);
      } catch {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
    load();
    setIsVisible(true);
    return () => { ignore = true; };
  }, []);

  if (loading) return null;
  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;
  if (!section) return null;

  return (
    <>
      <section
        style={{ height: vh, scrollSnapAlign: "start" }}
        className="flex flex-col lg:flex-row items-center justify-center px-8 md:gap-0 gap-12 metallic-base-bg relative overflow-hidden"
      >
        {/* 배경 장식 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

        {/* 왼쪽: 텍스트 + 버튼 */}
        <div
          className={`w-full text-center lg:text-left space-y-6 max-w-lg transition-all duration-1000 delay-300 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-20 opacity-0"
          } order-2 lg:order-1`}
        >
          <div className="space-y-4">
            <h2 className="text-xl md:text-3xl lg:text-5xl font-bold leading-tight tracking-tight">
              {section.titles?.[0] || "공간과 취향을 고려한"}
              <br />
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {section.titles?.[1] || "1:1 맞춤 제작"}
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-gray-800 to-gray-400 mx-auto lg:mx-0 rounded-full" />
          </div>

          <p className="md:leading-7 md:text-base text-sm text-black/80">
            {section.descs?.[0] || "원하는 디자인, 사이즈, 색상까지"}
            <br />
            {section.descs?.[1] || "세상에 단 하나뿐인 가구를 제작해드립니다."}
            <br />
            {section.descs?.[2] || "라이프스타일과 공간에 꼭 맞는 맞춤 제작 서비스를 제공합니다."}
          </p>

          <p className="text-xs text-gray-500">
            {section.caption || "· 모든 과정은 1:1 상담을 통해 진행됩니다."}
          </p>

          <div className="md:w-full flex flex-row justify-center lg:justify-start md:gap-4 gap-2 pt-4">
            <button className="btn-sub w-full max-w-50 font-semibold" onClick={() => router.push("/custom-made-gallery")}>맞춤제작 사례</button>
            <CustomMadeInquiryButton />
          </div>
        </div>

        {/* 오른쪽: 이미지 슬라이더 */}
        <div
          className={`relative transition-all duration-1000 ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
          } order-1 lg:order-2`}
        >
          <ImageCarousel
            media={section.media ? section.media : (section.images || []).map(src => ({ type: "image", src }))}
            imageClassName="object-cover"
            overlay={() => <div className="absolute inset-0 bg-black/30 sm:bg-black/30 z-10 pointer-events-none" />}
          />
        </div>
      </section>
    </>
  );
}
