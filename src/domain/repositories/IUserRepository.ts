/**
 * IUserRepository Interface
 * 
 * Kullanıcı verileri işlemleri için sözleşme.
 * Firestore "users" collection'ı ile ilgili işlemler.
 */

import { UserData } from '../entities/UserData';

export interface IUserRepository {
    /**
     * Kullanıcı verilerini getir
     * 
     * @param userId - Kullanıcı ID
     * @returns Promise<UserData | null>
     * 
     * Kotlin karşılığı:
     * Firestore.collection("users").document(userId).get()
     */
    getUserData(userId: string): Promise<UserData | null>;

    /**
     * Kullanıcı verilerini güncelle
     * 
     * @param userId - Kullanıcı ID
     * @param data - Güncellenecek veriler (partial update)
     * @returns Promise<void>
     */
    updateUserData(userId: string, data: Partial<UserData>): Promise<void>;

    /**
     * Yeni kullanıcı verisi oluştur
     * 
     * @param userId - Kullanıcı ID
     * @param userData - Başlangıç verileri
     * @returns Promise<void>
     * 
     * Kotlin karşılığı:
     * DiscoveryBoxDataSource.saveUserData(userId, ad, soyad, email, onResult)
     */
    createUserData(userId: string, userData: UserData): Promise<void>;

    /**
     * Kullanıcı erişim haklarını kontrol et
     * 
     * @param userId - Kullanıcı ID
     * @returns Promise<{canCreateStory: boolean, isPremium: boolean, usedFreeTrial: boolean}>
     * 
     * Kotlin karşılığı:
     * AnasayfaViewModel.checkUserAccess(onResult)
     */
    checkUserAccess(userId: string): Promise<{
        canCreateFullStory: boolean;
        isPremium: boolean;
        usedFreeTrial: boolean;
        remainingUses: number;
    }>;

    /**
     * Kullanıcının kalan hakkını azalt
     * 
     * @param userId - Kullanıcı ID
     * @returns Promise<void>
     * 
     * Kotlin karşılığı:
     * DiscoveryBoxDataSource.decrementChatGptUse(userId, onComplete)
     */
    decrementUserUses(userId: string): Promise<void>;
}
