import React, { useState, useRef, useEffect } from "react";

export default function KakaoConsultButton() {
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const buttonRef = useRef(null);

  // 초기 위치 설정
  useEffect(() => {
    const setInitialPosition = () => {
      setPosition({
        x: window.innerWidth - 56 - 24, // 우측에서 24px 떨어진 위치
        y: window.innerHeight - 56 - 24, // 하단에서 24px 떨어진 위치
      });
    };

    setInitialPosition();
    window.addEventListener("resize", setInitialPosition);

    return () => {
      window.removeEventListener("resize", setInitialPosition);
    };
  }, []);

  // 드래그 시작 (마우스)
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setHasDragged(false);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // 드래그 시작 (터치)
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    setIsDragging(true);
    setHasDragged(false);
    setDragStartPos({ x: touch.clientX, y: touch.clientY });
    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });
  };

  // 드래그 중 (마우스)
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    // 드래그 거리 계산
    const dragDistance = Math.sqrt(
      Math.pow(e.clientX - dragStartPos.x, 2) +
        Math.pow(e.clientY - dragStartPos.y, 2)
    );

    // 5px 이상 움직였으면 드래그로 간주
    if (dragDistance > 5) {
      setHasDragged(true);
    }

    // x축은 고정 (우측 하단), y축만 이동
    const fixedX = window.innerWidth - 56 - 24; // 우측에서 24px + 56px(버튼 크기) 떨어진 위치
    const newY = e.clientY - dragOffset.y;

    // 화면 경계 내에서만 이동 (y축만)
    const maxY = window.innerHeight - 56;

    setPosition({
      x: fixedX,
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  // 드래그 중 (터치)
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];

    // 드래그 거리 계산
    const dragDistance = Math.sqrt(
      Math.pow(touch.clientX - dragStartPos.x, 2) +
        Math.pow(touch.clientY - dragStartPos.y, 2)
    );

    // 5px 이상 움직였으면 드래그로 간주
    if (dragDistance > 5) {
      setHasDragged(true);
    }

    // x축은 고정 (우측 하단), y축만 이동
    const fixedX = window.innerWidth - 56 - 24;
    const newY = touch.clientY - dragOffset.y;

    // 화면 경계 내에서만 이동 (y축만)
    const maxY = window.innerHeight - 56;

    setPosition({
      x: fixedX,
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  // 드래그 종료 (마우스)
  const handleMouseUp = () => {
    setIsDragging(false);
    // 드래그가 있었으면 클릭 이벤트 방지
    if (hasDragged) {
      setTimeout(() => setHasDragged(false), 100);
    }
  };

  // 드래그 종료 (터치)
  const handleTouchEnd = () => {
    setIsDragging(false);
    // 드래그가 있었으면 클릭 이벤트 방지
    if (hasDragged) {
      setTimeout(() => setHasDragged(false), 100);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, dragOffset, dragStartPos]);

  return (
    <div
      ref={buttonRef}
      className={`fixed z-50 cursor-grab active:cursor-grabbing ${
        position ? "" : "bottom-6 right-6 sm:bottom-10 sm:right-10"
      }`}
      style={{
        left: position ? position.x : undefined,
        top: position ? position.y : undefined,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <a
        href="https://pf.kakao.com/_fpxnFn"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="카카오톡 채널 상담"
        className="block pointer-events-none"
        onClick={(e) => {
          if (isDragging || hasDragged) {
            e.preventDefault();
            return;
          }
        }}
      >
        <span
          className="flex items-center justify-center w-14 h-14 rounded-full shadow-md transition-transform duration-200 hover:scale-110 pointer-events-auto"
          style={{
            background: "linear-gradient(180deg, #ffe300 0%, #e6c200 100%)",
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.5 2.62891C6.16282 2.62891 2.64282 5.36319 2.64282 8.72605C2.64282 10.8239 4.00211 12.6546 6.07639 13.7703L5.20425 16.9682C5.1878 17.0318 5.19118 17.0989 5.21396 17.1605C5.23673 17.2222 5.27781 17.2754 5.33167 17.313C5.38554 17.3506 5.44962 17.3709 5.51532 17.371C5.58102 17.3712 5.6452 17.3513 5.69925 17.3139L9.51782 14.776C9.83997 14.776 10.17 14.8311 10.5 14.8311C14.8371 14.8311 18.3571 12.0968 18.3571 8.72605C18.3571 5.35534 14.8371 2.62891 10.5 2.62891Z"
              fill="#181600"
            />
          </svg>
        </span>
      </a>
    </div>
  );
}
