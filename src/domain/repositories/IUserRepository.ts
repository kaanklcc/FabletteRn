/**
 * IUserRepository Interface
 * 
 * Kullanıcı verileri işlemleri için sözleşme.
 * Firestore "users" collection'ı ile ilgili işlemler.
 * 
 * Clean Architecture:
 * - Domain layer interface
 * - Implementation data layer'da
 */

import { User } from '../entities/User';

export interface IUserRepository {
    /**
     * Kullanıcı verilerini getir
     * 
     * @param userId - Kullanıcı ID
     * @returns Promise<User | null>
     */
    getUserData(userId: string): Promise<User | null>;

    /**
     * Premium durumunu güncelle
     * 
     * @param userId - Kullanıcı ID
     * @param isPremium - Premium durumu
     * @param durationDays - Premium süresi (gün)
     * @returns Promise<void>
     */
    updatePremiumStatus(
        userId: string,
        isPremium: boolean,
        durationDays: number,
        remainingCredits?: number
    ): Promise<void>;

    /**
     * Kullanıcının kalan hakkını azalt
     * 
     * @param userId - Kullanıcı ID
     * @returns Promise<void>
     */
    decrementCredits(userId: string): Promise<void>;

    /**
     * Premium süresini kapat (expire olduğunda)
     * 
     * @param userId - Kullanıcı ID
     * @returns Promise<void>
     */
    expirePremium(userId: string): Promise<void>;

    /**
     * Kullanıcı verilerini kaydet (ilk kayıt)
     * 
     * @param userId - Kullanıcı ID
     * @param firstName - Ad
     * @param lastName - Soyad
     * @param email - Email
     * @returns Promise<void>
     */
    saveUserData(
        userId: string,
        firstName: string,
        lastName: string,
        email: string
    ): Promise<void>;

    /**
     * Hesabı tamamen sil: Firestore verisi + Firebase Auth kullanıcısı
     *
     * @param userId - Kullanıcı ID
     * @returns Promise<void>
     */
    deleteAccount(userId: string): Promise<void>;
}
