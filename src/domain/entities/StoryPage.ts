/**
 * StoryPage Entity
 * 
 * Kotlin karşılığı: com.kaankilic.discoverybox.entitiy.StoryPage
 * 
 * Bir hikayenin tek bir sayfasını temsil eder.
 * Hikaye oluşturma sırasında her sayfa için ayrı görsel oluşturulur.
 */

export interface StoryPage {
    /**
     * Sayfa numarası (1'den başlar)
     */
    pageNumber: number;

    /**
     * Bu sayfadaki metin içeriği
     */
    content: string;

    /**
     * Görsel oluşturma için kullanılan prompt
     * Gemini API'ye gönderilir
     */
    imagePrompt: string;

    /**
     * Oluşturulan görsel URL'i
     * Başlangıçta null, görsel oluşturulduktan sonra doldurulur
     */
    imageUrl: string | null;

    /**
     * Görsel yüklenme durumu
     */
    isImageLoading?: boolean;
}
