"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProducts } from "@/lib/firebaseProduct";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Pagination from "@/components/common/Pagination";

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [lastDocs, setLastDocs] = useState([null]);
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    async function loadCount() {
      try {
        const countSnap = await getCountFromServer(collection(db, "products"));
        if (!ignore) setTotalCount(countSnap.data().count);
      } catch (err) {
        // 무시
      }
    }
    loadCount();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    let ignore = false;
    async function loadPage() {
      setError("");
      setLoading(true);
      try {
        const lastDoc = page === 1 ? null : lastDocs[page - 1];
        const { products: fetched, lastDoc: newLastDoc } = await fetchProducts({ pageSize: PAGE_SIZE, lastDoc });
        if (!ignore) {
          setProducts(fetched);
          setLastDocs(prev => {
            if (prev.length > page) return prev;
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
    loadPage();
    return () => { ignore = true; };
  }, [page]);

  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;
  const pagedProducts = products;

  return (
    <div className="w-full min-h-screen mx-auto px-12 py-24 metallic-base-bg overflow-auto">
      <div className="flex justify-center my-4 min-h-[2.5rem]">
        {loading ? (
          <span className="animate-spin inline-block w-6 h-6 border-4 border-gray-300 border-t-gray-900 rounded-full" />
        ) : (
          <h1 className="text-sm md:text-base font-bold text-center w-full">
            {totalCount} {totalCount === 1 ? 'Item' : 'Items'}
          </h1>
        )}
      </div>
      <div className="mx-auto max-w-[1120px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {pagedProducts.map((product) => {
          const thumbnail =
            Array.isArray(product.photos) && product.photos.length > 0
              ? product.photos.find((p) => p.isThumbnail)?.fileUrl ||
                product.photos[0]?.fileUrl
              : "";
          return (
            <div
              key={product.id}
              className="p-2 flex flex-col gap-2 group"
            >
              {thumbnail && (
                <div
                  className="relative w-full aspect-square overflow-hidden mb-2 shadow-lg bg-white cursor-pointer"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  <img
                    src={thumbnail}
                    alt={product.name}
                    className="object-contain w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 hover:opacity-100" />
                </div>
              )}
              <div
                className="text-lg font-semibold underline cursor-pointer w-fit"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                {product.name}
              </div>
              <div className="text-gray-900 text-sm">
                ₩{product.price?.toLocaleString()}
              </div>
              <div className="flex gap-1 mt-auto">
                {product.photos?.map((photo, idx) => (
                  <span
                    key={idx}
                    title={photo.colorName}
                    className="w-5 h-5 rounded-full border border-gray-300"
                    style={{ background: photo.colorValue }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {/* Pagination */}
      {!loading && (
        <div className="flex justify-center mt-10">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
} 