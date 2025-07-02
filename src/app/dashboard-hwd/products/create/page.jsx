"use client";
import ProductForm from "../ProductForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProduct } from "@/lib/firebaseProduct";

export default function ProductCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      await createProduct(data);
      alert("상품이 등록되었습니다!");
      router.push("/dashboard-hwd/products");
    } catch (err) {
      console.error("상품 등록 에러:", err, err?.message, err?.code, err?.stack, err?.details, data);
      setError(
        "상품 등록 중 오류가 발생했습니다.\n" +
        (err?.message ? err.message : "") +
        (err?.details ? "\n" + JSON.stringify(err.details) : "")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ProductForm onSubmit={handleSubmit} />
      {loading && <div className="text-center text-gray-500 mt-4">저장 중...</div>}
      {error && <div className="text-center text-red-500 mt-4 whitespace-pre-line">{error}</div>}
    </div>
  );
} 