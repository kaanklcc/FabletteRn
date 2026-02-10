/**
 * ═══════════════════════════════════════════════════════════════
 * USER DATA STORE (Zustand)
 * ═══════════════════════════════════════════════════════════════
 * 
 * 🎯 NE İŞE YARAR?
 * 
 * Firestore'daki kullanıcı verilerini yönetir:
 * - Premium durumu
 * - Kalan kullanım hakkı
 * - Kullanıcı bilgileri (ad, soyad, email)
 * 
 * 🔄 NEDEN ZUSTAND?
 * 
 * UserData basit bir state:
 * - Firestore'dan bir kez okunur
 * - Nadiren güncellenir
 * - Senkron işlemler
 * 
 * Kotlin karşılığı:
 * AnasayfaViewModel.checkUserAccess() fonksiyonu
 * 
 * ═══════════════════════════════════════════════════════════════
 */

import { create } from 'zustand';
import { UserData } from '../../domain/entities/UserData';

/**
 * User Data State Interface
 */
interface UserDataState {
    /**
     * Firestore'daki kullanıcı verileri
     * null = henüz yüklenmedi
     */
    userData: UserData | null;

    /**
     * Premium üye mi?
     * Computed property (userData'dan hesaplanır)
     */
    isPremium: boolean;

    /**
     * Kalan kullanım hakkı
     * Computed property
     */
    remainingUses: number;

    /**
     * Kullanıcı verilerini set et
     * 
     * @param userData - Firestore'dan gelen UserData
     * 
     * Kullanım:
     * const { setUserData } = useUserStore();
     * const data = await getUserDataFromFirestore(userId);
     * setUserData(data);
     */
    setUserData: (userData: UserData | null) => void;

    /**
     * Kullanım hakkını azalt
     * 
     * Her hikaye oluşturulduğunda çağrılır.
     * 
     * Kullanım:
     * const { decrementUses } = useUserStore();
     * decrementUses();
     */
    decrementUses: () => void;

    /**
     * Premium durumunu güncelle
     * 
     * Premium satın alındığında çağrılır.
     * 
     * @param isPremium - Premium durumu
     * @param durationDays - Premium süre (gün)
     */
    updatePremiumStatus: (isPremium: boolean, durationDays?: number) => void;

    /**
     * Store'u temizle
     * 
     * Logout sırasında çağrılır.
     */
    clear: () => void;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * USER DATA STORE OLUŞTUR
 * ═══════════════════════════════════════════════════════════════
 */
export const useUserStore = create<UserDataState>((set, get) => ({
    // ─────────────────────────────────────────────────────────
    // INITIAL STATE
    // ─────────────────────────────────────────────────────────
    userData: null,
    isPremium: false,
    remainingUses: 0,

    // ─────────────────────────────────────────────────────────
    // ACTIONS
    // ─────────────────────────────────────────────────────────

    /**
     * Kullanıcı verilerini set et
     * 
     * Kotlin karşılığı:
     * AnasayfaViewModel.checkUserAccess() içinde
     * Firestore'dan veri okuma
     */
    setUserData: (userData) =>
        set({
            userData,
            isPremium: userData?.premium ?? false,
            remainingUses: userData?.remainingChatgptUses ?? 0,
        }),

    /**
     * Kullanım hakkını azalt
     * 
     * Kotlin karşılığı:
     * DiscoveryBoxDataSource.decrementChatGptUse(userId, onComplete)
     * 
     * ÖNEMLİ: Bu sadece local state'i günceller!
     * Firestore'u güncellemek için ayrı API çağrısı gerekir.
     */
    decrementUses: () => {
        const { userData } = get();
        if (!userData) return;

        const newRemainingUses = Math.max(0, userData.remainingChatgptUses - 1);

        set({
            userData: {
                ...userData,
                remainingChatgptUses: newRemainingUses,
            },
            remainingUses: newRemainingUses,
        });
    },

    /**
     * Premium durumunu güncelle
     * 
     * Kotlin karşılığı:
     * Premium satın alma sonrası Firestore güncelleme
     */
    updatePremiumStatus: (isPremium, durationDays = 30) => {
        const { userData } = get();
        if (!userData) return;

        set({
            userData: {
                ...userData,
                premium: isPremium,
                premiumDurationDays: durationDays,
                premiumStartDate: isPremium ? new Date() : null,
                remainingChatgptUses: isPremium ? 1000 : userData.remainingChatgptUses,
            },
            isPremium,
            remainingUses: isPremium ? 1000 : userData.remainingChatgptUses,
        });
    },

    /**
     * Store'u temizle
     * 
     * Logout sırasında çağrılır.
     */
    clear: () =>
        set({
            userData: null,
            isPremium: false,
            remainingUses: 0,
        }),
}));

/**
 * ═══════════════════════════════════════════════════════════════
 * KULLANIM ÖRNEKLERİ
 * ═══════════════════════════════════════════════════════════════
 * 
 * 1. Kullanıcı Verilerini Yükle:
 * 
 * import { useUserStore } from '@/store/zustand/useUserStore';
 * 
 * function HomeScreen() {
 *   const { setUserData } = useUserStore();
 *   const user = useAuthStore((state) => state.user);
 *   
 *   useEffect(() => {
 *     const loadUserData = async () => {
 *       const data = await getUserDataFromFirestore(user.uid);
 *       setUserData(data);
 *     };
 *     loadUserData();
 *   }, [user]);
 * }
 * 
 * 2. Premium Kontrolü:
 * 
 * function CreateStoryScreen() {
 *   const { isPremium, remainingUses } = useUserStore();
 *   
 *   const handleCreate = () => {
 *     if (!isPremium && remainingUses === 0) {
 *       navigation.navigate('Premium');
 *       return;
 *     }
 *     // Hikaye oluştur...
 *   };
 * }
 * 
 * 3. Kullanım Hakkını Azalt:
 * 
 * function CreateStoryScreen() {
 *   const { decrementUses } = useUserStore();
 *   
 *   const handleCreate = async () => {
 *     await createStoryAPI();
 *     decrementUses();  // Local state güncelle
 *     await decrementUsesInFirestore();  // Firestore güncelle
 *   };
 * }
 * 
 * 4. Logout:
 * 
 * function ProfileScreen() {
 *   const { logout } = useAuthStore();
 *   const { clear } = useUserStore();
 *   
 *   const handleLogout = async () => {
 *     await logoutFromFirebase();
 *     logout();  // Auth store temizle
 *     clear();   // User store temizle
 *   };
 * }
 */
