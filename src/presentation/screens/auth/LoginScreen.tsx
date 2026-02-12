/**
 * ═══════════════════════════════════════════════════════════════
 * LOGIN SCREEN - GOOGLE SIGN-IN ONLY
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 GirisSayfa.kt'nin birebir kopyası.
 * 
 * Özellikler:
 * - Sadece Google ile giriş
 * - Email/şifre input YOK
 * - Gradient background
 * - Dil seçici (TR/EN)
 */

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

type LoginScreenNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    'Login'
>;

interface Props {
    navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
    // ─────────────────────────────────────────────────────────
    // GOOGLE SIGN-IN HANDLER
    // ─────────────────────────────────────────────────────────
    const handleGoogleSignIn = async () => {
        try {
            // TODO: Google Sign-In implementasyonu
            // @react-native-google-signin/google-signin kullanılacak
            Alert.alert(
                'Google Sign-In',
                'Google Sign-In henüz implement edilmedi. Şimdilik Main ekranına yönlendiriliyorsunuz.',
                [
                    {
                        text: 'Tamam',
                        onPress: () => {
                            // Test için direkt Main'e git
                            navigation.getParent()?.navigate('Main' as never);
                        },
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Hata', 'Google ile giriş yapılamadı');
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

            <View style={styles.content}>
                {/* Dil Seçici (Sağ Üst) */}
                <View style={styles.languageContainer}>
                    <TouchableOpacity style={styles.languageButton}>
                        <Text style={styles.languageIcon}>🌍</Text>
                        <Text style={styles.languageText}>TR</Text>
                    </TouchableOpacity>
                </View>

                {/* Ana Kart */}
                <View style={styles.card}>
                    {/* Logo */}
                    <Text style={styles.logo}>📚</Text>

                    {/* Başlık */}
                    <Text style={styles.title}>Fabllette</Text>
                    <Text style={styles.subtitle}>Harika hikayeler yarat</Text>

                    {/* Hoş Geldin Mesajı */}
                    <View style={styles.welcomeBox}>
                        <Text style={styles.welcomeText}>
                            Sihirli hikaye dünyasına hoş geldin! 🌟
                        </Text>
                    </View>

                    {/* Google Sign-Up Button (Pembe) */}
                    <TouchableOpacity
                        style={[styles.googleButton, styles.googleButtonPink]}
                        onPress={handleGoogleSignIn}>
                        <Text style={styles.googleIcon}>G</Text>
                        <Text style={styles.googleButtonText}>Google ile Kayıt Ol</Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>veya</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Google Sign-In Button (Mavi) */}
                    <TouchableOpacity
                        style={[styles.googleButton, styles.googleButtonBlue]}
                        onPress={handleGoogleSignIn}>
                        <Text style={styles.googleIconSmall}>🔍</Text>
                        <Text style={styles.googleButtonText}>Google ile Giriş Yap</Text>
                    </TouchableOpacity>

                    {/* Alt Mesaj */}
                    <View style={styles.footer}>
                        <Text style={styles.footerEmoji}>🌟</Text>
                        <Text style={styles.footerText}>Hayal gücün uçsun</Text>
                        <Text style={styles.footerEmoji}>🌟</Text>
                    </View>
                </View>
            </View>

            {/* Sağ Alt İkon */}
            <View style={styles.bottomIcon}>
                <Text style={styles.themeIcon}>🎨</Text>
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
        fontSize: 80,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#FFFFFF',
        marginBottom: 20,
    },
    welcomeBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        width: '100%',
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 14,
        color: '#0055AA',
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: 20,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 50,
        borderRadius: 12,
        gap: 12,
    },
    googleButtonPink: {
        backgroundColor: '#FF5C8D',
        marginBottom: 12,
    },
    googleButtonBlue: {
        backgroundColor: '#0055AA',
    },
    googleIcon: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    googleIconSmall: {
        fontSize: 18,
    },
    googleButtonText: {
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
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
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
    bottomIcon: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    themeIcon: {
        fontSize: 56,
    },
});
