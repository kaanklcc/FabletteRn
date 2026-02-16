/**
 * ═══════════════════════════════════════════════════════════════
 * ONBOARDING SCREEN 1 - Story Magic
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 SplashScreen1'in React Native versiyonu.
 * 
 * Kotlin karşılığı: SplashScreen.kt → SplashScreen1 composable
 * 
 * Ekran İçeriği:
 * - Üstte kitap ikonu ile dairesel ikon kutusu (turuncu gradient)
 * - "Welcome, little storyteller!" başlığı
 * - "Story Magic" alt başlık (altın rengi)
 * - Kale görseli (rounded corners + navy border)
 * - AI hikaye açıklaması bilgi kutusu
 * - "Next" butonu → OnboardingScreen2'ye yönlendirir
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

type OnboardingScreen1NavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    'Onboarding1'
>;

interface Props {
    navigation: OnboardingScreen1NavigationProp;
}

// ─────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────

export default function OnboardingScreen1({ navigation }: Props) {
    /**
     * Navigation Handler
     * Kotlin karşılığı: navController.navigate("splashScreen2")
     */
    const handleNext = () => {
        navigation.navigate('Onboarding2');
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
                         TOP ICON - Kitap İkonu (Turuncu Daire)
                         Kotlin: Box(90dp) + gradient #FFAA3D → #FFBF67
                                 + R.drawable.book (45dp, white)
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
                                name="book-outline"
                                size={scale(32)}
                                color={colors.white}
                            />
                        </LinearGradient>
                    </View>

                    {/* ═══════════════════════════════════════════
                         TITLE SECTION
                         Kotlin: "Welcome, little storyteller!" (16sp, white)
                                 "Story Magic" (20sp, #FFD700, bold)
                       ═══════════════════════════════════════════ */}
                    <View style={styles.titleSection}>
                        <View style={styles.titleRow}>
                            <Text style={styles.sparkle}>✨</Text>
                            <Text style={styles.welcomeText}>
                                Welcome, little storyteller!
                            </Text>
                            <Text style={styles.sparkle}>✨</Text>
                        </View>
                        <Text style={styles.storyMagicText}>Story Magic</Text>
                    </View>

                    {/* ═══════════════════════════════════════════
                         IMAGE SECTION - Kale Görseli
                         Kotlin: R.drawable.castle + rounded corners + border
                         Arka plan: #E0DAD2 (bej)
                       ═══════════════════════════════════════════ */}
                    <View style={styles.imageSection}>
                        <View style={styles.imageWrapper}>
                            <Image
                                source={require('../../../../assets/castle.png')}
                                style={styles.imageContainer}
                                resizeMode="cover"
                            />
                        </View>
                    </View>

                    {/* ═══════════════════════════════════════════
                         INFO BOX
                         Kotlin: Box(backgroundColor = #0055AA, border = 1dp white)
                         "Create amazing stories with AI magic!"
                         "Every tale is unique..."
                       ═══════════════════════════════════════════ */}
                    <View style={styles.infoBox}>
                        <View style={styles.infoTitleRow}>
                            <Text style={styles.infoSparkle}>✨</Text>
                            <Text style={styles.infoTitle}>
                                Create amazing stories with AI magic!
                            </Text>
                        </View>
                        <Text style={styles.infoDescription}>
                            Every tale is unique and specially made just for you. Let your imagination soar!
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
    welcomeText: {
        fontSize: fontSize.xl,
        color: colors.white,
        fontWeight: '600',
    },
    storyMagicText: {
        fontSize: fontSize.xxxl,
        color: '#FFD700',
        fontWeight: 'bold',
        marginTop: verticalScale(4),
    },

    // ── Image Section ─────────────────────────
    imageSection: {
        width: '100%',
        marginBottom: verticalScale(20),
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
