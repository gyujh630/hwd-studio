import CustomOrderInquiryForm from "./CustomOrderInquiryForm";
import Footer from "@/components/common/Footer";

export const metadata = {
  title: "주문제작 문의 | HOLLYWOOD STUDIO",
  description: "할리우드의 맞춤/주문제작 가구 문의 페이지입니다.",
  keywords: "주문제작, 맞춤가구, 문의, 수제가구, 할리우드, 프리미엄 가구, 상담, 인테리어, 가구 추천"
};

export default function CustomOrderInquiryPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-auto">
      <main className="flex-1">
        <div className="w-full mx-auto pt-4 md:pt-32 pb-12 px-4 overflow-auto metallic-base-bg">
          <div className="max-w-xl mx-auto rounded-2xl p-6 sm:p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">주문제작 문의</h1>
            <CustomOrderInquiryForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 