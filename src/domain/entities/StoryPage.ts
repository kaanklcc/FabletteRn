/**
 * StoryPage Entity
 * 
 * Kotlin karşılığı: com.kaankilic.discoverybox.entitiy.StoryPage
 * 
 * Bir hikayenin tek bir sayfasını temsil eder.
 * Hikaye oluşturma sırasında her sayfa için ayrı görsel ve ses oluşturulur.
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
     * Oluşturulan görsel URL'i veya base64 data URI
     * - URL: Firebase Storage'dan yüklenen görseller
     * - Data URI: Yeni oluşturulan görseller (data:image/png;base64,...)
     * Başlangıçta null, görsel oluşturulduktan sonra doldurulur
     */
    imageUrl: string | null;

    /**
     * Ses dosyası URI'si
     * - File URI: Yerel dosya (file://...)
     * - Remote URL: Firebase Storage'dan
     * Opsiyonel, ses oluşturulduktan sonra doldurulur
     */
    audioUrl?: string | null;

    /**
     * Görsel yüklenme durumu
     */
    isImageLoading?: boolean;

    /**
     * Ses yüklenme durumu
     */
    isAudioLoading?: boolean;
}
