"use client";
import { useState } from "react";
import { X, Plus, Save } from "lucide-react";

export default function GalleryItemForm({ 
  mode = "create", // "create" 또는 "edit"
  initialDesc = "",
  initialFiles = [],
  onSubmit,
  onCancel,
  loading = false,
  disabled = false
}) {
  const [desc, setDesc] = useState(initialDesc);
  const [files, setFiles] = useState(initialFiles);
  const [dragIdx, setDragIdx] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!files.length || !desc) return;
    onSubmit({ desc, files });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles.map(file => ({ file }))]);
  };

  const removeFile = (fileIndex) => {
    setFiles(prev => prev.filter((_, idx) => idx !== fileIndex));
  };

  const onFileDragStart = (idx) => {
    setDragIdx(idx);
  };

  const onFileDragOver = (e) => {
    e.preventDefault();
  };

  const onFileDrop = (targetIdx) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    
    setFiles(prev => {
      const newFiles = [...prev];
      const [moved] = newFiles.splice(dragIdx, 1);
      newFiles.splice(targetIdx, 0, moved);
      return newFiles;
    });
    setDragIdx(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block font-semibold mb-1">사진 업로드 *</label>
        <p className="text-xs text-gray-700 mb-2">좌우 드래그하여 순서 변경이 가능합니다.</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="input bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full px-3 py-2 rounded"
          disabled={disabled}
        />
        {files.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {files.map((fileObj, idx) => (
              <div 
                key={idx} 
                className="relative cursor-move"
                draggable
                onDragStart={() => onFileDragStart(idx)}
                onDragOver={onFileDragOver}
                onDrop={() => onFileDrop(idx)}
              >
                <img 
                  src={fileObj.url || URL.createObjectURL(fileObj.file)} 
                  alt={`preview-${idx}`} 
                  className="w-20 h-20 object-cover rounded border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="cursor-pointer absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <label className="block font-semibold mb-1">설명 *</label>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="설명을 입력하세요"
          className="input bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full px-3 py-2 rounded"
          rows={3}
          maxLength={500}
          disabled={disabled}
        />
      </div>
      <div className="flex gap-2">
        <button 
          type="submit" 
          className="admin-btn flex items-center gap-2" 
          disabled={loading || disabled}
        >
          {mode === "create" ? <Plus size={16} /> : <Save size={16} />}
          {mode === "create" ? "추가" : "저장"}
        </button>
        {mode === "edit" && (
          <button
            type="button"
            onClick={onCancel}
            className="admin-btn-sub"
            disabled={loading}
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
} 