"use client";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import Footer from "@/components/common/Footer";
import Pagination from "@/components/common/Pagination";
import { fetchProducts, fetchProductsCount } from "@/lib/firebaseProduct";

function serializeProduct(product) {
  return {
    ...product,
    createdAt: product.createdAt?.toDate ? product.createdAt.toDate().toISOString() : product.createdAt ?? null,
    updatedAt: product.updatedAt?.toDate ? product.updatedAt.toDate().toISOString() : product.updatedAt ?? null,
    // 필요하다면 다른 Timestamp 필드도 여기에 추가
  };
}

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [products, setProducts] = useState([]);
  const [lastDocs, setLastDocs] = useState([null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchProductsCount().then(setTotalCount);
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { products: fetched, lastDoc: newLastDoc } = await fetchProducts({ pageSize, lastDoc: lastDocs[page - 1] });
        if (!ignore) {
          const safeProducts = fetched.map(serializeProduct);
          setProducts(safeProducts);
          setHasMore(fetched.length === pageSize);
          setLastDocs(prev => {
            const copy = [...prev];
            copy[page] = newLastDoc;
            return copy;
          });
        }
      } catch (err) {
        setError("상품 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
    // eslint-disable-next-line
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    setPage(newPage);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen flex flex-col metallic-base-bg overflow-y-auto">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full mx-auto px-4 md:px-12 py-24">
          {!loading && (
            <div className="flex justify-center my-4 min-h-[2.5rem]">
              <h1 className="text-sm md:text-base font-bold text-center w-full">
                {totalCount} {totalCount === 1 ? "Item" : "Items"}
              </h1>
            </div>
          )}
          {error && (
            <div className="text-center text-red-500 py-8">{error}</div>
          )}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="mx-auto max-w-[1120px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {!loading && (
            <div className="flex justify-center mt-18">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}  