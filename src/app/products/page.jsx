import { fetchProducts, fetchProductsCount } from "@/lib/firebaseProduct";
import ProductCard from "./ProductCard";
import Footer from "@/components/common/Footer";

// 동적 렌더링 강제 설정
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: "상품 목록 | HOLLYWOOD STUDIO",
  description: "할리우드의 다양한 수제가구 상품을 만나보세요.",
};

function serializeProduct(product) {
  return {
    ...product,
    createdAt: product.createdAt?.toDate ? product.createdAt.toDate().toISOString() : product.createdAt ?? null,
    // 필요하다면 다른 Timestamp 필드도 여기에 추가
  };
}

export default async function ProductsPage() {
  const PAGE_SIZE = 12;
  const { products } = await fetchProducts({ pageSize: PAGE_SIZE });
  const totalCount = await fetchProductsCount();
  const safeProducts = products.map(serializeProduct);

  return (
    <div className="h-full flex flex-col overflow-auto">
      <main className="flex-1">
        <div className="w-full mx-auto px-4 md:px-12 py-24 metallic-base-bg">
          <div className="flex justify-center my-4 min-h-[2.5rem]">
            <h1 className="text-sm md:text-base font-bold text-center w-full">
              {totalCount} {totalCount === 1 ? "Item" : "Items"}
            </h1>
          </div>
          <div className="mx-auto max-w-[1120px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {safeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}  