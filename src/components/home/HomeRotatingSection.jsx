// components/home/HomeRotatingSection.jsx
import { ChevronDown } from "lucide-react";
import RotatingBoxesScene from "../RotatingBoxesScene";

export default function HomeRotatingSection({ vh }) {
  return (
    <section
      style={{ height: vh, scrollSnapAlign: "start" }}
      className="relative flex flex-col items-center justify-center overflow-hidden metallic-bg"
    >
      <div className="absolute inset-0 z-0">
        <RotatingBoxesScene />
      </div>

      <div className="z-10 text-center">
        <h1 className="text-6xl md:text-8xl font-extrabold text-orange-700 tracking-tight">
          HOLLYWOOD STORE
        </h1>
        <p className="mt-3 text-xs md:text-2xl font-bold text-orange-700 tracking-wide uppercase">
          Woodwork • Premium Furniture • Pop-up Interiors
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-semibold flex flex-col items-center animate-bounce text-sm pointer-events-none select-none">
        <ChevronDown size={28} className="text-orange-700" />
        <span className="mt-1 tracking-wide uppercase text-orange-700">
          아래로 스크롤하세요
        </span>
      </div>
    </section>
  );
}
