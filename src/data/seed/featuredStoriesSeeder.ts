/**
 * ═══════════════════════════════════════════════════════════════
 * FIREBASE SEEDING SCRIPT - FEATURED STORIES
 * ═══════════════════════════════════════════════════════════════
 * 
 * Bu script ilk 6 featured hikayeyi Firebase'e ekler.
 * 
 * KULLANIM:
 * 1. Firebase Console'da "featuredStories" collection'ı oluştur
 * 2. Firebase Storage'da "featured_stories/" klasörü oluştur
 * 3. Görselleri Storage'a yükle:
 *    - featured_stories/sihirli_orman.jpg
 *    - featured_stories/uzay_yolculugu.jpg
 *    - ... (diğerleri)
 * 4. Ses dosyalarını app'e ekle:
 *    - assets/audio/featured/sihirli_orman.mp3
 *    - assets/audio/featured/uzay_yolculugu.mp3
 *    - ... (diğerleri)
 * 
 * NOT: Bu script'i bir kez çalıştırmanız yeterli.
 * Sonrasında Firebase Console'dan manuel düzenleme yapabilirsiniz.
 * 
 * ÖNEMLI: Görsellerin URL'lerini Firebase Storage'dan kopyalayıp
 * aşağıdaki STORAGE_BASE_URL değişkenini güncelleyin!
 */

import { FeaturedStoryDTO } from '@/domain/entities/FeaturedStory';

// Firebase Storage base URL (kendi URL'inizi buraya yazın)
// Örnek: https://firebasestorage.googleapis.com/v0/b/storyteller-23720.appspot.com/o/featured_stories%2F
const STORAGE_BASE_URL = 'YOUR_FIREBASE_STORAGE_URL/featured_stories/';

/**
 * İlk 6 featured hikaye
 * 
 * DiscoveryBox2'deki hikayeler:
 * 1. Sihirli Orman Macerası
 * 2. Uzay Yolculuğu
 * 3. Deniz Altı Krallığı
 * 4. Rüya Dünyası
 * 5. Ejderha Dostluğu
 * 6. Zaman Yolcusu
 */
export const INITIAL_FEATURED_STORIES: FeaturedStoryDTO[] = [
    {
        title: 'Sihirli Orman Macerası',
        content: `Bir zamanlar, büyülü bir ormanda yaşayan küçük bir kız vardı. Adı Elif'ti ve her gün ormanda yeni maceralar arardı.

Bir gün, ormanda parlayan bir ışık gördü. Işığın kaynağını takip ederken, konuşan hayvanlarla dolu büyülü bir yere ulaştı.

Tilki arkadaşı ona dedi ki: "Hoş geldin Elif! Seni bekliyorduk. Ormanımız tehlikede ve sadece sen bize yardım edebilirsin."

Elif cesurca ileri atıldı ve macerası başladı...`,
        coverImageUrl: `${STORAGE_BASE_URL}sihirli_orman.jpg`,
        audioFileName: 'sihirli_orman.mp3',
        theme: 'Macera',
        emoji: '🌳',
        order: 1,
        active: true,
    },
    {
        title: 'Uzay Yolculuğu',
        content: `Küçük astronot Can, uzay gemisine bindi ve yıldızlara doğru yola çıktı.

İlk durağı Mars'tı. Kırmızı gezegende garip kayalar ve derin vadiler keşfetti.

Sonra Jüpiter'in muhteşem renkli bulutlarını gördü. Satürn'ün halkaları arasında gezindi.

En sonunda, parlak yıldızların ötesinde yeni bir dünya buldu...`,
        coverImageUrl: `${STORAGE_BASE_URL}uzay_yolculugu.jpg`,
        audioFileName: 'uzay_yolculugu.mp3',
        theme: 'Uzay',
        emoji: '🚀',
        order: 2,
        active: true,
    },
    {
        title: 'Deniz Altı Krallığı',
        content: `Denizlerin derinliklerinde, rengarenk mercanlarla çevrili bir krallık vardı.

Prenses Deniz, deniz yıldızı arkadaşlarıyla birlikte okyanusun sırlarını keşfediyordu.

Bir gün, kayıp hazineyi bulmak için büyük bir maceraya çıktılar.

Yol boyunca yunuslar, deniz kaplumbağaları ve neşeli balıklarla tanıştılar...`,
        coverImageUrl: `${STORAGE_BASE_URL}deniz_alti_kralligi.jpg`,
        audioFileName: 'deniz_alti_kralligi.mp3',
        theme: 'Fantastik',
        emoji: '🐚',
        order: 3,
        active: true,
    },
    {
        title: 'Rüya Dünyası',
        content: `Her gece, küçük Ali'nin rüyaları onu bambaşka bir dünyaya götürürdü.

Bu gece, bulutların üzerinde yürüdü. Gökkuşağından kaydıraklar vardı.

Yıldızlar onunla konuştu ve aya giden bir merdiven gösterdiler.

Rüya dünyasında her şey mümkündü...`,
        coverImageUrl: `${STORAGE_BASE_URL}ruya_dunyasi.jpg`,
        audioFileName: 'ruya_dunyasi.mp3',
        theme: 'Fantastik',
        emoji: '💭',
        order: 4,
        active: true,
    },
    {
        title: 'Ejderha Dostluğu',
        content: `Yüksek dağların tepesinde, yalnız bir ejderha yaşıyordu.

Küçük çoban Ayşe, bir gün kayboldu ve dağda yolunu şaşırdı.

Ejderha onu buldu ama zarar vermedi. Aksine, ona yardım etmek istedi.

İkisi arasında beklenmedik bir dostluk başladı...`,
        coverImageUrl: `${STORAGE_BASE_URL}ejderha_dostlugu.jpg`,
        audioFileName: 'ejderha_dostlugu.mp3',
        theme: 'Fantastik',
        emoji: '🐉',
        order: 5,
        active: true,
    },
    {
        title: 'Zaman Yolcusu',
        content: `Büyükbabasının tavan arasında eski bir saat bulan Ege, büyük bir sır keşfetti.

Saat, onu zamanda yolculuğa çıkarabiliyordu!

Önce dinozorların zamanına gitti. Sonra şövalyelerin yaşadığı ortaçağı ziyaret etti.

Her yolculukta yeni şeyler öğrendi ve macera dolu anlar yaşadı...`,
        coverImageUrl: `${STORAGE_BASE_URL}zaman_yolcusu.jpg`,
        audioFileName: 'zaman_yolcusu.mp3',
        theme: 'Macera',
        emoji: '⏰',
        order: 6,
        active: true,
    },
];

/**
 * Seeding fonksiyonu
 * 
 * NOT: Bu fonksiyonu bir ekranda (örn: ProfileScreen'de debug butonu)
 * veya development ortamında çağırabilirsiniz.
 */
export async function seedFeaturedStories() {
    const { FeaturedStoryRepositoryImpl } = await import('@/data/repositories/FeaturedStoryRepositoryImpl');
    const repository = new FeaturedStoryRepositoryImpl();

    if (__DEV__) console.log('🌱 Starting featured stories seeding...');

    for (const story of INITIAL_FEATURED_STORIES) {
        try {
            const storyId = await repository.addFeaturedStory(story);
            if (__DEV__) console.log(`✅ Added: ${story.title} (ID: ${storyId})`);
        } catch (error) {
            console.error(`❌ Failed to add ${story.title}:`, error);
        }
    }

    if (__DEV__) console.log('🎉 Seeding completed!');
}
