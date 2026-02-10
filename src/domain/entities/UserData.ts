/**
 * UserData Entity
 * 
 * Kotlin karşılığı: com.kaankilic.discoverybox.entitiy.UserData
 * 
 * Firestore'daki "users" collection'ında saklanan kullanıcı verileri.
 * Premium durumu, kalan haklar, kullanıcı bilgileri (ad, soyad, email) burada.
 * 
 * ⚠️ ÖNEMLİ AYRIM:
 * - User entity → Firebase Authentication kullanıcısı (uid, email, displayName)
 * - UserData entity → Firestore "users" collection'ındaki döküman (premium, ad, soyad, vb.)
 * 
 * 📊 Firestore'daki gerçek şema (senin örneğinden):
 * {
 *   ad: "Sarvar Mamarasulov",
 *   soyad: "",
 *   email: "smamarasulov754@gmail.com",
 *   premium: false,
 *   premiumStartDate: null,
 *   premiumDurationDays: 0,
 *   remainingChatgptUses: 0,
 *   usedFreeTrial: true
 * }
 */

export interface UserData {
    /**
     * Kullanıcı adı
     * Firestore field: "ad"
     * 
     * Kotlin karşılığı:
     * DiscoveryBoxDataSource.saveUserData(userId, ad, soyad, email, onResult)
     */
    ad: string;

    /**
     * Kullanıcı soyadı
     * Firestore field: "soyad"
     */
    soyad: string;

    /**
     * Kullanıcı email adresi
     * Firestore field: "email"
     * (Firebase Auth'tan kopyalanır, kayıt sırasında)
     */
    email: string;

    /**
     * Premium üye mi?
     * Firestore field: "premium"
     */
    premium: boolean;

    /**
     * Premium başlangıç tarihi
     * Firestore field: "premiumStartDate" (Timestamp veya null)
     * 
     * TypeScript'te Date | null olarak tanımlanır
     * Firestore'dan okurken Timestamp → Date dönüşümü yapılır
     */
    premiumStartDate: Date | null;

    /**
     * Premium süre (gün cinsinden)
     * Firestore field: "premiumDurationDays"
     * 
     * Örnek: 30 (aylık), 365 (yıllık)
     */
    premiumDurationDays: number;

    /**
     * Kalan ChatGPT kullanım hakkı
     * Firestore field: "remainingChatgptUses"
     * 
     * Premium kullanıcılar için yüksek değer (örn: 1000)
     * Ücretsiz kullanıcılar için düşük değer (örn: 1)
     */
    remainingChatgptUses: number;

    /**
     * Ücretsiz deneme kullanıldı mı?
     * Firestore field: "usedFreeTrial"
     * 
     * true = kullanıldı (artık deneme hakkı yok)
     * false = henüz kullanılmadı (1 deneme hakkı var)
     */
    usedFreeTrial: boolean;

    // ─────────────────────────────────────────────────────────
    // Aşağıdaki alanlar eski Kotlin kodundan geliyordu
    // ama şu anki Firestore şemasında YOK
    // Opsiyonel olarak bırakıyoruz, eski verilerle uyumluluk için
    // ─────────────────────────────────────────────────────────

    /**
     * Bugün izlenen reklam sayısı
     * (Not: Reklam sistemi kaldırıldı, eski veriler için)
     * Firestore'da olmayabilir, opsiyonel
     */
    adsWatchedToday?: number;

    /**
     * Günlük maksimum reklam sayısı
     * Firestore'da olmayabilir, opsiyonel
     */
    maxAdsPerDay?: number;

    /**
     * Kalan ücretsiz kullanım hakkı
     * Firestore'da olmayabilir, opsiyonel
     */
    remainingFreeUses?: number;

    /**
     * Son ücretsiz kullanım sıfırlama tarihi
     * Format: "YYYY-MM-DD"
     * Firestore'da olmayabilir, opsiyonel
     */
    lastFreeUseReset?: string;
}

/**
 * Firestore'a yeni kullanıcı kaydederken kullanılan DTO
 * 
 * Kotlin karşılığı:
 * DiscoveryBoxDataSource.saveUserData(userId, ad, soyad, email, onResult)
 * 
 * Kullanım:
 * - Kayıt ekranında kullanıcı bilgileri alınır
 * - Firebase Auth ile kullanıcı oluşturulur
 * - Firestore "users" collection'ına bu DTO ile döküman eklenir
 */
export interface CreateUserDataDTO {
    ad: string;
    soyad: string;
    email: string;
    premium: boolean;
    premiumStartDate: Date | null;
    premiumDurationDays: number;
    remainingChatgptUses: number;
    usedFreeTrial: boolean;
}
