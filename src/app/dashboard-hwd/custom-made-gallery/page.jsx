"use client";
import { useEffect, useState } from "react";
import { getGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem, reorderGallery } from "@/lib/firebaseSiteConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { GripVertical, Edit } from "lucide-react";
import GalleryItemForm from "./GalleryItemForm";

export default function HandmadeAdmin() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragIdx, setDragIdx] = useState(null);
  const [editingId, setEditingId] = useState(null);

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

  async function handleAdd({ desc, files }) {
    setLoading(true);
    setError("");
    try {
      // Firebase Storage 업로드
      const uploadPromises = files.map(async (fileObj, idx) => {
        const storageRef = ref(storage, `customMadeGallery/${Date.now()}_${idx}_${fileObj.file.name}`);
        await uploadBytes(storageRef, fileObj.file);
        return await getDownloadURL(storageRef);
      });
      const imageUrls = await Promise.all(uploadPromises);
      
      await addGalleryItem({ desc, images: imageUrls, order: gallery.length });
      await fetchGallery();
    } catch {
      setError("추가 실패");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate({ desc, files }) {
    if (!editingId) return;
    setLoading(true);
    setError("");
    try {
      let imageUrls = [];
      
      // 기존 이미지들 (새로 업로드되지 않은 것들)
      const existingImages = files.filter(f => f.url);
      imageUrls.push(...existingImages.map(f => f.url));
      
      // 새로 업로드된 파일들
      const newFiles = files.filter(f => f.file);
      if (newFiles.length > 0) {
        const uploadPromises = newFiles.map(async (fileObj, idx) => {
          const storageRef = ref(storage, `customMadeGallery/${Date.now()}_${idx}_${fileObj.file.name}`);
          await uploadBytes(storageRef, fileObj.file);
          return await getDownloadURL(storageRef);
        });
        const newUrls = await Promise.all(uploadPromises);
        imageUrls.push(...newUrls);
      }
      
      await updateGalleryItem(editingId, { desc, images: imageUrls });
      setEditingId(null);
      await fetchGallery();
    } catch {
      setError("수정 실패");
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

  function startEdit(item) {
    setEditingId(item.id);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-2 text-center">주문제작 갤러리 관리</h1>
      <div className="text-sm text-gray-500 mb-6 text-center">최대 50개까지 추가 가능합니다.</div>
      
      {/* 추가 폼 */}
      <div className="mb-8">
        <GalleryItemForm
          mode="create"
          onSubmit={handleAdd}
          loading={loading}
          disabled={gallery.length >= 50}
        />
      </div>

      {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
      
      {/* 갤러리 목록 */}
      <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
        {gallery.map((item, idx) => (
          <li
            key={item.id}
            className="p-4 hover:bg-gray-50"
            draggable
            onDragStart={() => onDragStart(idx)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(idx)}
          >
            {editingId === item.id ? (
              // 수정 모드
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <GripVertical className="text-gray-400 cursor-move" size={20} />
                </div>
                <GalleryItemForm
                  mode="edit"
                  initialDesc={item.desc}
                  initialFiles={(item.images || (item.imageUrl ? [item.imageUrl] : [])).map(url => ({ url }))}
                  onSubmit={handleUpdate}
                  onCancel={cancelEdit}
                  loading={loading}
                />
              </div>
            ) : (
              // 보기 모드
              <div className="flex items-start gap-4">
                <GripVertical className="text-gray-400 cursor-move mt-2" size={20} />
                <div className="flex-1">
                  <div className="mb-2">
                    <div className="font-medium">{item.desc}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(item.images || (item.imageUrl ? [item.imageUrl] : [])).map((imageUrl, imgIdx) => (
                      <img 
                        key={imgIdx} 
                        src={imageUrl} 
                        alt={`${item.desc}-${imgIdx}`} 
                        className="w-20 h-20 object-cover rounded border border-gray-300"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="admin-btn-sub flex items-center gap-1"
                    disabled={loading}
                  >
                    <Edit size={14} />
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="admin-btn-sub text-xs px-3 py-1"
                    disabled={loading}
                  >
                    삭제
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {loading && <div className="text-gray-500 mt-4 text-center">처리 중...</div>}
    </div>
  );
} 