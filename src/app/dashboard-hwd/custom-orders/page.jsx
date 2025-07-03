"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCustomOrderList, fetchCustomOrderListPaginated } from "@/lib/firebaseInquiry";
import Pagination from "@/components/common/Pagination";

export default function CustomOrdersAdmin() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [orders, setOrders] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { orders: fetched, lastDoc: newLastDoc } = await fetchCustomOrderListPaginated({ pageSize, lastDoc: page === 1 ? null : lastDoc });
        if (!ignore) {
          setOrders(fetched);
          setLastDoc(newLastDoc);
          setHasMore(fetched.length === pageSize);
        }
      } catch (err) {
        setError("문의 목록을 불러오는 중 오류가 발생했습니다.");
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
      <h1 className="text-2xl font-bold mb-4">주문제작 문의 관리</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="text-center text-gray-500 py-8">불러오는 중...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-400 py-8">등록된 문의가 없습니다.</div>
      ) : (
        <>
        <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow mb-8">
          {orders.map((order) => (
            <li
              key={order.id}
              className="p-6 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
              onClick={() => router.push(`/dashboard-hwd/custom-orders/${order.id}`)}
            >
              <div>
                <div className="font-bold text-lg">{order.title}</div>
                <div className="text-gray-600 text-sm">{order.name}</div>
              </div>
              <div className="text-gray-400 text-xs">{order.createdAt?.toDate?.().toLocaleString?.() || "-"}</div>
            </li>
          ))}
        </ul>
        <div className="flex justify-center">
          <Pagination page={page} totalPages={hasMore ? page + 1 : page} onPageChange={handlePageChange} />
        </div>
        </>
      )}
    </div>
  );
} 