"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  fetchSectionConfig,
  updateSectionConfig,
  uploadSectionImage,
  deleteSectionImageByUrl
} from "@/lib/firebaseSiteConfig";

function SectionEditor({ sectionName, sectionLabel }) {
  const [images, setImages] = useState([]); // [{file, preview, url}]
  const [titles, setTitles] = useState(["", ""]);
  const [descs, setDescs] = useState(["", "", ""]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef();

  // Firestore에서 데이터 불러오기
  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchSectionConfig(sectionName);
        if (!ignore && data) {
          setImages((data.images || []).map(url => ({ url })));
          setTitles(Array.isArray(data.titles) ? data.titles : ["", ""]);
          setDescs(Array.isArray(data.descs) ? data.descs : ["", "", ""]);
          setCaption(data.caption || "");
        }
      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [sectionName]);

  // 이미지 추가
  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - images.length);
    const newImages = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setImages([...images, ...newImages]);
    e.target.value = "";
  };
  // 이미지 삭제
  const handleImageRemove = async (idx) => {
    const img = images[idx];
    if (img.url && !img.file) {
      // 기존 이미지면 Storage에서 삭제
      try {
        await deleteSectionImageByUrl(img.url);
      } catch {}
    }
    setImages(images.filter((_, i) => i !== idx));
  };
  // 이미지 순서 변경
  const moveImage = (from, to) => {
    if (to < 0 || to >= images.length) return;
    const arr = [...images];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setImages(arr);
  };

  // 타이틀/문구/캡션 입력 핸들러
  const handleTitle = (idx, v) => setTitles(titles.map((t, i) => i === idx ? v : t));
  const handleDesc = (idx, v) => setDescs(descs.map((d, i) => i === idx ? v : d));

  // 저장
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      // 새로 추가된 파일만 업로드
      const uploadedUrls = await Promise.all(images.map(async (img, idx) => {
        if (img.file) {
          return await uploadSectionImage(img.file, sectionName, idx);
        } else {
          return img.url;
        }
      }));
      await updateSectionConfig(sectionName, {
        images: uploadedUrls,
        titles,
        descs,
        caption
      });
      setImages(uploadedUrls.map(url => ({ url })));
      setSuccess(true);
    } catch (err) {
      setError("저장 중 오류가 발생했습니다. (로그인 필요/권한/네트워크 등)");
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{sectionLabel}</h2>
      {loading ? (
        <div className="text-gray-400 py-8">불러오는 중...</div>
      ) : (
        <>
          {/* 이미지 업로드 */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">사진 (최대 5장)</label>
            <div className="text-xs text-gray-400 mb-1">권장 사이즈: 352x288px (약 4:3 비율)</div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageAdd}
              className="hidden"
              disabled={images.length >= 5 || saving}
            />
            <button
              type="button"
              className="admin-btn my-2"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              disabled={images.length >= 5 || saving}
            >
              이미지 파일 선택 / 추가
            </button>
            <span className="ml-2 text-sm text-gray-500">{images.length}/5</span>
            <div className="text-xs text-gray-400 mt-1">사진은 5장까지 첨부 가능합니다.</div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative rounded p-2 bg-gray-100 flex flex-col items-center">
                  {img.preview || img.url ? (
                    <div style={{ width: 150, height: 120, background: '#eee', borderRadius: 4, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Image src={img.preview || img.url} alt="미리보기" width={150} height={120} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    </div>
                  ) : null}
                  <div className="flex gap-0.5 mt-2">
                    <button type="button" className="admin-btn-sub px-0.5 py-0 text-[10px] font-light" onClick={() => moveImage(idx, idx - 1)} disabled={idx === 0 || saving}>↑</button>
                    <button type="button" className="admin-btn-sub px-0.5 py-0 text-[10px] font-light" onClick={() => moveImage(idx, idx + 1)} disabled={idx === images.length - 1 || saving}>↓</button>
                    <button type="button" className="admin-btn-sub px-0.5 py-0 text-[10px] font-light" onClick={() => handleImageRemove(idx)} disabled={saving}>삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* 타이틀 */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">타이틀</label>
            {titles.map((t, i) => (
              <input
                key={i}
                className="input bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full px-3 py-2 rounded mb-2"
                value={t}
                onChange={e => handleTitle(i, e.target.value)}
                placeholder={`title${i + 1}`}
                disabled={saving}
              />
            ))}
          </div>
          {/* 문구 */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">문구</label>
            {descs.map((d, i) => (
              <input
                key={i}
                className="input bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full px-3 py-2 rounded mb-2"
                value={d}
                onChange={e => handleDesc(i, e.target.value)}
                placeholder={`desc${i + 1}`}
                disabled={saving}
              />
            ))}
          </div>
          {/* 캡션 */}
          <div className="mb-6">
            <label className="block font-semibold mb-1">캡션</label>
            <input
              className="input bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full px-3 py-2 rounded"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="caption"
              disabled={saving}
            />
          </div>
          <button className="admin-btn w-full" type="button" onClick={handleSave} disabled={saving}>
            {saving ? "저장 중..." : "저장"}
          </button>
          {error && <div className="text-center text-red-500 mt-4">{error}</div>}
          {success && <div className="text-center text-green-600 mt-4">저장되었습니다!</div>}
        </>
      )}
    </section>
  );
}

export default function SiteConfigPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">사이트 관리</h1>
      <p className="mb-8 text-gray-600">홈 화면의 각 섹션에 노출되는 사진, 타이틀, 문구를 수정할 수 있습니다.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SectionEditor sectionName="productSection" sectionLabel="첫번째 섹션" />
        <SectionEditor sectionName="customMadeSection" sectionLabel="두번째 섹션" />
      </div>
    </div>
  );
} 