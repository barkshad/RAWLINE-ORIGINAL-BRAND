
/**
 * =========================================================================
 * CRITICAL: HOW TO FIX "MISSING OR INSUFFICIENT PERMISSIONS"
 * =========================================================================
 * The "Permission Denied" error is caused by Firebase Security Rules blocking
 * unauthorized access. You MUST manually update these rules in your Firebase Console.
 * 
 * 1. Go to: https://console.firebase.google.com/
 * 2. Select Project: "rawline-88624"
 * 3. Click "Firestore Database" in the left sidebar.
 * 4. Click the "Rules" tab at the top.
 * 5. Replace the existing code with exactly this:
 * 
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     // Site Content & Settings - Publicly readable, writeable by logged-in admin
 *     match /settings/{document} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 *     // Artifact Database - Publicly readable, writeable by logged-in admin
 *     match /pieces/{document} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 *   }
 * }
 * 
 * 6. Click "Publish".
 * =========================================================================
 */

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

// Firebase web app configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4eUxmQpQFye1WbzFbH5nLUdY8WdD8X30",
  authDomain: "rawline-88624.firebaseapp.com",
  projectId: "rawline-88624",
  storageBucket: "rawline-88624.firebasestorage.app",
  messagingSenderId: "524955686374",
  appId: "1:524955686374:web:f68d98cee40726209ab227"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

const PIECES_COLLECTION = "pieces";
const SETTINGS_COLLECTION = "settings";
const CONTENT_DOC_ID = "main_content";

/**
 * Fetches pieces without a complex query to avoid index/permission traps.
 * Sorting is handled in-memory.
 */
export const getPieces = async (): Promise<Piece[]> => {
  const q = query(collection(db, PIECES_COLLECTION));
  const snapshot = await getDocs(q);
  
  const fetchedPieces = snapshot.docs.map(d => ({ 
    id: d.id, 
    ...d.data() 
  } as Piece));

  // Sort by createdAt manually if it exists
  return fetchedPieces.sort((a: any, b: any) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });
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
  const docRef = doc(db, SETTINGS_COLLECTION, CONTENT_DOC_ID);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as SiteContent) : null;
};

export const saveSiteContent = async (content: SiteContent) => {
  const docRef = doc(db, SETTINGS_COLLECTION, CONTENT_DOC_ID);
  return await setDoc(docRef, content);
};
