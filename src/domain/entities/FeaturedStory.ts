/**
 * ═══════════════════════════════════════════════════════════════
 * FEATURED STORY ENTITY
 * ═══════════════════════════════════════════════════════════════
 * 
 * Kotlin karşılığı: Hikaye.kt + StoryPage.kt
 * 
 * Firestore Structure:
 * /featuredStories/{storyId}
 *   - title: string (İngilizce başlık)
 *   - title_tr: string (Türkçe başlık)
 *   - pages: array of StoryPage objects
 *       - content: string (İngilizce içerik)
 *       - content_tr: string (Türkçe içerik)
 *       - audioUrl: string (İngilizce ses)
 *       - audio_tr: string (Türkçe ses)
 *       - imageUrl: string (dil-bağımsız)
 *   - coverImageUrl: string
 *   - audioUrl: string (Firebase Storage - tam hikaye sesi)
 *   - theme: string
 *   - order: number
 *   - active: boolean
 *   - createdAt: Timestamp
 * 
 * Her şey Firebase'den gelir: yazı, görsel, ses
 */

/**
 * Hikaye Sayfası
 * 
 * Kotlin karşılığı: StoryPage.kt
 * - pageNumber: sayfa numarası
 * - content: sayfa metni (İngilizce / varsayılan)
 * - content_tr: sayfa metni (Türkçe)
 * - imageUrl: sayfa görseli (Firebase Storage, dil-bağımsız)
 * - audioUrl: sayfa sesi (İngilizce / varsayılan)
 * - audio_tr: sayfa sesi (Türkçe)
 */
export interface StoryPage {
    /** Sayfa numarası (1'den başlar) */
    pageNumber: number;

    /** Sayfa metin içeriği (İngilizce / varsayılan) */
    content: string;

    /** Sayfa metin içeriği (Türkçe) */
    content_tr?: string;

    /** Sayfa görseli URL (Firebase Storage, dil-bağımsız) */
    imageUrl: string;

    /** Sayfa sesi URL (İngilizce / varsayılan) */
    audioUrl?: string;

    /** Sayfa sesi URL (Türkçe) */
    audio_tr?: string;
}

/**
 * Featured Story
 * 
 * Kotlin karşılığı: Hikaye.kt
 * Tüm veriler Firebase'den gelir
 */
export interface FeaturedStory {
    /** Hikaye ID (Firestore document ID) */
    id: string;

    /** Hikaye başlığı (İngilizce / varsayılan) */
    title: string;

    /** Hikaye başlığı (Türkçe) */
    title_tr?: string;

    /** Kapak görseli URL (Firebase Storage) - HomeScreen'de gösterilir */
    coverImageUrl: string;

    /** Hikaye sayfaları (her sayfanın yazısı, görseli ve sesi) */
    pages: StoryPage[];

    /** Tüm hikaye sesi URL (Firebase Storage, opsiyonel) */
    audioUrl?: string;

    /** Hikaye teması */
    theme: string;

    /** Sıralama (küçükten büyüğe) */
    order: number;

    /** Aktif mi? */
    active: boolean;

    /** Oluşturulma zamanı */
    createdAt: Date;
}
