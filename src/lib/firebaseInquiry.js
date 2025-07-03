import { db, storage } from "./firebase";
import { collection, addDoc, updateDoc, Timestamp, getDocs, query, orderBy, limit, startAfter, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// 주문제작 문의 저장 (비로그인, 첨부파일 업로드 포함)
export async function submitCustomOrderInquiry({ name, phone, email, title, body, files }) {
  // 1. Firestore에 문서 생성 (선 파일 없이)
  const docRef = await addDoc(collection(db, "customOrders"), {
    name,
    phone,
    email,
    title,
    body,
    createdAt: Timestamp.now(),
    fileUrls: [],
  });
  const orderId = docRef.id;

  // 2. 파일 업로드 (최대 2개)
  let fileUrls = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file) {
      const storageRef = ref(storage, `customOrders/${orderId}/${uuidv4()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      fileUrls.push(url);
    } else {
      fileUrls.push(null);
    }
  }

  // 3. Firestore 문서에 파일 URL 업데이트
  await updateDoc(docRef, { fileUrls });
  return orderId;
}

export async function fetchCustomOrderList() {
  const q = query(collection(db, "customOrders"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchCustomOrderListPaginated({ pageSize = 10, lastDoc = null }) {
  let q = query(collection(db, "customOrders"), orderBy("createdAt", "desc"), limit(pageSize));
  if (lastDoc) q = query(q, startAfter(lastDoc));
  const snap = await getDocs(q);
  const orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return { orders, lastDoc: snap.docs[snap.docs.length - 1] };
}

export async function fetchCustomOrderById(id) {
  const docRef = doc(db, "customOrders", id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id, ...snap.data() };
} 