/**
 * IAuthRepository Interface
 * 
 * Authentication işlemleri için SÖZLEŞME (contract).
 * Bu interface, "Auth işlemleri ŞU ŞEKİLDE yapılmalı" der.
 * AMA nasıl yapılacağını söylemez (Firebase mi, REST API mi bilmez).
 * 
 * 🎯 Clean Architecture Prensibi:
 * Domain katmanı sadece "NE yapılacak" bilir, "NASIL yapılacak" bilmez.
 * 
 * Kotlin karşılaştırması:
 * Kotlin'de repository pattern kullanılmadı, doğrudan ViewModel'de Firebase çağrıldı.
 * Clean Architecture'da önce interface tanımlarız, sonra implement ederiz.
 */

import { User } from '../entities/User';

export interface IAuthRepository {
    /**
     * Email ve şifre ile giriş yap
     * 
     * @param email - Kullanıcı email
     * @param password - Kullanıcı şifresi
     * @returns Promise<User> - Başarılı ise User objesi döner
     * @throws Error - Hata durumunda exception fırlatır
     * 
     * Kotlin karşılığı:
     * DiscoveryBoxDataSource.signInWithEmail(email, password, onResult)
     */
    signInWithEmail(email: string, password: string): Promise<User>;

    /**
     * Email ve şifre ile kayıt ol
     * 
     * @param email - Kullanıcı email
     * @param password - Kullanıcı şifresi
     * @param displayName - Kullanıcı adı (opsiyonel)
     * @returns Promise<User>
     * 
     * Kotlin karşılığı:
     * DiscoveryBoxDataSource.signUpWithEmail(email, password, onResult)
     */
    signUpWithEmail(email: string, password: string, displayName?: string): Promise<User>;

    /**
     * Google ile giriş yap
     * 
     * @returns Promise<User>
     * 
     * Kotlin karşılığı:
     * DiscoveryBoxDataSource.signInWithGoogle(credential, onResult)
     */
    signInWithGoogle(): Promise<User>;

    /**
     * Çıkış yap
     * 
     * @returns Promise<void>
     * 
     * Kotlin karşılığı:
     * DiscoveryBoxDataSource.signOut(context)
     */
    logout(): Promise<void>;

    /**
     * Mevcut kullanıcıyı getir (varsa)
     * 
     * @returns Promise<User | null>
     */
    getCurrentUser(): Promise<User | null>;

    /**
     * Auth durumu değişikliklerini dinle
     * 
     * @param callback - User değiştiğinde çağrılacak fonksiyon
     * @returns Unsubscribe fonksiyonu
     * 
     * Kotlin karşılığı:
     * Firebase.auth.addAuthStateListener { }
     */
    onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
