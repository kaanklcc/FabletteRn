/**
 * ═══════════════════════════════════════════════════════════════
 * FIREBASE CONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 * 
 * 🔥 MEVCUT FIREBASE PROJESİ KULLANILIYOR
 * 
 * Bu config, DiscoveryBox2 Android projesindeki aynı Firebase
 * projesini kullanıyor.
 * 
 * Project: storyteller-23720
 * 
 * ÖNEMLİ: Bu dosya .gitignore'a eklenmeli!
 * API key'ler public olmamalı.
 * 
 * ═══════════════════════════════════════════════════════════════
 * KOTLIN KARŞILAŞTIRMASI
 * ═══════════════════════════════════════════════════════════════
 * 
 * Kotlin'de (Android):
 * - google-services.json otomatik okunur
 * - Firebase.initializeApp(context) yeterli
 * 
 * React Native'de:
 * - Manuel config gerekir
 * - initializeApp(firebaseConfig) ile başlatılır
 */

import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

/**
 * Firebase Configuration
 * 
 * Tüm değerler .env dosyasından okunur.
 * Bkz: .env.example
 */
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
};

/**
 * Initialize Firebase
 * 
 * Kotlin karşılığı:
 * Firebase.initializeApp(context)
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Services
 * 
 * Kotlin karşılığı:
 * val auth = Firebase.auth
 * val db = Firebase.firestore
 * val storage = Firebase.storage
 */

/**
 * Firebase Authentication (AsyncStorage persistence)
 *
 * Expo Go'da auth state'in korunması için AsyncStorage kullanılır.
 * getAuth() varsayılan web persistence kullanır (localStorage/indexedDB)
 * ki React Native'de çalışmaz → her yenilemede kullanıcı kaybolur.
 *
 * initializeAuth + getReactNativePersistence ile auth state
 * AsyncStorage'da saklanır → kullanıcı oturumu korunur.
 */
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

/**
 * Firestore Database
 * 
 * Kullanım:
 * import { db } from '@/config/firebase';
 * const docRef = doc(db, 'users', userId);
 */
export const db = getFirestore(app);

/**
 * Firebase Storage
 * 
 * Kullanım:
 * import { storage } from '@/config/firebase';
 * const storageRef = ref(storage, 'images/story.jpg');
 */
export const storage = getStorage(app);

/**
 * Firebase Cloud Functions (europe-west1 region)
 * 
 * Kotlin karşılığı:
 * CloudFunctionsHelper.kt içinde Firebase.functions("europe-west1")
 * 
 * Kullanım:
 * import { functions } from '@/config/firebase';
 * import { httpsCallable } from 'firebase/functions';
 * const generateStory = httpsCallable(functions, 'generateStory');
 */
export const functions = getFunctions(app, 'europe-west1');

/**
 * ═══════════════════════════════════════════════════════════════
 * KULLANIM ÖRNEKLERİ
 * ═══════════════════════════════════════════════════════════════
 * 
 * 1. Authentication:
 * 
 * import { auth } from '@/config/firebase';
 * import { signInWithEmailAndPassword } from 'firebase/auth';
 * 
 * const login = async (email: string, password: string) => {
 *   const userCredential = await signInWithEmailAndPassword(auth, email, password);
 *   return userCredential.user;
 * };
 * 
 * 2. Firestore:
 * 
 * import { db } from '@/config/firebase';
 * import { doc, getDoc } from 'firebase/firestore';
 * 
 * const getUserData = async (userId: string) => {
 *   const docRef = doc(db, 'users', userId);
 *   const docSnap = await getDoc(docRef);
 *   return docSnap.data();
 * };
 * 
 * 3. Storage:
 * 
 * import { storage } from '@/config/firebase';
 * import { ref, uploadBytes } from 'firebase/storage';
 * 
 * const uploadImage = async (file: Blob) => {
 *   const storageRef = ref(storage, 'images/story.jpg');
 *   await uploadBytes(storageRef, file);
 * };
 */

/**
 * ═══════════════════════════════════════════════════════════════
 * GÜVENLİK NOTU
 * ═══════════════════════════════════════════════════════════════
 * 
 * ✅ Tüm API key'ler .env dosyasından okunuyor.
 * .env dosyası .gitignore'da tanımlı, GitHub'a commit edilmez.
 * 
 * Yeni developers için: .env.example dosyasını .env olarak kopyalayıp
 * kendi değerlerini girmeleri yeterlidir.
 */
