/**
 * ═══════════════════════════════════════════════════════════════
 * LANGUAGE STORE (Zustand)
 * ═══════════════════════════════════════════════════════════════
 *
 * Dil tercihini yöneten Zustand store.
 * i18n.changeLanguage + AsyncStorage ile senkronize çalışır.
 *
 * Başlangıçta i18n'in aktif dilini okur (i18n zaten AsyncStorage'dan yüklemiştir).
 */

import { create } from 'zustand';
import { changeLanguage } from '@/config/i18n';
import i18n from '@/config/i18n';

export type Language = 'tr' | 'en';

interface LanguageState {
    /** Aktif dil */
    language: Language;

    /** Dil değiştir (i18n + AsyncStorage + Zustand) */
    setLanguage: (lang: Language) => void;

    /** Dili toggle et (tr ↔ en) */
    toggleLanguage: () => void;

    /** i18n'den aktif dili senkronize et (app başlangıcında çağrılır) */
    syncFromI18n: () => void;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
    // i18n.language zaten AsyncStorage'dan yüklenmiş olur (i18n.ts initI18n çalışır)
    // Ama init anında i18n henüz async tamamlamadıysa 'tr' fallback olarak kullanılır.
    // syncFromI18n() çağrısı ile doğru değer yüklenir.
    language: (i18n.language as Language) || 'tr',

    setLanguage: (lang) => {
        changeLanguage(lang);
        set({ language: lang });
    },

    toggleLanguage: () => {
        const current = get().language;
        const next: Language = current === 'tr' ? 'en' : 'tr';
        changeLanguage(next);
        set({ language: next });
    },

    syncFromI18n: () => {
        const lang = i18n.language as Language;
        if (lang === 'tr' || lang === 'en') {
            set({ language: lang });
        }
    },
}));
