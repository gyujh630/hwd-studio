import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-stone-900 text-stone-200 flex flex-col min-h-[280px] pt-8 pb-0 px-4 md:px-12">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between w-full max-w-6xl mx-auto flex-1">
        {/* 브랜드명 */}
        <div className="mb-8 md:mb-0 md:mr-12 min-w-[140px]">
          <span className="font-bold text-sm tracking-widest text-stone-100">
            HOLLYWOOD STORE
          </span>
        </div>
        {/* 4개 섹션 */}
        <div className="flex flex-col md:flex-row w-full gap-8 md:gap-12 flex-1">
          {/* 사업자 정보 */}
          <div className="flex-1 min-w-[150px]">
            <h3 className="text-xs font-semibold mb-2 text-stone-400">
              사업자 정보
            </h3>
            <ul className="space-y-1 text-xs text-stone-300">
              <li>사업자등록번호 123-45-67890</li>
              <li>대표자 정혁</li>
            </ul>
          </div>
          {/* CS 정보 */}
          <div className="flex-1 min-w-[150px]">
            <h3 className="text-xs font-semibold mb-2 text-stone-400">
              고객센터
            </h3>
            <ul className="space-y-1 text-xs text-stone-300">
              <li>서울시 강남구 테헤란로 123, 2층</li>
              <li>010-1234-5678</li>
              <li>info@hollywoodstore.co.kr</li>
              <li className="pt-3 text-stone-200 font-semibold mt-1">
                작업 중 전화연결이 어려우니
              </li>
              <li className="text-stone-200  font-semibold">
                1:1 문의 혹은 문자 부탁드립니다.
              </li>
            </ul>
          </div>
          {/* 은행 정보 */}
          <div className="flex-1 min-w-[150px]">
            <h3 className="text-xs font-semibold mb-2 text-stone-400">
              입금 계좌
            </h3>
            <ul className="space-y-1 text-xs text-stone-300">
              <li>국민은행 123456-78-901234</li>
              <li>예금주: 정혁</li>
            </ul>
          </div>
          {/* SNS */}
          <div className="flex-1 min-w-[150px] flex flex-col items-start md:items-end">
            {/* <h3 className="text-xs font-semibold mb-2 text-stone-400">SNS</h3> */}
            <div className="flex space-x-4">
              {/* 인스타그램 */}
              <a
                href="#"
                target="_blank"
                className="hover:opacity-80 transition-opacity"
                aria-label="인스타그램"
              >
                <img
                  src="/images/icons/intagram.png"
                  alt="인스타그램"
                  className="w-6 h-6 object-contain"
                />
              </a>
              {/* 아이디어스 */}
              <a
                href="https://www.idus.com/v2/artist/d3728bc2-4b05-4561-99f4-c46b2168493f/product"
                target="_blank"
                className="hover:opacity-80 transition-opacity"
                aria-label="아이디어스"
              >
                <img
                  src="/images/icons/idus.png"
                  alt="아이디어스"
                  className="w-6 h-6 rounded-sm object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* 하단 고정 문구 */}
      <div className="w-full text-center py-6 flex-shrink-0">
        <p className="text-xs text-stone-500">
          © 2025 Hollywood Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}