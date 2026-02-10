/**
 * ═══════════════════════════════════════════════════════════════
 * NAVIGATION TYPE DEFINITIONS (TİP TANIMLARI)
 * ═══════════════════════════════════════════════════════════════
 * 
 * 🎯 BU DOSYA NE İŞE YARAR?
 * 
 * Bu dosya sadece TİP TANIMLARI içerir (gerçek kod değil!).
 * TypeScript'e "hangi ekranlar var, hangi parametreler alır" söyler.
 * 
 * Kotlin'de böyle bir şey yok çünkü Kotlin tip güvenli navigation yok.
 * Kotlin'de: navController.navigate("metin/${hikayeId}")  ← String, hata riski
 * React Native'de: navigation.navigate('StoryViewer', { storyId: '123' })  ← Tip güvenli!
 * 
 * ═══════════════════════════════════════════════════════════════
 * NASIL KULLANILIR?
 * ═══════════════════════════════════════════════════════════════
 * 
 * 1. Burada tip tanımla:
 *    export type AuthStackParamList = { Login: undefined }
 * 
 * 2. Navigator'da kullan:
 *    <Stack.Screen name="Login" component={LoginScreen} />
 *                       ↑
 *                  Bu isim types.ts'teki "Login" ile eşleşmeli!
 * 
 * 3. Ekranda navigate et:
 *    navigation.navigate('Login')
 *                         ↑
 *                    Bu isim de types.ts'teki "Login" ile eşleşmeli!
 * 
 * TypeScript otomatik kontrol eder, yanlış isim yazarsan hata verir!
 */

/**
 * ═══════════════════════════════════════════════════════════════
 * ROOT STACK (Ana Yönetici)
 * ═══════════════════════════════════════════════════════════════
 * 
 * Uygulama akışını yönetir: Splash → Auth → Main
 * 
 * Kotlin karşılığı:
 * NavHost(startDestination = "loginSplash") {
 *   composable("loginSplash") { ... }
 *   composable("anasayfa") { ... }
 * }
 */
export type RootStackParamList = {
    Splash: undefined; // Splash ekranı (parametre almaz)
    Auth: undefined; // Auth Navigator'a geçiş (parametre almaz)
    Main: undefined; // Main Tab Navigator'a geçiş (parametre almaz)
};

/**
 * ═══════════════════════════════════════════════════════════════
 * AUTH STACK (Giriş Ekranları)
 * ═══════════════════════════════════════════════════════════════
 * 
 * Giriş yapmamış kullanıcılar için ekranlar.
 * 
 * Akış: Onboarding → Login → Register
 * 
 * Kotlin karşılığı:
 * composable("loginSplash") { LoginSplashScreen() }
 * composable("girisSayfa") { GirisSayfa() }
 * composable("kayitSayfa") { KayitSayfa() }
 */
export type AuthStackParamList = {
    Onboarding: undefined; // İlk açılış tanıtımı (SplashScreen1, SplashScreen2)
    Login: undefined; // Giriş ekranı (GirisSayfa.kt)
    Register: undefined; // Kayıt ekranı (KayitSayfa.kt)
};

/**
 * ═══════════════════════════════════════════════════════════════
 * MAIN TAB (Alt Menü)
 * ═══════════════════════════════════════════════════════════════
 * 
 * Giriş yapmış kullanıcılar için alt menü.
 * 4 tab: Home, Create, Saved, Profile
 * 
 * Kotlin karşılığı: CommonBottomBar.kt
 * 
 * ÖNEMLİ: Her tab aslında bir Stack Navigator!
 * Yani her tab'ın kendi ekran yığını var.
 */
export type MainTabParamList = {
    HomeTab: undefined; // Home Stack Navigator'a geçiş
    CreateTab: undefined; // Create Stack Navigator'a geçiş
    SavedTab: undefined; // Saved Stack Navigator'a geçiş
    ProfileTab: undefined; // Profile Stack Navigator'a geçiş
};

/**
 * ═══════════════════════════════════════════════════════════════
 * HOME TAB STACK
 * ═══════════════════════════════════════════════════════════════
 * 
 * Home tab'ı içindeki ekranlar.
 * Şu anda sadece 1 ekran var: Home
 */
export type HomeStackParamList = {
    Home: undefined; // Ana sayfa (Anasayfa.kt)
};

