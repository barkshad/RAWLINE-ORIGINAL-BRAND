import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  doc, 
  deleteDoc, 
  updateDoc,
  setDoc,
  getDoc,
  serverTimestamp 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Piece, SiteContent } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyD4eUxmQpQFye1WbzFbH5nLUdY8WdD8X30",
  authDomain: "rawline-88624.firebaseapp.com",
  projectId: "rawline-88624",
  storageBucket: "rawline-88624.firebasestorage.app",
  messagingSenderId: "524955686374",
  appId: "1:524955686374:web:f68d98cee40726209ab227"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

const PIECES_COLLECTION = "pieces";
const SETTINGS_COLLECTION = "settings";
const CONTENT_DOC_ID = "main_content";

export const getPieces = async (): Promise<Piece[]> => {
  try {
    const q = query(collection(db, PIECES_COLLECTION));
    const snapshot = await getDocs(q);
    const fetchedPieces = snapshot.docs.map(d => ({ 
      id: d.id, 
      ...d.data() 
    } as Piece));

    return fetchedPieces.sort((a: any, b: any) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.warn("Firestore fetch error. Using local fallbacks.");
    return [];
  }
};

export const createPiece = async (piece: Omit<Piece, "id">) => {
  return await addDoc(collection(db, PIECES_COLLECTION), {
    ...piece,
    createdAt: serverTimestamp()
  });
};

export const updatePieceData = async (id: string, data: Partial<Piece>) => {
  const docRef = doc(db, PIECES_COLLECTION, id);
  return await updateDoc(docRef, data);
};

export const removePiece = async (id: string) => {
  return await deleteDoc(doc(db, PIECES_COLLECTION, id));
};

export const getSiteContent = async (): Promise<SiteContent | null> => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, CONTENT_DOC_ID);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as SiteContent) : null;
  } catch (e) {
    return null;
  }
};

export const saveSiteContent = async (content: SiteContent) => {
  const docRef = doc(db, SETTINGS_COLLECTION, CONTENT_DOC_ID);
  return await setDoc(docRef, content);
};