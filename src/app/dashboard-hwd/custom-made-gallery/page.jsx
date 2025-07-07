"use client";
import { useEffect, useState } from "react";
import { getGallery, addGalleryItem, deleteGalleryItem, reorderGallery } from "@/lib/firebaseSiteConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function HandmadeAdmin() {
  const [gallery, setGallery] = useState([]);
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragIdx, setDragIdx] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    setLoading(true);
    try {
      const data = await getGallery();
      setGallery(data);
    } catch {
      setError("불러오기 실패");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!file || !desc) return;
    setLoading(true);
    setError("");
    try {
      // Firebase Storage 업로드
      const storageRef = ref(storage, `customMadeGallery/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await addGalleryItem({ desc, imageUrl: url, order: gallery.length });
      setDesc("");
      setFile(null);
      await fetchGallery();
    } catch {
      setError("추가 실패");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    setError("");
    try {
      await deleteGalleryItem(id);
      await fetchGallery();
    } catch {
      setError("삭제 실패");
    } finally {
      setLoading(false);
    }
  }

  async function handleReorder(newGallery) {
    setLoading(true);
    setError("");
    try {
      await reorderGallery(newGallery.map((item, idx) => ({ id: item.id, order: idx })));
      await fetchGallery();
    } catch {
      setError("순서 변경 실패");
    } finally {
      setLoading(false);
    }
  }

  function onDragStart(idx) { setDragIdx(idx); }
  function onDragOver(e) { e.preventDefault(); }
  function onDrop(idx) {
    if (dragIdx === null || dragIdx === idx) return;
    const newGallery = [...gallery];
    const [moved] = newGallery.splice(dragIdx, 1);
    newGallery.splice(idx, 0, moved);
    setGallery(newGallery);
    setDragIdx(null);
    handleReorder(newGallery);
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">주문제작 갤러리 관리</h1>
      <div className="text-sm text-gray-500 mb-2 text-center">최대 100개까지 추가 가능합니다.</div>
      <form onSubmit={handleAdd} className="space-y-4 bg-white p-6 rounded-lg shadow mb-8">
        <div>
          <label className="block font-semibold mb-1">사진 업로드 *</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="input bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full px-3 py-2 rounded"
            disabled={gallery.length >= 100}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">사진 설명(한줄) *</label>
          <input
            type="text"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="사진 설명(한줄)"
            className="input bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full px-3 py-2 rounded"
            maxLength={100}
            disabled={gallery.length >= 100}
          />
        </div>
        <button type="submit" className="admin-btn w-full" disabled={loading || gallery.length >= 100}>
          추가
        </button>
      </form>
      {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
      <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
        {gallery.map((item, idx) => (
          <li
            key={item.id}
            className="flex items-center gap-4 p-4 cursor-move hover:bg-gray-50"
            draggable
            onDragStart={() => onDragStart(idx)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(idx)}
          >
            <img src={item.imageUrl} alt={item.desc} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <div className="font-medium text-sm truncate">{item.desc}</div>
            </div>
            <button
              className="admin-btn-sub text-xs px-3 py-1"
              onClick={() => handleDelete(item.id)}
              disabled={loading}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
      {loading && <div className="text-gray-500 mt-4 text-center">처리 중...</div>}
    </div>
  );
} 