/**
 * ═══════════════════════════════════════════════════════════════
 * CREATE TAB STACK
 * ═══════════════════════════════════════════════════════════════
 * 
 * Create tab'ı içindeki ekranlar.
 * 2 ekran var: CreateStory ve StoryViewer
 * 
 * Akış: CreateStory → StoryViewer (geri tuşu ile dönülebilir)
 */
export type CreateStackParamList = {
    CreateStory: undefined; // Hikaye oluşturma ekranı (Hikaye.kt)

    /**
     * StoryViewer - Hikaye görüntüleme ekranı
     * 
     * ÖNEMLİ: Bu ekran PARAMETRE ALIR!
     * 
     * Kotlin'de:
     * composable("metin/{hikayeId}") { backStackEntry ->
     *   val hikayeId = backStackEntry.arguments?.getString("hikayeId")
     * }
     * 
     * React Native'de:
     * navigation.navigate('StoryViewer', { storyId: '123' })
     *                                      ↑
     *                                 Zorunlu parametre!
     * 
     * Eğer parametreyi vermezsen TypeScript hata verir:
     * navigation.navigate('StoryViewer')  ← ❌ HATA! storyId eksik
     */
    StoryViewer: {
        storyId: string; // Zorunlu: Gösterilecek hikayenin ID'si
    };
};

/**
 * ═══════════════════════════════════════════════════════════════
 * SAVED TAB STACK
 * ═══════════════════════════════════════════════════════════════
 * 
 * Saved tab'ı içindeki ekranlar.
 * Şu anda sadece 1 ekran var: SavedStories
 */
export type SavedStackParamList = {
    SavedStories: undefined; // Kaydedilen hikayeler (SaveSayfa.kt)
};

/**
 * ═══════════════════════════════════════════════════════════════
 * PROFILE TAB STACK
 * ═══════════════════════════════════════════════════════════════
 * 
 * Profile tab'ı içindeki ekranlar.
 * 2 ekran var: Profile ve Premium
 */
export type ProfileStackParamList = {
    Profile: undefined; // Profil ekranı (ProfilSayfa.kt)

    /**
     * Premium - Premium abonelik ekranı
     * 
     * OPSİYONEL PARAMETRE ÖRNEĞİ:
     * 
     * source?: string  ← ? işareti = opsiyonel
     * 
     * Kullanım:
     * navigation.navigate('Premium')  ← ✅ Parametre olmadan da olur
     * navigation.navigate('Premium', { source: 'profile' })  ← ✅ Parametre ile de olur
     * 
     * Kotlin karşılığı: composable("premium") { PremiumSayfa() }
     */
    Premium: {
        source?: string; // Opsiyonel: Nereden gelindi? ('profile' | 'home' | 'create')
    };
};

/**
 * ═══════════════════════════════════════════════════════════════
 * ALL SCREENS (Tüm Ekranlar)
 * ═══════════════════════════════════════════════════════════════
 * 
 * Tüm navigator'ların birleşimi.
 * Deep linking veya global navigation için kullanılır.
 * 
 * Normalde her ekran kendi navigator'ının tipini kullanır.
 * Ama bazen herhangi bir ekrandan herhangi bir ekrana gitmek gerekir.
 */
export type AllScreensParamList = RootStackParamList &
    AuthStackParamList &
    MainTabParamList &
    HomeStackParamList &
    CreateStackParamList &
    SavedStackParamList &
    ProfileStackParamList;

/**
 * ═══════════════════════════════════════════════════════════════
 * KULLANIM ÖRNEKLERİ
 * ═══════════════════════════════════════════════════════════════
 * 
 * Bir ekranda navigation kullanmak için:
 * 
 * import { NativeStackScreenProps } from '@react-navigation/native-stack';
 * import { CreateStackParamList } from './types';
 * 
 * // Props tipini tanımla
 * type Props = NativeStackScreenProps<CreateStackParamList, 'StoryViewer'>;
 * 
 * // Ekran component'i
 * function StoryViewerScreen({ navigation, route }: Props) {
 *   // route.params tip güvenli!
 *   const { storyId } = route.params;  // TypeScript biliyor: storyId string
 * 
 *   // navigation.navigate() tip güvenli!
 *   navigation.navigate('CreateStory');  // ✅ Doğru
 *   navigation.navigate('Home');  // ❌ HATA! Home bu stack'te yok
 * 
 *   // Geri dön
 *   navigation.goBack();
 * }
 */
