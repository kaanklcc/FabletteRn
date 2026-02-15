/**
 * ═══════════════════════════════════════════════════════════════
 * SPLASH SCREEN (LoginSplashScreen)
 * ═══════════════════════════════════════════════════════════════
 * 
 * Uygulama başlangıç ekranı.
 * 
 * Kotlin karşılığı: SplashScreen.kt → LoginSplashScreen composable
 * 
 * Görevler:
 * 1. Gradient arka plan + Logo + "Fablette" başlığı göster
 * 2. 2 saniye bekle
 * 3. Firebase auth durumunu kontrol et
 *    - Auth varsa → Main (anasayfa)
 *    - Auth yoksa → Auth (Onboarding1 → Onboarding2 → Login)
 * 
 * Kotlin akışı:
 * LaunchedEffect(Unit) {
 *   delay(2000)
 *   if (currentUser != null) navigate("anasayfa")
 *   else navigate("splashScreen1")
 * }
 */

import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/zustand/useAuthStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { moderateScale, responsiveFontSize, verticalScale } from '@/utils/responsive';

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
        /**
         * Firebase auth durumunu dinle
         * 
         * Kotlin karşılığı:
         * LaunchedEffect(Unit) {
         *   delay(2000)
         *   val currentUser = auth.currentUser
         *   if (currentUser != null) {
         *     navController.navigate("anasayfa") { popUpTo("loginSplash") { inclusive = true } }
         *   } else {
         *     navController.navigate("splashScreen1") { popUpTo("loginSplash") { inclusive = true } }
         *   }
         * }
         */
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setTimeout(() => {
                if (firebaseUser) {
                    // Kullanıcı giriş yapmış - auth store'u güncelle ve Main'e git
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
                    // Kullanıcı giriş yapmamış → Auth (Onboarding akışına git)
                    navigation.replace('Auth');
                }
            }, 2000);
        });

        return () => unsubscribe();
    }, [navigation, setUser]);

    return (
        <LinearGradient
            colors={['#003366', '#004080', '#0055AA']}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" backgroundColor="#003366" />

            <View style={styles.content}>
                {/* 
                 * Logo
                 * Kotlin karşılığı: 
                 * Image(painterResource(R.drawable.applogo), modifier = Modifier.size(300.dp))
                 */}
                <Text style={styles.logo}>📚</Text>

                <View style={styles.spacer} />

                {/* 
                 * Uygulama Adı
                 * Kotlin karşılığı:
                 * Text("Fablette", color = Color.White, fontWeight = ExtraBold, 
                 *      fontSize = 44.sp, fontFamily = sandtitle)
                 */}
                <Text style={styles.title}>Fablette</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        fontSize: moderateScale(100),
    },
    spacer: {
        height: verticalScale(20),
    },
    title: {
        fontSize: responsiveFontSize(44),
        fontWeight: '800',
        color: '#FFFFFF',
    },
});
