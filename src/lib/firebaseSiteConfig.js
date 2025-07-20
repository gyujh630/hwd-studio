import { db, storage, auth } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, addDoc, deleteDoc, query, orderBy } from "firebase/firestore";
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

// Storage URL에서 실제 경로 추출
function extractStoragePathFromUrl(url) {
  if (url.startsWith("gs://")) {
    return url.replace(/^gs:\/\/[^/]+\//, "");
  }
  if (url.startsWith("/")) {
    return url.replace(/^\//, "");
  }
  if (!url.startsWith("http")) {
    // 이미 내부 경로일 경우
    return url;
  }
  // https://firebasestorage.googleapis.com/v0/b/버킷명/o/경로?alt=media&token=...
  const match = url.match(/\/o\/([^?]+)\?/);
  return match ? decodeURIComponent(match[1]) : null;
}

// 이미지 업로드 (섹션별, 최대 5장, 순서 보장)
export async function uploadSectionImage(file, section, idx) {
  checkAuthOrRedirect();
  const storageRef = ref(storage, `siteConfig/${section}/${Date.now()}_${idx}_${uuidv4()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// 이미지/비디오 삭제 (Storage에서)
export async function deleteSectionImageByUrl(url) {
  checkAuthOrRedirect();
  const storagePath = extractStoragePathFromUrl(url);
  console.log("삭제 시도 storagePath:", storagePath);
  const storageRef = ref(storage, storagePath);
  try {
    await deleteObject(storageRef);
    console.log("삭제 성공");
  } catch (err) {
    console.error("삭제 실패:", err);
    throw err;
  }
}

// 섹션 데이터 불러오기 (productSection, customMadeSection)
export async function fetchSectionConfig(section) {
  const docRef = doc(db, "siteConfig", "homeSections");
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  const data = snap.data()[section] || null;
  // images만 있고 media가 없으면 변환해서 media도 추가
  if (data && !data.media && data.images) {
    data.media = data.images.map((src) => ({ type: "image", src }));
  }
  return data;
}

// 섹션 데이터 저장/수정 (media, images, titles, descs, caption)
export async function updateSectionConfig(section, { media, images, titles, descs, caption }) {
  checkAuthOrRedirect();
  const docRef = doc(db, "siteConfig", "homeSections");
  // media가 있으면 media만 저장, 없으면 images 저장
  const sectionData = {
    titles,
    descs,
    caption
  };
  // undefined 필드 제거
  Object.keys(sectionData).forEach((k) => sectionData[k] === undefined && delete sectionData[k]);
  if (media) {
    // media 배열 내 객체의 undefined 필드도 제거
    sectionData.media = media.map(item => {
      const clean = { ...item };
      Object.keys(clean).forEach(k => clean[k] === undefined && delete clean[k]);
      return clean;
    });
  } else if (images) {
    sectionData.images = images;
  }
  await setDoc(docRef, {
    [section]: sectionData
  }, { merge: true });
}

// 주문제작 갤러리 불러오기 (order 순)
export async function getGallery() {
  const q = query(collection(db, "customMadeGallery"), orderBy("order"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// 갤러리 아이템 추가 (desc, images, order)
export async function addGalleryItem({ desc, images, order }) {
  return await addDoc(collection(db, "customMadeGallery"), { desc, images, order });
}

// 갤러리 아이템 수정
export async function updateGalleryItem(id, { desc, images }) {
  checkAuthOrRedirect();
  return await updateDoc(doc(db, "customMadeGallery", id), { desc, images });
}

// 갤러리 아이템 삭제
export async function deleteGalleryItem(id) {
  return await deleteDoc(doc(db, "customMadeGallery", id));
}

// 갤러리 순서 변경 (order 필드 일괄 업데이트)
export async function reorderGallery(items) {
  // items: [{id, order}, ...]
  const updates = items.map(item => updateDoc(doc(db, "customMadeGallery", item.id), { order: item.order }));
  return Promise.all(updates);
} 