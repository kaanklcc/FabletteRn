/**
 * ═══════════════════════════════════════════════════════════════
 * LANGUAGE STORE (Zustand)
 * ═══════════════════════════════════════════════════════════════
 *
 * Dil tercihini yöneten Zustand store.
 * i18n.changeLanguage + AsyncStorage ile senkronize çalışır.
 */

import { create } from 'zustand';
import { changeLanguage } from '@/config/i18n';

export type Language = 'tr' | 'en';

interface LanguageState {
    /** Aktif dil */
    language: Language;

    /** Dil değiştir (i18n + AsyncStorage + Zustand) */
    setLanguage: (lang: Language) => void;

    /** Dili toggle et (tr ↔ en) */
    toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
    language: 'tr',

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
}));
