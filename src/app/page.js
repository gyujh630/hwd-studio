import FullPageScroll from "@/components/common/FullPageScroll";
import Footer from "@/components/common/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <FullPageScroll />
      </main>
      <Footer />
    </div>
  );
} 