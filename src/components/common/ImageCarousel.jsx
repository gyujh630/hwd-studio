import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRef } from "react";

export default function ImageCarousel({
  media,
  images, // fallback for old usage
  imageClassName = "object-contain",
  overlay, // (idx) => ReactNode
  indicatorClassName = "",
  containerClassName = "",
  ...props
}) {
  // media 배열이 없으면 images 배열을 media로 변환
  const mediaList = media
    ? media
    : (images || []).map((src) => ({ type: "image", src }));

  // 비디오 ref 배열
  const videoRefs = useRef([]);

  // 슬라이드 변경 시 비디오 재생/정지
  const handleSlideChange = (swiper) => {
    mediaList.forEach((item, idx) => {
      if (item.type === "video" && videoRefs.current[idx]) {
        if (swiper.realIndex === idx) {
          videoRefs.current[idx].play().catch(() => {});
        } else {
          videoRefs.current[idx].pause();
          videoRefs.current[idx].currentTime = 0;
        }
      }
    });
  };

  return (
    <div
      className={`relative w-88 h-72 md:w-120 md:h-92 ${containerClassName}`}
      {...props}
    >
      <Swiper
        modules={[Navigation, Pagination]}
        loop={true}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{ clickable: true, el: ".swiper-pagination-custom" }}
        className="w-full max-w-80 sm:max-w-none h-full rounded-2xl"
        onSlideChange={handleSlideChange}
        onSwiper={handleSlideChange}
      >
        {mediaList.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-full bg-gradient-to-br from-gray-50/50 to-gray-200/50 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10" />
              {item.type === "image" ? (
                <Image
                  src={item.src}
                  alt={`Carousel ${idx}`}
                  fill
                  className={imageClassName}
                  sizes="(max-width: 768px) 600px, 800px"
                  quality={100}
                  priority={idx === 0}
                />
              ) : item.type === "video" ? (
                <video
                  ref={el => (videoRefs.current[idx] = el)}
                  src={item.src}
                  poster={item.poster}
                  className="w-full h-full object-cover"
                  playsInline
                  preload="metadata"
                  style={{ background: "#000" }}
                  controls={false}
                  controlsList="nodownload noremoteplayback noplaybackrate"
                  tabIndex={-1}
                  muted
                  loop
                />
              ) : null}
              {overlay && (
                <div className="absolute inset-0 z-20 pointer-events-none shadow-2xl">
                  {overlay(idx)}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
        {/* Custom Navigation Buttons */}
        <button
          className="swiper-button-prev-custom absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 opacity-100 hover:scale-110 z-20"
          tabIndex={0}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          className="swiper-button-next-custom absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 opacity-100 hover:scale-110 z-20"
          tabIndex={0}
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
        {/* Custom Pagination Dots */}
        <div
          className={`swiper-pagination-custom absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 ${indicatorClassName}`}
        ></div>
      </Swiper>
    </div>
  );
} 