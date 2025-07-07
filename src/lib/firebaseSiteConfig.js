import { db, storage, auth } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

function checkAuthOrRedirect() {
  if (!auth.currentUser) {
    if (typeof window !== "undefined") {
      window.alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
      window.location.href = "/dashboard-hwd/login";
    }
    throw new Error("로그인 필요");
  }
}

// 이미지 업로드 (섹션별, 최대 5장, 순서 보장)
export async function uploadSectionImage(file, section, idx) {
  checkAuthOrRedirect();
  const storageRef = ref(storage, `siteConfig/${section}/${Date.now()}_${idx}_${uuidv4()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// 이미지 삭제 (Storage에서)
export async function deleteSectionImageByUrl(url) {
  checkAuthOrRedirect();
  const storageRef = ref(storage, url.replace(/^https?:\/\/[^/]+\//, ""));
  await deleteObject(storageRef);
}

// 섹션 데이터 불러오기 (productSection, customMadeSection)
export async function fetchSectionConfig(section) {
  const docRef = doc(db, "siteConfig", "homeSections");
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return snap.data()[section] || null;
}

// 섹션 데이터 저장/수정 (images, titles, descs, caption)
export async function updateSectionConfig(section, { images, titles, descs, caption }) {
  checkAuthOrRedirect();
  const docRef = doc(db, "siteConfig", "homeSections");
  // 병합 저장 (다른 섹션 영향 X)
  await setDoc(docRef, {
    [section]: {
      images, // [url, ...] 최대 5개
      titles, // [title1, title2]
      descs,  // [desc1, desc2, desc3]
      caption // string
    }
  }, { merge: true });
} 