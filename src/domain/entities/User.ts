/**
 * User Entity
 * 
 * Firebase Authentication kullanıcısını temsil eder.
 */

export interface User {
    /**
     * Firebase Auth User ID
     */
    uid: string;

    /**
     * Kullanıcı email adresi
     */
    email: string;

    /**
     * Kullanıcı adı (opsiyonel)
     * Google Sign-In'de displayName'den gelir
     */
    displayName?: string;

    /**
     * Profil fotoğrafı URL (opsiyonel)
     * Google Sign-In'de photoURL'den gelir
     */
    photoURL?: string;

    /**
     * Email doğrulanmış mı?
     */
    emailVerified: boolean;
}
