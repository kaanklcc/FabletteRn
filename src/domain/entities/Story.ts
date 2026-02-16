/**
 * Story Entity
 * 
 * Kotlin karşılığı: com.kaankilic.discoverybox.entitiy.Hikaye
 * 
 * Bu entity, bir hikayenin tüm bilgilerini tutar.
 * Firestore'daki "stories" collection'ındaki bir document'i temsil eder.
 */

export interface Story {
    /**
     * Hikaye ID (Firestore document ID)
     */
    id: string;

    /**
     * Hikaye başlığı
     */
    title: string;

    /**
     * Hikaye içeriği (tam metin)
     * Kotlin'de: @PropertyName("hikaye") val content: String
     */
    content: string;

    /**
     * Tek görsel URL (eski hikayeler için)
     * Yeni hikayelerde boş olabilir
     */
    imageUrl?: string;

    /**
     * Her sayfa için ayrı görsel URL'leri
     * Yeni hikayeler bu array'i kullanır
     */
    imageUrls?: string[];

    /**
     * Hikaye oluşturulma zamanı
     * Kotlin'de: Timestamp? (Firebase Timestamp)
     * TypeScript'te: Date
     */
    timestamp: Date;

    /**
     * Hikayeyi oluşturan kullanıcının ID'si
     */
    userId?: string;

    /**
     * Hikaye teması
     * Örnek: 'Macera', 'Bilim Kurgu', 'Fantastik'
     */
    theme?: string;

    /**
     * Hikaye uzunluğu
     * Örnek: 'Kısa', 'Orta', 'Uzun'
     */
    length?: string;

    /**
     * Hikaye sayfaları
     */
    pages?: import('./StoryPage').StoryPage[];
}

/**
 * Story oluşturma için DTO (Data Transfer Object)
 * API'ye gönderirken kullanılır
 */
export interface CreateStoryDTO {
    title: string;
    content: string;
    imageUrls: string[];
    userId: string;
}
