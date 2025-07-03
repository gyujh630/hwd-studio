"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchCustomOrderById } from "@/lib/firebaseInquiry";

export default function CustomOrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchCustomOrderById(params.id);
        if (!ignore) setOrder(data);
      } catch (err) {
        setError("문의 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [params.id]);

  if (loading) return <div className="text-center text-gray-500 py-8">불러오는 중...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!order) return <div className="text-center text-gray-400 py-8">문의 내역을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-xl mx-auto ">
      <h1 className="text-2xl font-bold mb-8 text-center">주문제작 문의 상세</h1>
      {/* 주문자 정보 */}
      <div className="mb-8 p-6 rounded-lg bg-white border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">주문자 정보</h2>
        <div className="flex flex-col gap-2 text-gray-800">
          <div><span className="font-semibold w-24 inline-block">이름</span> {order.name}</div>
          <div><span className="font-semibold w-24 inline-block">전화번호</span> {order.phone}</div>
          <div><span className="font-semibold w-24 inline-block">이메일</span> {order.email}</div>
        </div>
      </div>
      {/* 문의 정보 */}
      <div className="mb-8 p-6 rounded-lg bg-white border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">문의 정보</h2>
        <div className="mb-3"><span className="font-semibold w-24 inline-block">제목</span> {order.title}</div>
        <div className="mb-3">
          <span className="font-semibold w-24 inline-block align-top">본문</span>
          <span className="whitespace-pre-line ml-1 text-gray-700">{order.body}</span>
        </div>
        <div className="mb-2">
          <span className="font-semibold w-24 inline-block">첨부파일1</span>
          {order.fileUrls?.[0]
            ? <a href={order.fileUrls[0]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">다운로드</a>
            : <span className="text-gray-400 ml-2">없음</span>}
        </div>
        <div>
          <span className="font-semibold w-24 inline-block">첨부파일2</span>
          {order.fileUrls?.[1]
            ? <a href={order.fileUrls[1]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">다운로드</a>
            : <span className="text-gray-400 ml-2">없음</span>}
        </div>
      </div>
      {/* 등록일 */}
      <div className="text-right text-sm text-gray-500 mt-4">
        등록일: {order.createdAt?.toDate?.().toLocaleString?.() || "-"}
      </div>
    </div>
  );
} 