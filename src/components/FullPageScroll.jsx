"use client";

import { useEffect, useState } from "react";
import HomeRotatingSection from "./home/HomeRotatingSection";
import HomeProductsSection from "./home/HomeProductsSection";
import Footer from "./Footer";

export default function FullPageScroll() {
  const [vh, setVh] = useState("100vh");

  useEffect(() => {
    const setActualHeight = () => {
      const vhValue = window.innerHeight * 0.01;
      setVh(`${vhValue * 100}px`);
    };

    setActualHeight();
    window.addEventListener("resize", setActualHeight);
    return () => window.removeEventListener("resize", setActualHeight);
  }, []);

  return (
    <div
      className="scroll-container scrollbar-hide"
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
      }}
    >
      {/* SECTION 1 */}
      <div
        className="section"
        style={{
          height: vh,
          scrollSnapAlign: "start",
          scrollSnapStop: "always",
        }}
      >
        <HomeRotatingSection vh={vh} />
      </div>

      {/* SECTION 2 */}
      <div
        className="section"
        style={{
          height: vh,
          scrollSnapAlign: "start",
          scrollSnapStop: "always",
        }}
      >
        <HomeProductsSection vh={vh} />
      </div>

      {/* FOOTER */}
      <div
        className="footer-section"
        style={{
          minHeight: "280px",
          height: "280px",
          scrollSnapAlign: "start",
          scrollSnapStop: "always",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Footer />
      </div>
    </div>
  );
}
