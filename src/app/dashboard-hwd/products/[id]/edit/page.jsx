"use client";
import ProductForm from "../../ProductForm";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProductById, updateProduct } from "@/lib/firebaseProduct";

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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

  const handleSubmit = async (data) => {
    setSaving(true);
    setError("");
    try {
      await updateProduct(params.id, data);
      alert("상품이 수정되었습니다!");
      router.push(`/dashboard-hwd/products/${params.id}`);
    } catch (err) {
      setError("상품 수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center text-gray-500 py-8">불러오는 중...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!product) return <div className="text-center text-gray-400 py-8">상품을 찾을 수 없습니다.</div>;

  return (
    <div>
      <ProductForm initialData={product} onSubmit={handleSubmit} isEdit />
      {saving && <div className="text-center text-gray-500 mt-4">저장 중...</div>}
      {error && <div className="text-center text-red-500 mt-4">{error}</div>}
    </div>
  );
} 