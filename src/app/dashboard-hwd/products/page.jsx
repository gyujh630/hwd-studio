"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductList from "./ProductList";
import Pagination from "@/components/common/Pagination";
import { fetchProducts } from "@/lib/firebaseProduct";

export default function ProductsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [products, setProducts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { products: fetched, lastDoc: newLastDoc } = await fetchProducts({ pageSize, lastDoc: page === 1 ? null : lastDoc });
        if (!ignore) {
          setProducts(fetched);
          setLastDoc(newLastDoc);
          setHasMore(fetched.length === pageSize);
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
      <Pagination page={page} totalPages={hasMore ? page + 1 : page} onPageChange={handlePageChange} />
    </div>
  );
} 