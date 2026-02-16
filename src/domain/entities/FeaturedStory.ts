/**
 * ═══════════════════════════════════════════════════════════════
 * FEATURED STORY ENTITY
 * ═══════════════════════════════════════════════════════════════
 * 
 * Kotlin karşılığı: Hikaye.kt + StoryPage.kt
 * 
 * Firestore Structure:
 * /featuredStories/{storyId}
 *   - title: string
 *   - pages: array of StoryPage objects
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
 * - content: sayfa metni
 * - imageUrl: sayfa görseli (Firebase Storage)
 * - audioUrl: sayfa sesi (Firebase Storage, opsiyonel)
 */
export interface StoryPage {
    /** Sayfa numarası (1'den başlar) */
    pageNumber: number;

    /** Sayfa metin içeriği */
    content: string;

    /** Sayfa görseli URL (Firebase Storage) */
    imageUrl: string;

    /** Sayfa sesi URL (Firebase Storage, opsiyonel) */
    audioUrl?: string;
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

    /** Hikaye başlığı */
    title: string;

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
