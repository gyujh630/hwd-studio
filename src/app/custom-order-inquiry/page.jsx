"use client";

import { useState, useRef } from "react";
import { submitCustomOrderInquiry } from "@/lib/firebaseInquiry";
import { useRouter } from "next/navigation";
import Footer from "@/components/common/Footer";

const MAX_TITLE_LENGTH = 50;
const MAX_BODY_LENGTH = 1000;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function CustomOrderInquiryPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    title: "",
    body: "",
    captcha: "",
  });
  const [files, setFiles] = useState([null, null]);
  const [errors, setErrors] = useState({});
  const fileRefs = [useRef(), useRef()];
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (idx, e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      alert("첨부파일은 5MB 이하만 업로드 가능합니다.");
      e.target.value = "";
      return;
    }
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles[idx] = file;
      return newFiles;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!form.name) newErrors.name = "이름을 입력하세요.";
    if (!form.phone) newErrors.phone = "전화번호를 입력하세요.";
    if (!form.email) newErrors.email = "이메일을 입력하세요.";
    if (!form.title) newErrors.title = "제목을 입력하세요.";
    if (form.title.length > MAX_TITLE_LENGTH) newErrors.title = `제목은 ${MAX_TITLE_LENGTH}자 이내여야 합니다.`;
    if (!form.body) newErrors.body = "본문을 입력하세요.";
    if (form.body.length > MAX_BODY_LENGTH) newErrors.body = `본문은 ${MAX_BODY_LENGTH}자 이내여야 합니다.`;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      await submitCustomOrderInquiry({
        name: form.name,
        phone: form.phone,
        email: form.email,
        title: form.title,
        body: form.body,
        files,
      });
      alert("등록이 완료되었습니다.");
      setForm({ name: "", phone: "", email: "", title: "", body: "", captcha: "" });
      setFiles([null, null]);
      fileRefs.forEach(ref => { if (ref.current) ref.current.value = ""; });
      router.push("/");
    } catch (err) {
      alert("등록에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  // Add a helper to check if all required fields are filled and valid
  const isFormValid =
    form.name.trim() &&
    form.phone.trim() &&
    form.email.trim() &&
    form.title.trim() &&
    form.title.length <= MAX_TITLE_LENGTH &&
    form.body.trim() &&
    form.body.length <= MAX_BODY_LENGTH &&
    form.captcha.trim();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="w-full mx-auto pt-4 md:pt-32 pb-12 px-4 overflow-auto metallic-base-bg">
          <div className="max-w-xl mx-auto rounded-2xl p-6 sm:p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">주문제작 문의</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-semibold mb-1">주문자 이름 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg shadow-inner px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                  maxLength={30}
                  required
                  placeholder="ex) 홍길동"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block font-semibold mb-1">전화번호 <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg shadow-inner px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                  maxLength={20}
                  required
                  placeholder="ex) 010-XXXX-XXXX"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block font-semibold mb-1">이메일 <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg shadow-inner px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                  maxLength={50}
                  required
                  placeholder="ex) hollywood@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block font-semibold mb-1">제목 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg shadow-inner px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                  maxLength={MAX_TITLE_LENGTH}
                  required
                  placeholder="제목을 입력하세요"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{form.title.length} / {MAX_TITLE_LENGTH}자</span>
                  {errors.title && <span className="text-red-500">{errors.title}</span>}
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">본문 <span className="text-red-500">*</span></label>
                <textarea
                  name="body"
                  value={form.body}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg shadow-inner px-4 py-3 min-h-[180px] focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                  maxLength={MAX_BODY_LENGTH}
                  required
                  placeholder="문의 내용을 입력하세요"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{form.body.length} / {MAX_BODY_LENGTH}자</span>
                  {errors.body && <span className="text-red-500">{errors.body}</span>}
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">첨부파일1</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => fileRefs[0].current.click()} className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-sm font-medium cursor-pointer">
                    파일 선택
                  </button>
                  <span className="text-xs text-gray-600 truncate max-w-[160px]">
                    {files[0]?.name || "선택된 파일 없음"}
                  </span>
                </div>
                <input
                  type="file"
                  ref={fileRefs[0]}
                  onChange={(e) => handleFileChange(0, e)}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">첨부파일2</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => fileRefs[1].current.click()} className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-sm font-medium cursor-pointer">
                    파일 선택
                  </button>
                  <span className="text-xs text-gray-600 truncate max-w-[160px]">
                    {files[1]?.name || "선택된 파일 없음"}
                  </span>
                </div>
                <input
                  type="file"
                  ref={fileRefs[1]}
                  onChange={(e) => handleFileChange(1, e)}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">보안문자 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="captcha"
                  value={form.captcha}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg shadow-inner px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                  maxLength={10}
                  required
                  placeholder="보안문자 입력"
                />
              </div>
              <button
                type="submit"
                className={`w-full font-semibold py-2 text-lg rounded-lg transition ${
                  isFormValid && !loading
                    ? "btn-primary cursor-pointer"
                    : "bg-gray-300 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!isFormValid || loading}
              >
                {loading ? "등록 중..." : "등록"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 