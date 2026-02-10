/**
 * ═══════════════════════════════════════════════════════════════
 * AUTH STORE (Zustand)
 * ═══════════════════════════════════════════════════════════════
 * 
 * 🎯 NE İŞE YARAR?
 * 
 * Kullanıcının giriş durumunu yönetir:
 * - Kullanıcı giriş yapmış mı?
 * - Kullanıcı bilgileri neler?
 * - Logout işlemi
 * 
 * 🔄 NEDEN ZUSTAND?
 * 
 * Auth durumu basit ve senkron bir state:
 * - Sadece user objesi tutulur
 * - API çağrısı yok (Firebase Auth ayrı yönetilir)
 * - Hızlı ve basit olmalı
 * 
 * Redux kullanmaya gerek yok çünkü:
 * - Async işlem yok
 * - Kompleks state yok
 * - Boilerplate gereksiz
 * 
 * ═══════════════════════════════════════════════════════════════
 * KOTLIN KARŞILAŞTIRMASI
 * ═══════════════════════════════════════════════════════════════
 * 
 * Kotlin'de:
 * class AuthViewModel : ViewModel() {
 *   private val _user = MutableStateFlow<User?>(null)
 *   val user = _user.asStateFlow()
 *   
 *   fun setUser(user: User?) {
 *     _user.value = user
 *   }
 * }
 * 
 * React Native'de (Zustand):
 * const useAuthStore = create((set) => ({
 *   user: null,
 *   setUser: (user) => set({ user }),
 * }));
 * 
 * Çok daha basit! 🚀
 */

import { create } from 'zustand';
import { User } from '../../domain/entities/User';

/**
 * Auth State Interface
 * 
 * State'in yapısını tanımlar.
 * TypeScript sayesinde tip güvenli!
 */
interface AuthState {
    /**
     * Mevcut kullanıcı
     * null = giriş yapılmamış
     */
    user: User | null;

    /**
     * Giriş yapılmış mı?
     * Computed property (user'dan otomatik hesaplanır)
     */
    isAuthenticated: boolean;

    /**
     * Kullanıcıyı set et
     * 
     * @param user - User objesi veya null (logout için)
     * 
     * Kullanım:
     * const { setUser } = useAuthStore();
     * setUser(user);  // Giriş yap
     * setUser(null);  // Çıkış yap
     */
    setUser: (user: User | null) => void;

    /**
     * Çıkış yap
     * 
     * setUser(null) ile aynı ama daha okunabilir.
     * 
     * Kullanım:
     * const { logout } = useAuthStore();
     * logout();
     */
    logout: () => void;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * AUTH STORE OLUŞTUR
 * ═══════════════════════════════════════════════════════════════
 * 
 * create<AuthState>() = Zustand store oluştur
 * 
 * (set) => ({ ... }) = State ve action'ları tanımla
 * 
 * set() fonksiyonu state'i günceller:
 * set({ user: newUser })  ← user'ı güncelle
 * set({ user: null, isAuthenticated: false })  ← Birden fazla güncelle
 */
export const useAuthStore = create<AuthState>((set) => ({
    // ─────────────────────────────────────────────────────────
    // INITIAL STATE (Başlangıç Değerleri)
    // ─────────────────────────────────────────────────────────
    user: null,
    isAuthenticated: false,

    // ─────────────────────────────────────────────────────────
    // ACTIONS (State Değiştirme Fonksiyonları)
    // ─────────────────────────────────────────────────────────

    /**
     * Kullanıcıyı set et
     * 
     * Kotlin'de:
     * _user.value = user
     * 
     * Zustand'da:
     * set({ user, isAuthenticated: user !== null })
     */
    setUser: (user) =>
        set({
            user,
            isAuthenticated: user !== null,
        }),

    /**
     * Çıkış yap
     * 
     * Kotlin'de:
     * _user.value = null
     * 
     * Zustand'da:
     * set({ user: null, isAuthenticated: false })
     */
    logout: () =>
        set({
            user: null,
            isAuthenticated: false,
        }),
}));

/**
 * ═══════════════════════════════════════════════════════════════
 * KULLANIM ÖRNEKLERİ
 * ═══════════════════════════════════════════════════════════════
 * 
 * 1. Component'te Kullanım:
 * 
 * import { useAuthStore } from '@/store/zustand/useAuthStore';
 * 
 * function LoginScreen() {
 *   const { setUser } = useAuthStore();
 *   
 *   const handleLogin = async () => {
 *     const user = await loginWithFirebase(email, password);
 *     setUser(user);  // State güncelle
 *     navigation.navigate('Main');
 *   };
 * }
 * 
 * 2. State Okuma:
 * 
 * function HomeScreen() {
 *   // Tüm state'i al
 *   const { user, isAuthenticated } = useAuthStore();
 *   
 *   // Veya sadece bir değer al (performans için daha iyi)
 *   const user = useAuthStore((state) => state.user);
 *   
 *   return <Text>Merhaba {user?.displayName}</Text>;
 * }
 * 
 * 3. Logout:
 * 
 * function ProfileScreen() {
 *   const { logout } = useAuthStore();
 *   
 *   const handleLogout = async () => {
 *     await logoutFromFirebase();
 *     logout();  // State temizle
 *     navigation.navigate('Auth');
 *   };
 * }
 * 
 * 4. Conditional Rendering:
 * 
 * function SplashScreen() {
 *   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
 *   
 *   useEffect(() => {
 *     if (isAuthenticated) {
 *       navigation.navigate('Main');
 *     } else {
 *       navigation.navigate('Auth');
 *     }
 *   }, [isAuthenticated]);
 * }
 */
