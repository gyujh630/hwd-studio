"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  fetchSectionConfig,
  updateSectionConfig,
  uploadSectionImage,
  deleteSectionImageByUrl
} from "@/lib/firebaseSiteConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

function SectionEditor({ sectionName, sectionLabel }) {
  const [media, setMedia] = useState([]); // [{file, preview, url, type, poster}]
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
          // media 우선, 없으면 images fallback
          if (data.media) {
            setMedia(data.media.map(item => ({ ...item, url: item.src })));
          } else if (data.images) {
            setMedia(data.images.map(url => ({ type: "image", url, src: url })));
          } else {
            setMedia([]);
          }
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

  // 미디어 추가 (이미지/비디오)
  const handleMediaAdd = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - media.length);
    const newMedia = files.map(file => {
      const isVideo = file.type.startsWith("video/");
      // 동영상 용량/포맷 제한
      if (isVideo) {
        if (!['video/mp4', 'video/webm'].includes(file.type)) {
          alert("mp4 또는 webm 형식의 동영상만 업로드 가능합니다.");
          return null;
        }
        if (file.size > 20 * 1024 * 1024) {
          alert("동영상은 20MB 이하만 업로드 가능합니다.");
          return null;
        }
      }
      return {
        file,
        preview: URL.createObjectURL(file),
        type: isVideo ? "video" : "image",
        poster: undefined, // 추후 썸네일 지원 가능
      };
    }).filter(Boolean);
    setMedia([...media, ...newMedia]);
    e.target.value = "";
  };
  // 미디어 삭제
  const handleMediaRemove = async (idx) => {
    const m = media[idx];
    if (m.url && !m.file) {
      // 기존 이미지/비디오면 Storage에서 삭제
      try {
        await deleteSectionImageByUrl(m.url);
      } catch (e) {
        console.error("Storage 삭제 실패:", e);
      }
    }
    setMedia(media.filter((_, i) => i !== idx));
  };
  // 미디어 순서 변경
  const moveMedia = (from, to) => {
    if (to < 0 || to >= media.length) return;
    const arr = [...media];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setMedia(arr);
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
      const uploadedMedia = await Promise.all(media.map(async (m, idx) => {
        if (m.file) {
          // 이미지/비디오 업로드 (uploadSectionImage는 이미지만 지원, 비디오는 별도 구현 필요)
          if (m.type === "image") {
            const url = await uploadSectionImage(m.file, sectionName, idx);
            return { type: "image", src: url };
          } else if (m.type === "video") {
            // 비디오 업로드: Storage 직접 업로드
            const storageRef = ref(storage, `siteConfig/${sectionName}/video_${Date.now()}_${idx}_${m.file.name}`);
            await uploadBytes(storageRef, m.file);
            const url = await getDownloadURL(storageRef);
            return { type: "video", src: url, poster: m.poster };
          }
        } else {
          // 기존 미디어
          return { type: m.type, src: m.url, poster: m.poster };
        }
      }));
      await updateSectionConfig(sectionName, {
        media: uploadedMedia,
        titles,
        descs,
        caption
      });
      setMedia(uploadedMedia.map(item => ({ ...item, url: item.src })));
      setSuccess(true);
    } catch (err) {
      setError("저장 중 오류가 발생했습니다. (로그인 필요/권한/네트워크 등)");
      console.log(err);
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
          {/* 미디어 업로드 */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">
              사진/동영상
            </label>
            <div className="text-xs text-gray-400 mb-1">
              4:3 비율 권장 / 이미지 또는 mp4/webm 동영상 / 합산 5개까지 첨부 가능 (동영상 20MB
              이하)
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/mp4,video/webm"
              multiple
              onChange={handleMediaAdd}
              className="hidden"
              disabled={media.length >= 5 || saving}
            />
            <button
              type="button"
              className="admin-btn my-2"
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
              disabled={media.length >= 5 || saving}
            >
              파일 선택 / 추가
            </button>
            <span className="ml-2 text-sm text-gray-500">{media.length}/5</span>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {media.map((m, idx) => (
                <div
                  key={idx}
                  className="relative rounded p-2 bg-white border border-gray-200 flex flex-col items-center"
                >
                  {m.type === "image" && (m.preview || m.url) ? (
                    <div
                      style={{
                        width: 150,
                        height: 120,
                        background: "#eee",
                        borderRadius: 4,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        src={m.preview || m.url}
                        alt="미리보기"
                        width={150}
                        height={120}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                  ) : m.type === "video" && (m.preview || m.url) ? (
                    <div
                      style={{
                        width: 150,
                        height: 120,
                        background: "#222",
                        borderRadius: 4,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <video
                        src={m.preview || m.url}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        controls
                        preload="metadata"
                      />
                    </div>
                  ) : null}
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      className="bg-gray-200 px-2 py-1 text-xs font-light cursor-pointer"
                      onClick={() => moveMedia(idx, idx - 1)}
                      disabled={idx === 0 || saving}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="bg-gray-200 px-2 py-1 text-xs font-light cursor-pointer"
                      onClick={() => moveMedia(idx, idx + 1)}
                      disabled={idx === media.length - 1 || saving}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="bg-gray-200 px-2 py-1 text-xs font-light cursor-pointer"
                      onClick={() => handleMediaRemove(idx)}
                      disabled={saving}
                    >
                      삭제
                    </button>
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
                onChange={(e) => handleTitle(i, e.target.value)}
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
                onChange={(e) => handleDesc(i, e.target.value)}
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
              onChange={(e) => setCaption(e.target.value)}
              placeholder="caption"
              disabled={saving}
            />
          </div>
          <button
            className="admin-btn w-full"
            type="button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "저장 중..." : "저장"}
          </button>
          {error && (
            <div className="text-center text-red-500 mt-4">{error}</div>
          )}
          {success && (
            <div className="text-center text-green-600 mt-4">
              저장되었습니다!
            </div>
          )}
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