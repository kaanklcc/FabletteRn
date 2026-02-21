/**
 * ═══════════════════════════════════════════════════════════════
 * USER REPOSITORY IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════
 * 
 * IUserRepository interface'inin Firestore implementasyonu
 * 
 * Clean Architecture:
 * - Domain layer'daki interface'i implement eder
 * - Firebase'e bağımlıdır (data layer)
 * - Use case'ler bu implementation'ı kullanır
 */

import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { User } from '@/domain/entities/User';
import { IUserRepository } from '@/domain/repositories/IUserRepository';

export class UserRepositoryImpl implements IUserRepository {
    /**
     * Kullanıcı verilerini getir
     */
    async getUserData(userId: string): Promise<User | null> {
        const userRef = doc(db, 'users', userId);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) return null;

        const data = snapshot.data();
        return {
            uid: userId,
            firstName: data.ad || '',
            lastName: data.soyad || '',
            email: data.email || '',
            usedFreeTrial: data.usedFreeTrial || false,
            isPremium: data.premium || false,
            remainingCredits: data.remainingChatgptUses || 0,
            premiumStartDate: data.premiumStartDate?.toDate() || null,
            premiumDurationDays: data.premiumDurationDays || 0,
            photoURL: auth.currentUser?.photoURL || undefined,
            emailVerified: auth.currentUser?.emailVerified || false,
        };
    }

    /**
     * Premium durumunu güncelle
     */
    async updatePremiumStatus(
        userId: string,
        isPremium: boolean,
        durationDays: number,
        remainingCredits?: number
    ): Promise<void> {
        const userRef = doc(db, 'users', userId);
        const updateData: any = {
            premium: isPremium,
            premiumStartDate: isPremium ? new Date() : null,
            premiumDurationDays: durationDays,
        };
        if (remainingCredits !== undefined) {
            updateData.remainingChatgptUses = remainingCredits;
        }
        await updateDoc(userRef, updateData);
    }

    /**
     * Premium süresini kapat (expire olduğunda)
     * 
     * Kotlin karşılığı: AnasayfaViewModel.checkUserAccess() satır 91-98
     * premium: false, remainingChatgptUses: 0 yapar
     */
    async expirePremium(userId: string): Promise<void> {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            premium: false,
            remainingChatgptUses: 0,
        });
    }

    /**
     * Hikaye hakkını azalt
     */
    async decrementCredits(userId: string): Promise<void> {
        const userRef = doc(db, 'users', userId);
        const snapshot = await getDoc(userRef);
        const currentCredits = snapshot.data()?.remainingChatgptUses || 0;

        if (currentCredits > 0) {
            await updateDoc(userRef, {
                remainingChatgptUses: currentCredits - 1,
            });
        }
    }

    /**
     * Kullanıcı verilerini kaydet (ilk kayıt)
     * 
     * Firestore'da oluşan belge yapısı:
     * {
     *   ad: "Kullanıcı Adı",
     *   soyad: "",
     *   email: "user@example.com",
     *   premium: false,
     *   premiumStartDate: null,
     *   premiumDurationDays: 0,
     *   remainingChatgptUses: 0,
     *   usedFreeTrial: true
     * }
     */
    async saveUserData(
        userId: string,
        firstName: string,
        lastName: string,
        email: string
    ): Promise<void> {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            ad: firstName,
            soyad: lastName,
            email,
            premium: false,
            premiumStartDate: null,
            premiumDurationDays: 0,
            remainingChatgptUses: 0,
            usedFreeTrial: true,
        });
    }

    /**
     * Hesabı tamamen sil
     * 1. users/{userId}/hikayeler subcollection'daki tüm dokümanlar
     * 2. users/{userId} dokümanı
     * 3. Firebase Auth kullanıcısı
     */
    async deleteAccount(userId: string): Promise<void> {
        // 1. Hikayeler subcollection'1nı sil
        const hikayelerRef = collection(db, 'users', userId, 'hikayeler');
        const hikayelerSnapshot = await getDocs(hikayelerRef);
        const deletePromises = hikayelerSnapshot.docs.map(d => deleteDoc(d.ref));
        await Promise.all(deletePromises);

        // 2. users dokümanını sil
        await deleteDoc(doc(db, 'users', userId));

        // 3. Firebase Auth kullanıcısını sil
        const currentUser = auth.currentUser;
        if (currentUser) {
            await currentUser.delete();
        }
    }
}
