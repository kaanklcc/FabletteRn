/**
 * RootNavigator - Ana navigator (Uygulama giriş noktası)
 * 
 * Kotlin karşılığı: SayfaGecisleri.kt
 * 
 * 🎓 Root Navigator Mantığı:
 * 
 * Root Navigator, uygulamanın en üst seviye navigator'ıdır.
 * Auth durumuna göre hangi navigator'ın gösterileceğine karar verir:
 * 
 * - Splash → Uygulama başlangıcı
 * - Auth → Kullanıcı giriş yapmamış
 * - Main → Kullanıcı giriş yapmış
 * 
 * Kotlin'de:
 * NavHost(startDestination = "loginSplash") {
 *   composable("loginSplash") { LoginSplashScreen(...) }
 *   composable("anasayfa") { Anasayfa(...) }
 * }
 * 
 * React Native'de:
 * - Daha modüler yapı
 * - Her akış (Auth, Main) kendi navigator'ında
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Navigators
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

// Screens
import SplashScreen from '../screens/splash/SplashScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    return (
        /**
         * NavigationContainer
         * 
         * React Navigation'ın en dış wrapper'ı.
         * Tüm navigation state'ini yönetir.
         * 
         * Kotlin'de NavHost'a benzer ama daha kapsamlı:
         * - Deep linking
         * - State persistence
         * - Navigation theme
         */
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    /**
                     * Header'ı gizle
                     * Her navigator kendi header'ını gösterir
                     */
                    headerShown: false,
                }}
            >
                {/**
         * Splash Screen
         * 
         * İlk açılış ekranı.
         * 2 saniye sonra Auth veya Main'e yönlendirir.
         */}
                <Stack.Screen name="Splash" component={SplashScreen} />

                {/**
         * Auth Navigator
         * 
         * Giriş yapmamış kullanıcılar için.
         * Onboarding → Login → Register akışı.
         * 
         * Kotlin karşılığı:
         * composable("girisSayfa") { GirisSayfa(...) }
         * composable("kayitSayfa") { KayitSayfa(...) }
         */}
                <Stack.Screen name="Auth" component={AuthNavigator} />

                {/**
         * Main Tab Navigator
         * 
         * Giriş yapmış kullanıcılar için.
         * Bottom tabs ile 4 ana ekran.
         * 
         * Kotlin karşılığı:
         * composable("anasayfa") { Anasayfa(...) }
         * + CommonBottomBar
         */}
                <Stack.Screen name="Main" component={MainTabNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

/**
 * 🎓 Navigation Hierarchy (Görsel Özet):
 * 
 * NavigationContainer
 *   └─ RootStack
 *       ├─ Splash
 *       ├─ Auth (Stack Navigator)
 *       │   ├─ Onboarding
 *       │   ├─ Login
 *       │   └─ Register
 *       └─ Main (Bottom Tab Navigator)
 *           ├─ HomeTab (Stack)
 *           │   └─ Home
 *           ├─ CreateTab (Stack)
 *           │   ├─ CreateStory
 *           │   └─ StoryViewer
 *           ├─ SavedTab (Stack)
 *           │   └─ SavedStories
 *           └─ ProfileTab (Stack)
 *               ├─ Profile
 *               └─ Premium
 * 
 * Bu yapı sayesinde:
 * - Her tab kendi navigation history'sine sahip
 * - Auth ve Main akışları birbirinden bağımsız
 * - Deep linking kolayca yapılabilir
 * - State yönetimi temiz ve modüler
 */
