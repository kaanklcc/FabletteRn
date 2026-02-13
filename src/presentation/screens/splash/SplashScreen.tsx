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
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';

type SplashScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Splash'
>;

interface Props {
    navigation: SplashScreenNavigationProp;
}

export default function SplashScreen({ navigation }: Props) {
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        // Firebase auth durumunu dinle
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setTimeout(() => {
                if (firebaseUser) {
                    // Kullanıcı giriş yapmış - auth store'u güncelle
                    const displayName = firebaseUser.displayName || '';
                    const [firstName = '', ...lastNameParts] = displayName.split(' ');
                    const lastName = lastNameParts.join(' ');

                    setUser({
                        uid: firebaseUser.uid,
                        firstName,
                        lastName,
                        email: firebaseUser.email || '',
                        emailVerified: firebaseUser.emailVerified,
                        photoURL: firebaseUser.photoURL || undefined,
                        usedFreeTrial: false,
                        isPremium: false,
                        remainingCredits: 0,
                        premiumStartDate: null,
                        premiumDurationDays: 0,
                    });
                    navigation.replace('Main');
                } else {
                    // Kullanıcı giriş yapmamış
                    navigation.replace('Auth');
                }
            }, 2000);
        });

        return () => unsubscribe();
    }, [navigation, setUser]);

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
