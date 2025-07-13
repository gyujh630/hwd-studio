import { useState, useRef } from "react";
import Image from "next/image";
import ImageCropModal from "@/components/common/ImageCropModal";
// import { HexColorPicker } from "react-colorful"; // 실제 적용 시 주석 해제 필요

export default function ProductForm({ initialData = {}, onSubmit, isEdit = false }) {
  const [name, setName] = useState(initialData.name || "");
  const [price, setPrice] = useState(initialData.price || "");
  const [sizes, setSizes] = useState(initialData.sizes || [""]);
  const [description, setDescription] = useState(initialData.description || "");
  const [idusUrl, setIdusUrl] = useState(initialData.idusUrl || "");
  // 사진+색상: [{file, preview, colorName, colorValue}]
  const [photos, setPhotos] = useState(initialData.photos || []);
  const [thumbnailIdx, setThumbnailIdx] = useState(
    initialData.photos?.findIndex(p => p.isThumbnail) ?? 0
  );
  // 쇼핑몰 상세페이지 이미지: [{file, preview, url}]
  const [detailImages, setDetailImages] = useState(initialData.detailImages || []);
  const [cropModal, setCropModal] = useState({ show: false, imageUrl: null, onComplete: null });
  const fileInputRef = useRef();
  const detailImageInputRef = useRef();

  // 사이즈 옵션 추가/삭제/변경
  const handleSizeChange = (idx, value) => {
    const newSizes = [...sizes];
    newSizes[idx] = value;
    setSizes(newSizes);
  };
  const addSize = () => setSizes([...sizes, ""]);
  const removeSize = (idx) => setSizes(sizes.filter((_, i) => i !== idx));

  // 사진 추가/삭제/색상명/색상값 변경
  const handlePhotoAdd = (e) => {
    const files = Array.from(e.target.files).slice(0, 10 - photos.length);
    
    if (files.length > 0) {
      const file = files[0]; // 한 번에 하나씩만 처리
      const imageUrl = URL.createObjectURL(file);
      
      setCropModal({
        show: true,
        imageUrl,
        onComplete: (croppedData) => {
          const newPhoto = {
            file: croppedData.blob,
            preview: croppedData.fileUrl,
            colorName: "",
            colorValue: "#ffffff"
          };
          setPhotos([...photos, newPhoto]);
          setCropModal({ show: false, imageUrl: null, onComplete: null });
        }
      });
    }
    
    // input value 초기화(동일 파일 재선택 가능)
    e.target.value = "";
  };
  const handlePhotoRemove = (idx) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };
  const handlePhotoColorName = (idx, value) => {
    const newPhotos = [...photos];
    newPhotos[idx].colorName = value;
    setPhotos(newPhotos);
  };
  const handlePhotoColorValue = (idx, value) => {
    const newPhotos = [...photos];
    newPhotos[idx].colorValue = value;
    setPhotos(newPhotos);
  };

  // 대표 사진 선택 시 해당 사진을 0번 인덱스로 이동
  const handleThumbnailChange = (newThumbnailIdx) => {
    if (newThumbnailIdx === thumbnailIdx) return; // 이미 대표인 경우
    
    const newPhotos = [...photos];
    const selectedPhoto = newPhotos[newThumbnailIdx];
    
    // 선택된 사진을 0번 인덱스로 이동
    newPhotos.splice(newThumbnailIdx, 1);
    newPhotos.unshift(selectedPhoto);
    
    setPhotos(newPhotos);
    setThumbnailIdx(0); // 대표 사진은 항상 0번 인덱스
  };

  // 쇼핑몰 상세페이지 이미지 추가
  const handleDetailImageAdd = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name}은(는) 이미지 파일이 아닙니다.`);
        return false;
      }
      return true;
    }).slice(0, 10 - detailImages.length);
    
    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setDetailImages([...detailImages, ...newImages]);
    e.target.value = "";
  };

  // 쇼핑몰 상세페이지 이미지 삭제
  const handleDetailImageRemove = (idx) => {
    setDetailImages(detailImages.filter((_, i) => i !== idx));
  };

  // 쇼핑몰 상세페이지 이미지 순서 변경
  const moveDetailImage = (from, to) => {
    if (to < 0 || to >= detailImages.length) return;
    const arr = [...detailImages];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setDetailImages(arr);
  };

  // 필수값 체크
  const isValid =
    name.trim() &&
    price &&
    description.trim() &&
    sizes.filter(s => s.trim()).length > 0 &&
    photos.length > 0 &&
    photos.every(p => p.colorName.trim() && p.colorValue);

  // 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    // 대표 썸네일 지정
    const photosWithThumb = photos.map((p, i) => ({ ...p, isThumbnail: i === thumbnailIdx }));
    onSubmit && onSubmit({ 
      name, 
      price, 
      sizes, 
      description, 
      idusUrl, 
      photos: photosWithThumb,
      detailImages 
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl text-center font-semibold mb-6">{isEdit ? "상품 수정" : "상품 등록"}</h2>
        <div>
          <label className="block font-semibold mb-1">상품명 *</label>
          <input className="input bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full px-3 py-2 rounded"
            value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">가격(원) *</label>
          <input className="input bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full px-3 py-2 rounded"
            type="number" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">상품 설명 *</label>
          <textarea className="input bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full px-3 py-2 rounded"
            value={description} onChange={e => setDescription(e.target.value)} required rows={4} />
        </div>
        <div>
          <label className="block font-semibold mb-1">사이즈 옵션 *</label>
          {sizes.map((size, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input className="input flex-1 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 px-3 py-2 rounded"
                value={size} onChange={e => handleSizeChange(idx, e.target.value)} required />
              {sizes.length > 1 && (
                <button type="button" onClick={() => removeSize(idx)} className="admin-btn-sub text-sm text-xs px-2 py-1">삭제</button>
              )}
            </div>
          ))}
          {sizes.length < 10 && <button type="button" onClick={addSize} className="admin-btn mt-1">옵션 추가</button>}
        </div>
        <div>
          <label className="block font-semibold mb-1">사진 및 색상 옵션 (최대 10개) *</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoAdd}
            className="hidden"
          />
          <button
            type="button"
            className="admin-btn my-2"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            이미지 파일 선택 / 추가
          </button>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {photos.map((photo, idx) => (
              <div key={idx} className={`relative border rounded p-2 bg-gray-50 flex flex-col items-center ${thumbnailIdx === idx ? 'ring-2 ring-blue-500' : ''}`}>
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <input
                    type="radio"
                    name="thumbnail"
                    checked={thumbnailIdx === idx}
                    onChange={() => handleThumbnailChange(idx)}
                    className="accent-blue-600"
                  />
                  <span className="text-xs text-blue-600 font-bold">대표</span>
                </div>
                {photo.preview || photo.fileUrl ? (
                  <Image src={photo.preview || photo.fileUrl || ""} alt="미리보기" width={128} height={128} className="w-32 h-32 object-cover rounded mb-2" />
                ) : null}
                <input
                  className="input bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full px-2 py-1 rounded mb-1"
                  placeholder="색상명 (예: Walnut, Red)"
                  value={photo.colorName}
                  onChange={e => handlePhotoColorName(idx, e.target.value)}
                  required
                />
                <div className="flex items-center gap-2 w-full">
                  {/* <HexColorPicker color={photo.colorValue} onChange={v => handlePhotoColorValue(idx, v)} /> */}
                  <input
                    type="color"
                    value={photo.colorValue}
                    onChange={e => handlePhotoColorValue(idx, e.target.value)}
                    className="w-8 h-8 border-none bg-transparent cursor-pointer"
                  />
                  <input
                    className="input bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 flex-1 px-2 py-1 rounded"
                    value={photo.colorValue}
                    onChange={e => handlePhotoColorValue(idx, e.target.value)}
                    required
                  />
                </div>
                <button type="button" onClick={() => handlePhotoRemove(idx)} className="admin-btn-sub text-xs px-2 py-1 mt-2">삭제</button>
              </div>
            ))}
          </div>
        </div>
        
        {/* 쇼핑몰 상세페이지 이미지 */}
        <div>
          <label className="block font-semibold mb-1">상세페이지 이미지 (최대 10장)</label>
          <div className="text-xs text-gray-500 mb-2">이미지 파일만 업로드 가능합니다. 순서를 변경할 수 있습니다.</div>
          <input
            ref={detailImageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleDetailImageAdd}
            className="hidden"
          />
          <button
            type="button"
            className="admin-btn my-2"
            onClick={() => detailImageInputRef.current && detailImageInputRef.current.click()}
            disabled={detailImages.length >= 10}
          >
            상세페이지 이미지 추가
          </button>
          <span className="ml-2 text-sm text-gray-500">{detailImages.length}/10</span>
          
          {detailImages.length > 0 && (
            <div className="mt-4 space-y-3">
              {detailImages.map((img, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex-shrink-0">
                    <Image 
                      src={img.preview || img.url} 
                      alt={`상세페이지 이미지 ${idx + 1}`} 
                      width={80} 
                      height={80} 
                      className="w-20 h-20 object-cover rounded" 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">
                      이미지 {idx + 1}
                    </div>
                    <div className="text-xs text-gray-500">
                      {img.file ? img.file.name : '기존 이미지'}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveDetailImage(idx, idx - 1)}
                      disabled={idx === 0}
                      className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDetailImage(idx, idx + 1)}
                      disabled={idx === detailImages.length - 1}
                      className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDetailImageRemove(idx)}
                      className="px-2 py-1 text-xs bg-red-200 hover:bg-red-300 text-red-700 rounded"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <label className="block font-semibold mb-1">아이디어스 링크</label>
          <input className="input bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full px-3 py-2 rounded"
            value={idusUrl} onChange={e => setIdusUrl(e.target.value)} placeholder="https://idus.com/..." />
        </div>
        <button className="admin-btn w-full mt-4" type="submit" disabled={!isValid}>{isEdit ? "수정하기" : "등록하기"}</button>
      </form>

      {/* 이미지 크롭 모달 */}
      {cropModal.show && (
        <ImageCropModal
          imageUrl={cropModal.imageUrl}
          onCropComplete={cropModal.onComplete}
          onCancel={() => setCropModal({ show: false, imageUrl: null, onComplete: null })}
          aspectRatio={1}
          cropShape="rect"
        />
      )}
    </>
  );
} 