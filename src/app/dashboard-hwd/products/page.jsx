"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductList from "./ProductList";
import Pagination from "@/components/common/Pagination";
import { fetchProducts, fetchProductsCount } from "@/lib/firebaseProduct";

export default function ProductsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 10;
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
          setProducts(fetched);
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <button
          className="admin-btn"
          onClick={() => router.push("/dashboard-hwd/products/create")}
        >
          상품 생성
        </button>
      </div>
      {error && <div className="text-center text-red-500 py-8">{error}</div>}
      {console.log("products:", products, "length:", products.length)}
      <ProductList
        products={products}
        loading={loading}
        onItemClick={(product) => router.push(`/dashboard-hwd/products/${product.id}`)}
      />
      <div className="flex justify-center mt-8">
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
} 