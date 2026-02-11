/**
 * ═══════════════════════════════════════════════════════════════
 * SPLASH SCREEN
 * ═══════════════════════════════════════════════════════════════
 * 
 * Uygulama başlangıç ekranı.
 * 
 * Kotlin karşılığı: LoginSplashScreen.kt
 * 
 * Görevler:
 * 1. Logo göster
 * 2. Firebase auth durumunu kontrol et
 * 3. Auth varsa → Main, yoksa → Auth
 */

import React, { useEffect } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { useAuthStore } from '@/store/zustand/useAuthStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type SplashScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Splash'
>;

interface Props {
    navigation: SplashScreenNavigationProp;
}

export default function SplashScreen({ navigation }: Props) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        /**
         * 2 saniye bekle, sonra yönlendir
         * 
         * Kotlin karşılığı:
         * LaunchedEffect(Unit) {
         *   delay(2000)
         *   navController.navigate(...)
         * }
         */
        const timer = setTimeout(() => {
            if (isAuthenticated) {
                navigation.replace('Main');
            } else {
                navigation.replace('Auth');
            }
        }, 2000);

        // Cleanup
        return () => clearTimeout(timer);
    }, [isAuthenticated, navigation]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />

            {/* Logo */}
            <Text style={styles.logo}>📚</Text>
            <Text style={styles.title}>Fablet</Text>
            <Text style={styles.subtitle}>Hikayeler Dünyası</Text>

            {/* Loading */}
            <ActivityIndicator
                size="large"
                color="#FCD34D"
                style={styles.loader}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#003366',
    },
    logo: {
        fontSize: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FCD34D',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        opacity: 0.8,
    },
    loader: {
        marginTop: 40,
    },
});
