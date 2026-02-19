/**
 * ═══════════════════════════════════════════════════════════════
 * i18n CONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 *
 * react-i18next + AsyncStorage ile kalıcı dil desteği
 *
 * Varsayılan dil: Türkçe (tr)
 * Desteklenen diller: Türkçe (tr), İngilizce (en)
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import tr from './locales/tr';
import en from './locales/en';

const LANGUAGE_KEY = '@fablet_language';

// AsyncStorage'dan dil tercihini oku ve i18n'i initialize et
const initI18n = async () => {
    let savedLanguage = 'tr'; // default

    try {
        const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (stored === 'en' || stored === 'tr') {
            savedLanguage = stored;
        }
    } catch (e) {
        console.warn('Could not read language preference:', e);
    }

    await i18n.use(initReactI18next).init({
        resources: {
            tr: { translation: tr },
            en: { translation: en },
        },
        lng: savedLanguage,
        fallbackLng: 'tr',
        interpolation: {
            escapeValue: false, // React already escapes
        },
        react: {
            useSuspense: false, // AsyncStorage ile uyumlu
        },
    });
};

initI18n();

/**
 * Dil değiştir ve AsyncStorage'a kaydet
 */
export const changeLanguage = async (lang: 'tr' | 'en') => {
    await i18n.changeLanguage(lang);
    try {
        await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    } catch (e) {
        console.warn('Could not save language preference:', e);
    }
};

export default i18n;
