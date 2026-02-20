/**
 * Constants - Uygulama Sabitleri
 * 
 * API URL'leri, key'ler ve diğer sabit değerler burada tanımlanır.
 * 
 * 🔒 GÜVENLİK NOTU:
 * API key'leri ASLA burada saklanmaz!
 * Firebase Cloud Functions kullanılır (DiscoveryBox2'deki gibi).
 */

/**
 * Firebase Cloud Functions URL'leri
 * Production'da gerçek URL ile değiştirilecek
 */
export const CLOUD_FUNCTIONS_URL = {
    generateStory: 'https://your-project.cloudfunctions.net/generateStory',
    generateImage: 'https://your-project.cloudfunctions.net/generateImage',
    generateTTS: 'https://your-project.cloudfunctions.net/generateTTS',
};

/**
 * Hikaye Uzunluk Seçenekleri
 * 
 * Kotlin karşılığı:
 * Hikaye.kt içinde "short", "medium", "long" string'leri
 */
export const STORY_LENGTH = {
    SHORT: 'short',
    MEDIUM: 'medium',
    LONG: 'long',
} as const;

export type StoryLength = typeof STORY_LENGTH[keyof typeof STORY_LENGTH];

/**
 * Hikaye Temaları
 * 
 * Kotlin karşılığı:
 * Hikaye.kt içinde ThemeButton'larda kullanılan tema isimleri
 */
export const STORY_THEMES = {
    ADVENTURE: 'adventure',
    ANIMALS: 'animals',
    SPACE: 'space',
    FANTASY: 'fantasy',
    OCEAN: 'ocean',
    FOREST: 'forest',
} as const;

export type StoryTheme = typeof STORY_THEMES[keyof typeof STORY_THEMES];

/**
 * Premium Paket Süreleri (gün cinsinden)
 */
export const PREMIUM_DURATION = {
    MONTHLY: 30,
    YEARLY: 365,
} as const;

/**
 * Ücretsiz Kullanım Limitleri
 * 
 * Kotlin karşılığı:
 * AnasayfaViewModel.checkUserAccess() içindeki kontroller
 */
export const FREE_LIMITS = {
    TRIAL_USES: 1,              // İlk deneme hakkı
    MAX_ADS_PER_DAY: 2,         // Günlük maksimum reklam
    CHATGPT_USES_FREE: 1,       // Ücretsiz ChatGPT kullanımı
    CHATGPT_USES_PREMIUM: 1000, // Premium ChatGPT kullanımı
} as const;

/**
 * TTS (Text-to-Speech) Ayarları
 * 
 * Kotlin karşılığı:
 * TTSRequest.kt içindeki default değerler
 */
export const TTS_CONFIG = {
    MODEL: 'gpt-4o-mini-tts',
    VOICE: 'coral',
    FORMAT: 'mp3',
    INSTRUCTIONS: `Voice Affect: Gentle, nurturing, and caring; like a loving storyteller reading to a child before bedtime.

Tone: Warm, calm, and comforting; evoke a sense of safety and imagination.

Pacing: Slow and steady; allow time between sentences for the child to absorb the story and visualize the scenes.

Emotion: Softly expressive; reflect wonder, curiosity, and kindness in every phrase.

Pronunciation: Clear and smooth articulation, with a light melodic rhythm to engage young listeners.`,
} as const;

/**
 * Hikaye Oluşturma Sabitleri
 * 
 * DiscoveryBox2 HikayeViewModel.kt'deki sabitler
 */
export const STORY_GENERATION = {
    /** Sayfa ayırıcı (Gemini'nin hikayeyi bölmesi için) */
    PAGE_DELIMITER: '---SAYFA---',

    /** Uzunluk → Sayfa sayısı eşlemesi */
    PAGE_COUNT: {
        short: 2,
        medium: 3,
        long: 4,
    } as Record<string, number>,

    /** Türkçe hikaye kuralları (prompt'a eklenir) */
    RULES_TR: (pageCount: number) => `

KRİTİK KURALLAR:
1. Hikayeyi Türkçe yaz.
2. Hikayeyi TAM OLARAK ${pageCount} bölüme ayır, daha fazla veya daha az olmasın.
3. Her bölümü '---SAYFA---' ile ayır.
4. Her bölüm 2-3 paragraf olsun.
5. Bilinen masal karakterlerinin (Shrek, Sindirella vb.) gerçek görünümlerini koru.
6. Karakterlerin fiziksel görünümünü tüm sayfalarda tutarlı tut.`,

    /** Görsel prompt şablonu */
    IMAGE_PROMPT: (mainCharacter: string, location: string, pageContent: string) =>
        `Professional children's book illustration, vibrant fantasy art. Main character ${mainCharacter} (same appearance throughout) in ${location}. Scene: ${pageContent.substring(0, 100)}. IMPORTANT: NO book pages, NO text overlays, NO page borders, pure scene illustration only. Consistent character design.`,
} as const;

/**
 * Navigation Route İsimleri
 * 
 * Tip güvenli navigation için kullanılır.
 * Kotlin karşılığı: SayfaGecisleri.kt içindeki route string'leri
 */
export const ROUTES = {
    // Auth Stack
    SPLASH: 'Splash',
    ONBOARDING_1: 'Onboarding1',
    ONBOARDING_2: 'Onboarding2',
    LOGIN: 'Login',
    REGISTER: 'Register',

    // Main Tab
    HOME: 'Home',
    CREATE_STORY: 'CreateStory',
    SAVED_STORIES: 'SavedStories',
    PROFILE: 'Profile',

    // Other
    STORY_VIEWER: 'StoryViewer',
    PREMIUM: 'Premium',
} as const;
