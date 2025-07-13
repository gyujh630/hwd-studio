import { getGallery } from "@/lib/firebaseSiteConfig";
import CustomMadeGalleryClientSection from "./CustomMadeGalleryClientSection";
import Footer from "@/components/common/Footer";

// 동적 렌더링 강제 설정
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: "주문제작 상품 | HOLLYWOOD STUDIO",
  description: "할리우드의 주문제작 상품들을 소개합니다.",
  keywords: "주문제작, 수제가구, 갤러리, 할리우드, 맞춤가구, 원목가구, 프리미엄 가구, 인테리어, 가구 추천, 주문제작 사례"
};

export default async function CustomMadeGalleryPage() {
  const gallery = await getGallery();
  return (
    <div className="min-h-screen flex flex-col metallic-base-bg overflow-auto">
      <CustomMadeGalleryClientSection gallery={gallery} />
      <Footer />
    </div>
  );
} 