/**
 * AuthNavigator - Giriş yapmamış kullanıcılar için navigator
 * 
 * Kotlin karşılığı: SayfaGecisleri.kt içindeki auth route'ları
 * (loginSplash, girisSayfa, kayitSayfa)
 * 
 * 🎓 Stack Navigator Açıklaması:
 * 
 * Stack Navigator = Ekranları üst üste yığar (stack)
 * - navigate() → Yeni ekran ekler
 * - goBack() → Bir önceki ekrana döner
 * - replace() → Mevcut ekranı değiştirir (geri dönülemez)
 * 
 * Kotlin'de NavHost + composable() ile aynı mantık.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { colors } from '@/config/theme';

// Screens
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

/**
 * createNativeStackNavigator<ParamList>()
 * 
 * Generic tip <AuthStackParamList> sayesinde:
 * - Screen name'ler otomatik tamamlanır
 * - Parametre tipleri kontrol edilir
 * - TypeScript hataları derleme zamanında yakalanır
 */
const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
    return (
        <Stack.Navigator
            /**
             * initialRouteName: İlk açılacak ekran
             * Kotlin'de: startDestination = "loginSplash"
             */
            initialRouteName="Onboarding"

            /**
             * screenOptions: Tüm ekranlar için ortak ayarlar
             * 
             * headerStyle: Header (üst bar) stili
             * headerTintColor: Header'daki yazı ve ikon rengi
             * headerTitleStyle: Header başlık stili
             */
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                // Animasyon tipi (iOS ve Android'de farklı)
                animation: 'slide_from_right',
            }}
        >
            {/**
       * Stack.Screen = Bir ekran tanımlar
       * 
       * name: Route ismi (tip güvenli, AuthStackParamList'ten gelir)
       * component: Render edilecek component
       * options: Bu ekrana özel ayarlar
       * 
       * Kotlin karşılığı:
       * composable("onboarding") { OnboardingScreen(...) }
       */}
            <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{
                    headerShown: false,  // Header'ı gizle (splash ekranlarında yaygın)
                }}
            />

            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    title: 'Giriş Yap',  // Header başlığı
                }}
            />

            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{
                    title: 'Kayıt Ol',
                }}
            />
        </Stack.Navigator>
    );
}
