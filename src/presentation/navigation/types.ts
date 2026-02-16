/**
 * ═══════════════════════════════════════════════════════════════
 * NAVIGATION TYPE DEFINITIONS
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Hikaye oluşturma parametreleri
 * CreateStoryScreen → StoryViewer'a geçerken kullanılır
 */
export interface StoryGenerationParams {
    prompt: string;
    length: 'short' | 'medium' | 'long';
    mainCharacter: string;
    location: string;
    theme: string;
    topic: string;
}

/**
 * Root Stack - Ana Yönetici
 * Splash → Auth → Main
 */
export type RootStackParamList = {
    Splash: undefined;
    Auth: undefined;
    Main: undefined;
};

/**
 * Auth Stack - Giriş Ekranları
 * 
 * DiscoveryBox2 akışı:
 * SplashScreen1 → SplashScreen2 → GirisSayfa
 * 
 * React Native karşılığı:
 * Onboarding1 → Onboarding2 → Login
 */
export type AuthStackParamList = {
    Onboarding1: undefined;
    Onboarding2: undefined;
    Login: undefined;
};

/**
 * Main Tab - Alt Menü
 */
export type MainTabParamList = {
    HomeTab: undefined;
    CreateTab: undefined;
    SavedTab: undefined;
    ProfileTab: undefined;
};

/**
 * Home Tab Stack
 */
export type HomeStackParamList = {
    Home: undefined;
    StoryViewer: {
        storyId: string;
    };
};

/**
 * Create Tab Stack
 * 
 * StoryViewer iki modda çalışır:
 * 1. storyId ile: Var olan hikaye görüntüleme
 * 2. generationParams ile: Yeni hikaye oluşturma
 */
export type CreateStackParamList = {
    CreateStory: undefined;
    StoryViewer: {
        storyId?: string;
        generationParams?: StoryGenerationParams;
    };
};

/**
 * Saved Tab Stack
 */
export type SavedStackParamList = {
    SavedStories: undefined;
    StoryViewer: {
        storyId: string;
        source: 'saved';
    };
};

/**
 * Profile Tab Stack
 */
export type ProfileStackParamList = {
    Profile: undefined;
    Premium: {
        source?: string;
    };
};

/**
 * All Screens
 */
export type AllScreensParamList = RootStackParamList &
    AuthStackParamList &
    MainTabParamList &
    HomeStackParamList &
    CreateStackParamList &
    SavedStackParamList &
    ProfileStackParamList;
