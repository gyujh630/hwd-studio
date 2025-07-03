export default function Footer() {
    return (
      <div className="w-full bg-stone-900 text-stone-100 py-12 px-8">
        <div className="mx-auto">
          {/* 상호명 */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-light tracking-wider">할리우드스토어</h2>
            <div className="w-12 h-px bg-stone-500 mx-auto mt-2"></div>
          </div>
  
          {/* 메인 정보 - 반응형 flex 레이아웃 */}
          <div className="flex flex-col md:flex-row justify-between items-stretch text-xs text-stone-300 space-y-8 md:space-y-0 md:space-x-8">
            {/* 첫 번째 섹션 - 사업자 정보 */}
            <div className="flex-1 text-left">
              <div className="space-y-2">
                <p>사업자등록번호 123-45-67890</p>
                <p>대표자 정혁</p>
                <p>서울시 강남구 테헤란로 123, 2층</p>
              </div>
            </div>
  
            {/* 세로 구분선 - md 이상에서만 보이기 */}
            <div className="hidden md:block w-px h-16 bg-stone-700"></div>
  
            {/* 두 번째 섹션 - 연락처 */}
            <div className="flex-1 text-center">
              <div className="space-y-2">
                <p>010-1234-5678</p>
                <p>info@hollywoodstore.co.kr</p>
                <p>국민은행 123456-78-901234</p>
                <p className="text-amber-400 mt-3">작업 중 전화연결 어려움</p>
                <p className="text-amber-300">문자 상담 권장</p>
              </div>
            </div>
  
            {/* 세로 구분선 - md 이상에서만 보이기 */}
            <div className="hidden md:block w-px h-16 bg-stone-700"></div>
  
            {/* 세 번째 섹션 - 소셜 미디어 */}
            <div className="flex-1 text-right">
              <div className="space-y-4">
                <div className="flex justify-end space-x-4">
                  {/* 인스타그램 아이콘 */}
                  <a href="#" className="hover:text-stone-300 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.315 0-.595-.122-.806-.333-.211-.211-.333-.491-.333-.806 0-.315.122-.595.333-.806.211-.211.491-.333.806-.333.315 0 .595.122.806.333.211.211.333.491.333.806 0 .315-.122.595-.333.806-.211.211-.491.333-.806.333z"/>
                    </svg>
                  </a>
                  
                  {/* 아이디어스 아이콘 */}
                  <a href="#" className="hover:text-stone-300 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                      <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                    </svg>
                  </a>
                </div>
                
                <div className="text-xs space-y-1">
                  <p>@hollywoodstore_kr</p>
                  <p>아이디어스 할리우드스토어</p>
                </div>
              </div>
            </div>
          </div>
  
          {/* 하단 */}
          <div className="text-center mt-8 pt-6 border-t border-stone-800">
            <p className="text-xs text-stone-500">
              © 2025 할리우드스토어. 모든 제품은 수작업으로 제작됩니다.
            </p>
          </div>
        </div>
      </div>
    );
  }