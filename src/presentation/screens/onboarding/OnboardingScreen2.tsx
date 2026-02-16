/**
 * ═══════════════════════════════════════════════════════════════
 * ONBOARDING SCREEN 2 - Safe & Trusted / For Parents
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 SplashScreen2'nin React Native versiyonu.
 * 
 * Kotlin karşılığı: SplashScreen.kt → SplashScreen2 composable
 * 
 * Ekran İçeriği:
 * - Üstte kalem ikonu ile dairesel ikon kutusu (turuncu gradient)
 * - "Safe & Trusted" başlığı
 * - "For Parents" alt başlık (altın rengi)
 * - Ebeveyn/çocuk görseli (rounded corners + navy border)
 * - Güvenlik bilgi kutusu
 * - "Next" butonu → LoginScreen'e yönlendirir
 */

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing, isSmallDevice } from '@/utils/responsive';

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────

type OnboardingScreen2NavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    'Onboarding2'
>;

interface Props {
    navigation: OnboardingScreen2NavigationProp;
}

// ─────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────

export default function OnboardingScreen2({ navigation }: Props) {
    /**
     * Navigation Handler
     * Kotlin karşılığı: navController.navigate("girisSayfa")
     */
    const handleNext = () => {
        navigation.navigate('Login');
    };

    // Responsive icon circle size
    const iconCircleSize = isSmallDevice ? scale(80) : scale(90);

    return (
        <LinearGradient
            colors={['#003366', '#004080', '#0055AA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                <StatusBar barStyle="light-content" backgroundColor="#003366" />

                <View style={styles.content}>
                    {/* ═══════════════════════════════════════════
                         TOP ICON - Kalem İkonu (Turuncu Daire)
                         Kotlin: Box(90dp) + gradient #FFAA3D → #FFBF67
                                 + R.drawable.pencil (45dp, white)
                       ═══════════════════════════════════════════ */}
                    <View style={styles.iconContainer}>
                        <LinearGradient
                            colors={['#FFAA3D', '#FFBF67']}
                            style={[
                                styles.iconCircle,
                                {
                                    width: iconCircleSize,
                                    height: iconCircleSize,
                                    borderRadius: iconCircleSize / 2,
                                },
                            ]}
                        >
                            <Ionicons
                                name="pencil"
                                size={scale(32)}
                                color={colors.white}
                            />
                        </LinearGradient>
                    </View>

                    {/* ═══════════════════════════════════════════
                         TITLE SECTION
                         Kotlin: "Safe & Trusted" (16sp, white)
                                 "For Parents" (20sp, #FFD700, bold)
                       ═══════════════════════════════════════════ */}
                    <View style={styles.titleSection}>
                        <View style={styles.titleRow}>
                            <Text style={styles.sparkle}>✨</Text>
                            <Text style={styles.safeText}>
                                Safe & Trusted
                            </Text>
                            <Text style={styles.sparkle}>✨</Text>
                        </View>
                        <Text style={styles.forParentsText}>For Parents</Text>
                    </View>

                    {/* ═══════════════════════════════════════════
                         IMAGE SECTION - Ebeveyn/Çocuk Görseli
                         Kotlin: R.drawable.s2 + rounded corners + border
                         Arka plan: White
                       ═══════════════════════════════════════════ */}
                    <View style={styles.imageSection}>
                        <View style={styles.imageWrapper}>
                            <Image
                                source={require('../../../../assets/s2.png')}
                                style={styles.imageContainer}
                                resizeMode="cover"
                            />
                        </View>
                    </View>

                    {/* ═══════════════════════════════════════════
                         INFO BOX
                         Kotlin: Box(backgroundColor = #0055AA, border = 1dp white)
                         "Trusted AI for Your Children"
                         "Safe, age-appropriate stories..."
                       ═══════════════════════════════════════════ */}
                    <View style={styles.infoBox}>
                        <View style={styles.infoTitleRow}>
                            <Text style={styles.infoSparkle}>✨</Text>
                            <Text style={styles.infoTitle}>
                                Trusted AI for Your Children
                            </Text>
                        </View>
                        <Text style={styles.infoDescription}>
                            Safe, age-appropriate stories created with AI. Monitor your child's creativity and imagination in a secure environment.
                        </Text>
                    </View>

                    {/* ═══════════════════════════════════════════
                         NEXT BUTTON
                         Kotlin: 150dp x 50dp, gradient #FCD34D → #FBBF24
                                 border = 3dp white, rounded 25dp
                       ═══════════════════════════════════════════ */}
                    <TouchableOpacity
                        onPress={handleNext}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#FCD34D', '#FBBF24']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.nextButton}
                        >
                            <Text style={styles.nextButtonText}>Next</Text>
                            <Text style={styles.nextSparkle}>✨</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

// ─────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingTop: verticalScale(24),
        paddingBottom: verticalScale(24),
    },

    // ── Top Icon ──────────────────────────────
    iconContainer: {
        marginBottom: verticalScale(12),
    },
    iconCircle: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.white,
    },

    // ── Title Section ─────────────────────────
    titleSection: {
        alignItems: 'center',
        marginBottom: verticalScale(30),
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
    },
    sparkle: {
        fontSize: fontSize.md,
    },
    safeText: {
        fontSize: fontSize.xl,
        color: colors.white,
        fontWeight: '600',
    },
    forParentsText: {
        fontSize: fontSize.xxxl,
        color: '#FFD700',
        fontWeight: 'bold',
        marginTop: verticalScale(4),
    },

    // ── Image Section ─────────────────────────
    imageSection: {

        width: '100%',
        marginBottom: verticalScale(16),
    },
    imageWrapper: {
        width: '100%',
        aspectRatio: 1.2,
        borderRadius: 16,
        borderWidth: 12,
        borderColor: 'rgba(100, 120, 180, 0.6)',
        overflow: 'hidden',
    },
    imageContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
    },

    // ── Info Box ──────────────────────────────
    infoBox: {
        width: '100%',
        backgroundColor: '#0055AA',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(14),
        marginBottom: verticalScale(20),
    },
    infoTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
        marginBottom: verticalScale(6),
    },
    infoSparkle: {
        fontSize: fontSize.md,
    },
    infoTitle: {
        fontSize: fontSize.xl,
        color: colors.white,
        lineHeight: verticalScale(28),

        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
    infoDescription: {
        fontSize: fontSize.md,
        color: colors.white,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: verticalScale(22),
    },

    // ── Next Button ───────────────────────────
    nextButton: {
        width: scale(160),
        height: verticalScale(52),
        borderRadius: 25,
        borderWidth: 3,
        borderColor: colors.white,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: scale(8),
    },
    nextButtonText: {
        fontSize: fontSize.xl,
        color: colors.white,
        fontWeight: 'bold',
    },
    nextSparkle: {
        fontSize: fontSize.xl,
    },
});
