/**
 * User Entity
 * 
 * Firebase Authentication ve Firestore kullanıcısını temsil eder.
 */

export interface User {
    /**
     * Firebase Auth User ID
     */
    uid: string;

    /**
     * Kullanıcı adı (Firestore: "ad")
     */
    firstName: string;

    /**
     * Kullanıcı soyadı (Firestore: "soyad")
     */
    lastName: string;

    /**
     * Kullanıcı email adresi
     */
    email: string;

    /**
     * Ücretsiz deneme kullanıldı mı?
     */
    usedFreeTrial: boolean;

    /**
     * Premium üye mi?
     */
    isPremium: boolean;

    /**
     * Kalan hikaye oluşturma hakkı
     */
    remainingCredits: number;

    /**
     * Premium başlangıç tarihi
     */
    premiumStartDate: Date | null;

    /**
     * Premium süre (gün)
     */
    premiumDurationDays: number;

    /**
     * Profil fotoğrafı URL (opsiyonel)
     */
    photoURL?: string;

    /**
     * Email doğrulanmış mı?
     */
    emailVerified?: boolean;
}
