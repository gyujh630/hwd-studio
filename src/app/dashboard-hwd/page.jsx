export default function AdminDashboardHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">관리자 대시보드</h1>
      <p>좌측 메뉴에서 관리할 항목을 선택하세요.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">빠른 링크</h2>
          <div className="space-y-2">
            <a href="/dashboard-hwd/site-config" className="block text-blue-600 hover:text-blue-800">
              → 사이트 관리
            </a>
            <a href="/dashboard-hwd/products" className="block text-blue-600 hover:text-blue-800">
              → 상품 관리
            </a>
            <a href="/dashboard-hwd/custom-orders" className="block text-blue-600 hover:text-blue-800">
              → 주문제작 문의 관리
            </a>
            <a href="/dashboard-hwd/custom-made-gallery" className="block text-blue-600 hover:text-blue-800">
              → 주문제작 갤러리 관리
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 