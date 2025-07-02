"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProductById, deleteProduct } from "@/lib/firebaseProduct";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProductById(params.id);
        if (!ignore) setProduct(data);
      } catch (err) {
        setError("상품 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/dashboard-hwd/products/${params.id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setDeleting(true);
    setError("");
    try {
      await deleteProduct(params.id);
      alert("상품이 삭제되었습니다.");
      router.push("/dashboard-hwd/products");
    } catch (err) {
      setError("상품 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="text-center text-gray-500 py-8">불러오는 중...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!product) return <div className="text-center text-gray-400 py-8">상품을 찾을 수 없습니다.</div>;

  const thumbnail = Array.isArray(product.photos) && product.photos.length > 0
    ? (product.photos.find(p => p.isThumbnail)?.fileUrl || product.photos[0]?.fileUrl)
    : "";

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <div className="flex gap-8 mb-6">
        {thumbnail && (
          <img src={thumbnail} alt={product.name} className="w-48 h-48 object-cover rounded" />
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">{product.name}</h1>
          <div className="mb-2"><span className="font-semibold pr-2">가격</span> <span className="text-gray-600">₩{product.price?.toLocaleString()}</span></div>
          <div className="mb-2"><span className="font-semibold pr-2">사이즈 옵션</span> <span className="text-gray-600">{product.sizes?.join(", ")}</span></div>
          <div className="mb-2"><span className="font-semibold pr-2">상품설명</span> <span className="text-gray-600 whitespace-pre-line">{product.description}</span></div>
          <div className="mb-2">
            <span className="font-semibold pr-2">아이디어스 링크</span>
            {product.idusUrl ? (
              <a href={product.idusUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{product.idusUrl}</a>
            ) : (
              <span className="text-gray-600">-</span>
            )}
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">색상/사진 옵션</div>
        <div className="grid grid-cols-2 gap-4">
          {product.photos?.map((photo, idx) => (
            <div key={idx} className="border border-gray-200 rounded p-2 flex flex-col items-center">
              <img src={photo.fileUrl} alt={photo.colorName} className="w-24 h-24 object-cover rounded mb-1" />
              <div className="text-sm font-semibold">{photo.colorName}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-4 h-4 rounded-full border" style={{ background: photo.colorValue }} />
                <span className="text-xs text-gray-500">{photo.colorValue}</span>
                {photo.isThumbnail && <span className="ml-2 text-xs text-blue-600 font-bold">대표</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4 mt-8">
        <button className="admin-btn" onClick={handleEdit} disabled={deleting}>수정</button>
        <button className="admin-btn-sub" onClick={handleDelete} disabled={deleting}>삭제</button>
      </div>
      {deleting && <div className="text-center text-gray-500 mt-4">삭제 중...</div>}
      {error && <div className="text-center text-red-500 mt-4">{error}</div>}
    </div>
  );
} 