/**
 * ═══════════════════════════════════════════════════════════════
 * SPLASH SCREEN - Anonymous Auth
 * ═══════════════════════════════════════════════════════════════
 *
 * Uygulama başlangıç ekranı.
 *
 * Akış:
 * 1. Gradient arka plan + Logo + "Fablette" başlığı göster
 * 2. Firebase auth durumunu kontrol et
 *    - Mevcut kullanıcı varsa → verilerini yükle → Main
 *    - Kullanıcı yoksa → signInAnonymously → Firestore belgesi oluştur → Main
 * 3. Kullanıcı hiçbir zaman login ekranı görmez
 *
 * Her kullanıcı Firebase UID ile takip edilir:
 * - Hikaye kaydetme, premium, kullanım hakları hep bu UID'ye bağlı
 * - Anonymous kullanıcı cihaza özgü, oturum korunur
 */

import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/zustand/useAuthStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { moderateScale, responsiveFontSize, verticalScale } from '@/utils/responsive';
import { useUserStore } from '@/store/zustand/useUserStore';
import { UserRepositoryImpl } from '@/data/repositories/UserRepositoryImpl';
import { CheckPremiumExpirationUseCase } from '@/domain/usecases/user/CheckPremiumExpirationUseCase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'hasSeenOnboarding';

function parseFirestoreDate(val: any): Date | null {
    if (!val) return null;
    if (typeof val.toDate === 'function') return val.toDate();
    if (val instanceof Date) return val;
    if (typeof val === 'number') return new Date(val);
    if (typeof val?.seconds === 'number') return new Date(val.seconds * 1000);
    return null;
}

type SplashScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Splash'
>;

interface Props {
    navigation: SplashScreenNavigationProp;
}

const DEFAULT_USER_DATA = {
    ad: '',
    soyad: '',
    email: '',
    premium: false,
    premiumStartDate: null,
    premiumDurationDays: 0,
    remainingChatgptUses: 0,
    usedFreeTrial: false,
};

export default function SplashScreen({ navigation }: Props) {
    const setUser = useAuthStore((state) => state.setUser);
    const setUserData = useUserStore((state) => state.setUserData);

    const loadUserAndNavigate = async (firebaseUser: import('firebase/auth').User) => {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userRef);

        let firestoreData: any;
        let isNewUser = false;

        if (!userDoc.exists()) {
            isNewUser = true;
            firestoreData = { ...DEFAULT_USER_DATA };
            await setDoc(userRef, firestoreData);
            console.log('✅ Yeni anonymous kullanıcı Firestore\'a kaydedildi:', firebaseUser.uid);
        } else {
            firestoreData = userDoc.data();
        }

        const displayName = firebaseUser.displayName || firestoreData.ad || '';
        const [firstName = '', ...lastNameParts] = displayName.split(' ');
        const lastName = lastNameParts.join(' ');

        let isPremium = firestoreData.premium ?? false;
        let remainingCredits = firestoreData.remainingChatgptUses ?? 0;
        const premiumStart = parseFirestoreDate(firestoreData.premiumStartDate);

        if (isPremium) {
            const userRepo = new UserRepositoryImpl();
            const checkExpiration = new CheckPremiumExpirationUseCase(userRepo);
            const result = await checkExpiration.invoke(
                firebaseUser.uid,
                isPremium,
                premiumStart,
                firestoreData.premiumDurationDays ?? 0,
            );

            if (result.wasExpired) {
                isPremium = false;
                remainingCredits = 0;
            }
        }

        setUser({
            uid: firebaseUser.uid,
            firstName: firestoreData.ad || firstName,
            lastName: firestoreData.soyad || lastName,
            email: firebaseUser.email || '',
            emailVerified: firebaseUser.emailVerified,
            photoURL: firebaseUser.photoURL || undefined,
            usedFreeTrial: firestoreData.usedFreeTrial ?? false,
            isPremium,
            remainingCredits,
            premiumStartDate: premiumStart,
            premiumDurationDays: firestoreData.premiumDurationDays ?? 0,
        });

        setUserData({
            ad: firestoreData.ad || firstName,
            soyad: firestoreData.soyad || lastName,
            email: firebaseUser.email || '',
            premium: isPremium,
            premiumStartDate: premiumStart,
            premiumDurationDays: firestoreData.premiumDurationDays ?? 0,
            remainingChatgptUses: remainingCredits,
            usedFreeTrial: firestoreData.usedFreeTrial ?? false,
        });

        const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (!hasSeenOnboarding && isNewUser) {
            navigation.replace('Auth');
        } else {
            navigation.replace('Main');
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setTimeout(async () => {
                try {
                    if (firebaseUser) {
                        await loadUserAndNavigate(firebaseUser);
                    } else {
                        const result = await signInAnonymously(auth);
                        await loadUserAndNavigate(result.user);
                    }
                } catch (error) {
                    console.error('🔴 Splash auth error:', error);
                    // Hata durumunda bile anonymous sign-in dene
                    try {
                        const result = await signInAnonymously(auth);
                        await loadUserAndNavigate(result.user);
                    } catch (retryError) {
                        console.error('🔴 Retry failed:', retryError);
                    }
                }
            }, 2000);
        });

        return () => unsubscribe();
    }, [navigation, setUser, setUserData]);

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
                <Image
                    source={require('../../../../assets/applogo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

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
        width: moderateScale(200),
        height: moderateScale(200),
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
