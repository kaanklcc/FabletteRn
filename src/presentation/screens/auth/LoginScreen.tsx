/**
 * ═══════════════════════════════════════════════════════════════
 * LOGIN SCREEN - EMAIL/PASSWORD + GOOGLE
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 GirisSayfa.kt'nin React Native versiyonu.
 * 
 * Özellikler:
 * - Email/şifre ile giriş (Expo Go'da çalışır)
 * - Google ile giriş (Production build'de çalışır)
 * - Gradient background
 * - Loading states
 * - Error handling
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuthStore } from '@/store/zustand/useAuthStore';
import { useUserStore } from '@/store/zustand/useUserStore';
import { UserRepositoryImpl } from '@/data/repositories/UserRepositoryImpl';
import { CheckPremiumExpirationUseCase } from '@/domain/usecases/user/CheckPremiumExpirationUseCase';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

type LoginScreenNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    'Login'
>;

interface Props {
    navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
    // ─────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const setUser = useAuthStore((state) => state.setUser);
    const setUserData = useUserStore((state) => state.setUserData);

    // ─────────────────────────────────────────────────────────
    // EMAIL/PASSWORD SIGN-IN
    // ─────────────────────────────────────────────────────────
    const handleEmailSignIn = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Hata', 'Email ve şifre giriniz');
            return;
        }

        try {
            setLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
            const user = userCredential.user;

            // Firestore'da kullanıcı belgesi kontrol et, yoksa oluştur
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            let firestoreData: any;

            if (!userDoc.exists()) {
                // Yeni kullanıcı - Firestore'a kaydet (DiscoveryBox2 yapısıyla aynı)
                const displayName = user.displayName || email.split('@')[0];
                firestoreData = {
                    ad: displayName,
                    soyad: '',
                    email: user.email || '',
                    premium: false,
                    premiumStartDate: null,
                    premiumDurationDays: 0,
                    remainingChatgptUses: 0,
                    usedFreeTrial: true,
                };
                await setDoc(userRef, firestoreData);
                console.log('✅ Yeni kullanıcı Firestore\'a kaydedildi');
            } else {
                firestoreData = userDoc.data();
            }

            // ─── Premium süre kontrolü ───
            // Kotlin AnasayfaViewModel.checkUserAccess() ile aynı mantık
            let isPremium = firestoreData.premium ?? false;
            let remainingCredits = firestoreData.remainingChatgptUses ?? 0;

            if (isPremium) {
                const userRepo = new UserRepositoryImpl();
                const checkExpiration = new CheckPremiumExpirationUseCase(userRepo);
                const result = await checkExpiration.invoke(
                    user.uid,
                    isPremium,
                    firestoreData.premiumStartDate?.toDate?.() || null,
                    firestoreData.premiumDurationDays ?? 0,
                );

                if (result.wasExpired) {
                    isPremium = false;
                    remainingCredits = 0;
                    console.log('⏰ Premium süresi dolmuş, üyelik kapatıldı');
                }
            }

            // Auth store'u güncelle (Firestore verilerini dahil et)
            const displayName = user.displayName || firestoreData.ad || '';
            const [firstName = '', ...lastNameParts] = displayName.split(' ');
            const lastName = lastNameParts.join(' ');

            setUser({
                uid: user.uid,
                firstName: firestoreData.ad || firstName,
                lastName: firestoreData.soyad || lastName,
                email: user.email || '',
                emailVerified: user.emailVerified,
                photoURL: user.photoURL || undefined,
                usedFreeTrial: firestoreData.usedFreeTrial ?? true,
                isPremium,
                remainingCredits,
                premiumStartDate: firestoreData.premiumStartDate?.toDate?.() || null,
                premiumDurationDays: firestoreData.premiumDurationDays ?? 0,
            });

            // User data store'u güncelle (premium kontrolleri için)
            setUserData({
                ad: firestoreData.ad || firstName,
                soyad: firestoreData.soyad || lastName,
                email: user.email || '',
                premium: isPremium,
                premiumStartDate: firestoreData.premiumStartDate?.toDate?.() || null,
                premiumDurationDays: firestoreData.premiumDurationDays ?? 0,
                remainingChatgptUses: remainingCredits,
                usedFreeTrial: firestoreData.usedFreeTrial ?? true,
            });

            // Main ekranına git
            navigation.getParent()?.reset({
                index: 0,
                routes: [{ name: 'Main' as never }],
            });
        } catch (error: any) {
            console.error('🔴 Login Error:', error.code, error.message);
            const errorMessage = getErrorMessage(error.code);
            Alert.alert(t('login.loginFailed'), `${errorMessage}\n\n(Hata kodu: ${error.code})`);
        } finally {
            setLoading(false);
        }
    };

    // ─────────────────────────────────────────────────────────
    // GOOGLE SIGN-IN (Production build'de çalışır)
    // ─────────────────────────────────────────────────────────
    const handleGoogleSignIn = () => {
        Alert.alert(
            t('login.googleSignInTitle'),
            t('login.googleSignInMessage'),
        );
    };

    // ─────────────────────────────────────────────────────────
    // ERROR MESSAGES
    // ─────────────────────────────────────────────────────────
    const getErrorMessage = (code: string): string => {
        switch (code) {
            case 'auth/invalid-email':
                return t('login.errors.invalidEmail');
            case 'auth/user-disabled':
                return t('login.errors.userDisabled');
            case 'auth/user-not-found':
                return t('login.errors.userNotFound');
            case 'auth/wrong-password':
                return t('login.errors.wrongPassword');
            case 'auth/invalid-credential':
                return t('login.errors.invalidCredential');
            case 'auth/too-many-requests':
                return t('login.errors.tooManyRequests');
            case 'auth/network-request-failed':
                return t('login.errors.networkError');
            default:
                return t('login.errors.default');
        }
    };

    // ─────────────────────────────────────────────────────────
    // UI
    // ─────────────────────────────────────────────────────────
    return (
        <LinearGradient
            colors={['#003366', '#004080', '#0055AA']}
            style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled">
                    <View style={styles.content}>
                        {/* Dil Seçici (Sağ Üst) */}
                        <View style={styles.languageContainer}>
                            <LanguageSwitcher variant="light" />
                        </View>

                        {/* Ana Kart */}
                        <View style={styles.card}>
                            {/* Logo */}
                            <Image
                                source={require('../../../../assets/applogo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />

                            {/* Başlık */}
                            <Text style={styles.title}>Fablette</Text>
                            <Text style={styles.subtitle}>{t('login.subtitle')}</Text>

                            {/* Email Input */}
                            <TextInput
                                style={styles.input}
                                placeholder={t('login.emailPlaceholder')}
                                placeholderTextColor="rgba(0, 85, 170, 0.5)"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!loading}
                            />

                            {/* Password Input */}
                            <TextInput
                                style={styles.input}
                                placeholder={t('login.passwordPlaceholder')}
                                placeholderTextColor="rgba(0, 85, 170, 0.5)"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                                editable={!loading}
                            />

                            {/* Email Sign-In Button */}
                            <TouchableOpacity
                                style={[styles.signInButton, styles.emailButton]}
                                onPress={handleEmailSignIn}
                                disabled={loading}>
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.signInButtonText}>{t('login.signIn')}</Text>
                                )}
                            </TouchableOpacity>

                            {/* Divider */}
                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>{t('common.or')}</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            {/* Google Sign-In Button */}
                            <TouchableOpacity
                                style={[styles.signInButton, styles.googleButton]}
                                onPress={handleGoogleSignIn}
                                disabled={loading}>
                                <Text style={styles.googleIcon}>G</Text>
                                <Text style={styles.signInButtonText}>{t('login.googleSignIn')}</Text>
                            </TouchableOpacity>


                            {/* Alt Mesaj */}
                            <View style={styles.footer}>
                                <Text style={styles.footerEmoji}>🌟</Text>
                                <Text style={styles.footerText}>{t('login.footer')}</Text>
                                <Text style={styles.footerEmoji}>🌟</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    languageContainer: {
        position: 'absolute',
        top: 40,
        right: 16,
        zIndex: 10,
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    languageIcon: {
        fontSize: 16,
    },
    languageText: {
        color: '#0055AA',
        fontWeight: 'bold',
        fontSize: 13,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 12,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 15,
        color: '#003366',
        marginBottom: 12,
    },
    signInButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 50,
        borderRadius: 12,
        gap: 12,
    },
    emailButton: {
        backgroundColor: '#FF5C8D',
        marginTop: 4,
    },
    googleButton: {
        backgroundColor: '#0055AA',
    },
    googleIcon: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    signInButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 12,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    dividerText: {
        color: '#FFFFFF',
        fontSize: 13,
        paddingHorizontal: 12,
    },
    registerLink: {
        marginTop: 16,
    },
    registerText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 13,
    },
    registerTextBold: {
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 6,
    },
    footerEmoji: {
        fontSize: 18,
    },
    footerText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '500',
    },
});
