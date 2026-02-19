/**
 * ═══════════════════════════════════════════════════════════════
 * PREMIUM SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Yeni tasarım - Hero image + özellikler + fiyatlandırma kartları
 *
 * Özellikler:
 * - Hero image (anne.png)
 * - Feature bullet points
 * - Checkmark feature card
 * - Weekly/Monthly pricing cards
 * - Parental gate (math question)
 * - CTA button
 * - Policy modals
 */

import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    Alert,
    ActivityIndicator,
    Image,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ProfileStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

// Components
import PolicyModal from '../../components/profile/PolicyModal';

// Config
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';
import { useAuthStore } from '@/store/zustand/useAuthStore';
import { useUserStore } from '@/store/zustand/useUserStore';
import { UserRepositoryImpl } from '@/data/repositories/UserRepositoryImpl';
import { auth } from '@/config/firebase';
import { useTranslation } from 'react-i18next';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PremiumScreenNavigationProp = NativeStackNavigationProp<
    ProfileStackParamList,
    'Premium'
>;

type PremiumScreenRouteProp = RouteProp<ProfileStackParamList, 'Premium'>;

interface Props {
    navigation: PremiumScreenNavigationProp;
    route: PremiumScreenRouteProp;
}

// Package interface
interface PackageInfo {
    id: string;
    label: string;
    stories: string;
    price: string;
    period: string;
    subtitle: string;
    isPopular: boolean;
}

export default function PremiumScreen({ navigation }: Props) {
    const { t } = useTranslation();

    // Build localized content arrays
    const BULLET_POINTS = [
        t('premium.bullets.bullet1'),
        t('premium.bullets.bullet2'),
        t('premium.bullets.bullet3'),
    ];

    const CHECKMARK_FEATURES = [
        t('premium.features.feature1'),
        t('premium.features.feature2'),
        t('premium.features.feature3'),
        t('premium.features.feature4'),
    ];

    const PACKAGES: PackageInfo[] = [
        {
            id: 'weekly',
            label: t('premium.packages.weekly.label'),
            stories: t('premium.packages.weekly.stories'),
            price: t('premium.packages.weekly.price'),
            period: t('premium.packages.weekly.period'),
            subtitle: t('premium.packages.weekly.subtitle'),
            isPopular: false,
        },
        {
            id: 'monthly',
            label: t('premium.packages.monthly.label'),
            stories: t('premium.packages.monthly.stories'),
            price: t('premium.packages.monthly.price'),
            period: t('premium.packages.monthly.period'),
            subtitle: t('premium.packages.monthly.subtitle'),
            isPopular: true,
        },
    ];
    // ─────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────
    const [selectedPackage, setSelectedPackage] = useState<string>('monthly');
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [showParentalGate, setShowParentalGate] = useState(false);
    const [parentalAnswer, setParentalAnswer] = useState('');
    const [parentalError, setParentalError] = useState(false);
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
    const [showTermsOfUse, setShowTermsOfUse] = useState(false);
    const setUser = useAuthStore((state) => state.setUser);
    const user = useAuthStore((state) => state.user);
    const updatePremiumStatus = useUserStore((state) => state.updatePremiumStatus);

    // Random math question (memoized so it doesn't change on re-render)
    const mathQuestion = useMemo(() => {
        const num1 = Math.floor(Math.random() * 3) + 1;
        const num2 = Math.floor(Math.random() * 4) + 1;
        return { num1, num2, answer: num1 * num2 };
    }, []);

    const selectedPkg = PACKAGES.find(p => p.id === selectedPackage) || PACKAGES[1];

    // ─────────────────────────────────────────────────────────
    // HANDLERS
    // ─────────────────────────────────────────────────────────
    const handlePurchase = () => {
        setShowParentalGate(true);
    };

    const handleParentalGateSubmit = async () => {
        if (parentalAnswer === mathQuestion.answer.toString()) {
            setShowParentalGate(false);
            setParentalAnswer('');
            setParentalError(false);

            setIsPurchasing(true);

            try {
                // Seçilen pakete göre süre ve hak belirle
                const durationDays = selectedPackage === 'weekly' ? 7 : 30;
                const credits = selectedPackage === 'weekly' ? 3 : 20;

                const userId = user?.uid || auth.currentUser?.uid;
                if (!userId) {
                    Alert.alert(t('common.error'), t('premium.alerts.userNotFound'));
                    setIsPurchasing(false);
                    return;
                }

                // Firestore'a yaz
                const userRepo = new UserRepositoryImpl();
                await userRepo.updatePremiumStatus(userId, true, durationDays, credits);

                // Zustand store güncelle
                updatePremiumStatus(true, durationDays, credits);

                // Auth store'u da güncelle
                if (user) {
                    setUser({
                        ...user,
                        isPremium: true,
                        remainingCredits: credits,
                        premiumStartDate: new Date(),
                        premiumDurationDays: durationDays,
                    });
                }

                console.log(`✅ Premium aktifleştirildi: ${selectedPackage} (${durationDays} gün, ${credits} hikaye)`);

                setIsPurchasing(false);
                Alert.alert(
                    t('premium.purchaseSuccess'),
                    t('premium.purchaseMessage', { days: durationDays, stories: credits }),
                    [
                        {
                            text: t('common.ok'),
                            onPress: () => navigation.goBack(),
                        },
                    ]
                );
            } catch (error) {
                console.error('🔴 Premium güncelleme hatası:', error);
                setIsPurchasing(false);
                Alert.alert(t('common.error'), t('premium.purchaseError'));
            }
        } else {
            setParentalError(true);
        }
    };

    const handleParentalGateCancel = () => {
        setShowParentalGate(false);
        setParentalAnswer('');
        setParentalError(false);
    };

    // ─────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────
    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}>
                {/* ═══ HERO IMAGE ═══ */}
                <View style={styles.heroContainer}>
                    <Image
                        source={require('../../../../assets/anne.png')}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={[
                            'transparent',
                            'rgba(15, 30, 60, 0.3)',
                            'rgba(15, 30, 60, 0.7)',
                            '#0F1E3C',
                        ]}
                        style={styles.heroOverlay}
                    />
                    {/* Back Button */}
                    <SafeAreaView edges={['top']} style={styles.backButtonContainer}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                            activeOpacity={0.7}>
                            <Ionicons name="close" size={scale(24)} color={colors.white} />
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>

                {/* ═══ MAIN CONTENT ═══ */}
                <LinearGradient
                    colors={['#0F1E3C', '#162D5A', '#1A3566']}
                    style={styles.contentGradient}>

                    {/* ─── Title ─── */}
                    <Text style={styles.mainTitle}>
                        {t('premium.title')}
                    </Text>

                    {/* ─── Bullet Points ─── */}
                    <View style={styles.bulletList}>
                        {BULLET_POINTS.map((point, index) => (
                            <View key={index} style={styles.bulletItem}>
                                <View style={styles.bulletDot} />
                                <Text style={styles.bulletText}>{point}</Text>
                            </View>
                        ))}
                    </View>

                    {/* ─── Checkmark Feature Card ─── */}
                    <View style={styles.featureCard}>
                        {CHECKMARK_FEATURES.map((feature, index) => (
                            <View key={index} style={styles.featureRow}>
                                <Ionicons
                                    name="checkmark-circle"
                                    size={scale(22)}
                                    color="#F5C842"
                                />
                                <Text style={styles.featureText}>{feature}</Text>
                            </View>
                        ))}
                    </View>

                    {/* ─── Pricing Cards ─── */}
                    <View style={styles.pricingRow}>
                        {PACKAGES.map((pkg) => {
                            const isSelected = selectedPackage === pkg.id;
                            return (
                                <TouchableOpacity
                                    key={pkg.id}
                                    style={[
                                        styles.pricingCard,
                                        isSelected && styles.pricingCardSelected,
                                        pkg.isPopular && styles.pricingCardPopular,
                                    ]}
                                    onPress={() => setSelectedPackage(pkg.id)}
                                    activeOpacity={0.8}>
                                    {/* Popular Badge */}
                                    {pkg.isPopular && (
                                        <View style={styles.popularBadge}>
                                            <Text style={styles.popularBadgeIcon}>⭐</Text>
                                            <Text style={styles.popularBadgeText}>
                                                {t('premium.packages.popularBadge', { label: pkg.label })}
                                            </Text>
                                            {isSelected && (
                                                <Ionicons
                                                    name="checkmark-circle"
                                                    size={scale(18)}
                                                    color="#1A3566"
                                                />
                                            )}
                                        </View>
                                    )}

                                    {/* Non-popular label */}
                                    {!pkg.isPopular && (
                                        <Text style={[
                                            styles.planLabel,
                                            isSelected && styles.planLabelSelected,
                                        ]}>
                                            {pkg.label}
                                        </Text>
                                    )}

                                    {/* Stories count */}
                                    <Text style={[
                                        styles.storiesCount,
                                        pkg.isPopular && styles.storiesCountPopular,
                                    ]}>
                                        {pkg.stories}
                                    </Text>

                                    {/* Price */}
                                    <View style={styles.priceRow}>
                                        <Text style={[
                                            styles.priceAmount,
                                            pkg.isPopular && styles.priceAmountPopular,
                                        ]}>
                                            {pkg.price}
                                        </Text>
                                        <Text style={[
                                            styles.pricePeriod,
                                            pkg.isPopular && styles.pricePeriodPopular,
                                        ]}>
                                            {pkg.period}
                                        </Text>
                                    </View>

                                    {/* Subtitle */}
                                    <Text style={[
                                        styles.planSubtitle,
                                        pkg.isPopular && styles.planSubtitlePopular,
                                    ]}>
                                        {pkg.subtitle}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* ─── CTA Button ─── */}
                    <TouchableOpacity
                        style={styles.ctaButton}
                        onPress={handlePurchase}
                        disabled={isPurchasing}
                        activeOpacity={0.85}>
                        {isPurchasing ? (
                            <ActivityIndicator size="small" color="#1A3566" />
                        ) : (
                            <Text style={styles.ctaButtonText}>
                                {t('premium.ctaButton')}
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* ─── Cancel Text ─── */}
                    <Text style={styles.cancelText}>
                        {t('premium.cancelText')}
                    </Text>

                    {/* ─── Subscription Disclaimer ─── */}
                    <Text style={styles.disclaimerText}>
                        {t('premium.disclaimer')}
                    </Text>

                    {/* ─── Links ─── */}
                    <View style={styles.linksRow}>
                        <TouchableOpacity onPress={() => setShowTermsOfUse(true)}>
                            <Text style={styles.linkText}>{t('premium.termsOfUse')}</Text>
                        </TouchableOpacity>
                        <Text style={styles.linkSeparator}>|</Text>
                        <TouchableOpacity onPress={() => setShowPrivacyPolicy(true)}>
                            <Text style={styles.linkText}>{t('premium.privacyPolicy')}</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </ScrollView>

            {/* ═══ PARENTAL GATE DIALOG ═══ */}
            {showParentalGate && (
                <View style={styles.dialogOverlay}>
                    <View style={styles.dialogContainer}>
                        <Text style={styles.dialogTitle}>{t('premium.parentalGate.title')}</Text>
                        <Text style={styles.dialogMessage}>
                            {t('premium.parentalGate.message')}
                        </Text>
                        <Text style={styles.mathQuestion}>
                            {mathQuestion.num1} x {mathQuestion.num2} = ?
                        </Text>
                        <TextInput
                            style={[styles.input, parentalError && styles.inputError]}
                            value={parentalAnswer}
                            onChangeText={(text) => {
                                if (/^\d*$/.test(text)) {
                                    setParentalAnswer(text);
                                    setParentalError(false);
                                }
                            }}
                            placeholder={t('premium.parentalGate.placeholder')}
                            keyboardType="number-pad"
                            maxLength={5}
                        />
                        {parentalError && (
                            <Text style={styles.errorText}>{t('premium.parentalGate.wrongAnswer')}</Text>
                        )}
                        <View style={styles.dialogButtons}>
                            <TouchableOpacity
                                style={styles.dialogButtonCancel}
                                onPress={handleParentalGateCancel}>
                                <Text style={styles.dialogButtonTextCancel}>{t('premium.parentalGate.cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dialogButtonConfirm}
                                onPress={handleParentalGateSubmit}>
                                <Text style={styles.dialogButtonTextConfirm}>{t('premium.parentalGate.continue')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* ═══ POLICY MODALS ═══ */}
            <PolicyModal
                visible={showPrivacyPolicy}
                title={t('premium.privacyPolicy')}
                htmlFile="privacy"
                onClose={() => setShowPrivacyPolicy(false)}
            />

            <PolicyModal
                visible={showTermsOfUse}
                title={t('premium.termsOfUse')}
                htmlFile="terms"
                onClose={() => setShowTermsOfUse(false)}
            />
        </View>
    );
}

// ─────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────
const CARD_GAP = scale(12);
const CARD_WIDTH = (SCREEN_WIDTH - spacing.md * 2 - CARD_GAP) / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1E3C',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },

    // ── Hero ────────────────────────────────────
    heroContainer: {
        width: '100%',
        height: verticalScale(280),
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
    },
    backButtonContainer: {
        position: 'absolute',
        top: 0,
        right: spacing.md,
    },
    backButton: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(8),
    },

    // ── Content ─────────────────────────────────
    contentGradient: {
        paddingHorizontal: spacing.md,
        paddingTop: verticalScale(4),
        paddingBottom: verticalScale(40),
    },

    // ── Title ───────────────────────────────────
    mainTitle: {
        fontSize: fontSize.xxxl,
        fontWeight: '800',
        color: colors.white,
        lineHeight: fontSize.xxxl * 1.2,
        marginBottom: verticalScale(16),
    },

    // ── Bullet Points ───────────────────────────
    bulletList: {
        gap: verticalScale(8),
        marginBottom: verticalScale(20),
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
    },
    bulletDot: {
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    bulletText: {
        fontSize: fontSize.md,
        color: colors.white,
        fontWeight: '500',
    },

    // ── Feature Card ────────────────────────────
    featureCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: scale(16),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        padding: spacing.md,
        gap: verticalScale(12),
        marginBottom: verticalScale(24),
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
    },
    featureText: {
        fontSize: fontSize.md,
        color: colors.white,
        fontWeight: '500',
        flex: 1,
    },

    // ── Pricing Cards ───────────────────────────
    pricingRow: {
        flexDirection: 'row',
        gap: CARD_GAP,
        marginBottom: verticalScale(24),
    },
    pricingCard: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: scale(16),
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: scale(12),
        paddingTop: verticalScale(16),
        paddingBottom: verticalScale(14),
        alignItems: 'center',
    },
    pricingCardSelected: {
        borderColor: '#F5C842',
        borderWidth: 2,
    },
    pricingCardPopular: {
        backgroundColor: '#F5C842',
        borderColor: '#F5C842',
        paddingTop: verticalScale(0),
    },

    // ── Popular Badge ───────────────────────────
    popularBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
        backgroundColor: 'rgba(26, 53, 102, 0.2)',
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(6),
        borderRadius: scale(12),
        marginBottom: verticalScale(8),
        marginTop: verticalScale(10),
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    popularBadgeIcon: {
        fontSize: scale(12),
    },
    popularBadgeText: {
        fontSize: scale(10),
        fontWeight: '700',
        color: '#1A3566',
    },

    // ── Plan Labels ─────────────────────────────
    planLabel: {
        fontSize: fontSize.md,
        fontWeight: '700',
        color: colors.white,
        marginBottom: verticalScale(10),
        textAlign: 'center',
    },
    planLabelSelected: {
        color: '#F5C842',
    },

    // ── Stories Count ────────────────────────────
    storiesCount: {
        fontSize: fontSize.lg,
        fontWeight: '800',
        color: colors.white,
        marginBottom: verticalScale(4),
        textAlign: 'center',
    },
    storiesCountPopular: {
        color: '#1A3566',
    },

    // ── Price ───────────────────────────────────
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: verticalScale(6),
    },
    priceAmount: {
        fontSize: scale(28),
        fontWeight: '900',
        color: colors.white,
    },
    priceAmountPopular: {
        color: '#1A3566',
    },
    pricePeriod: {
        fontSize: fontSize.sm,
        color: 'rgba(255, 255, 255, 0.7)',
        marginLeft: scale(2),
    },
    pricePeriodPopular: {
        color: 'rgba(26, 53, 102, 0.6)',
    },

    // ── Plan Subtitle ───────────────────────────
    planSubtitle: {
        fontSize: scale(11),
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    planSubtitlePopular: {
        color: 'rgba(26, 53, 102, 0.7)',
    },

    // ── CTA Button ──────────────────────────────
    ctaButton: {
        backgroundColor: '#F5C842',
        borderRadius: scale(28),
        paddingVertical: verticalScale(16),
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: verticalScale(56),
        marginBottom: verticalScale(12),
        // Subtle shadow
        shadowColor: '#F5C842',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    ctaButtonText: {
        fontSize: fontSize.lg,
        fontWeight: '800',
        color: '#1A3566',
        letterSpacing: 0.5,
    },

    // ── Cancel/Disclaimer ───────────────────────
    cancelText: {
        fontSize: fontSize.sm,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        marginBottom: verticalScale(16),
    },
    disclaimerText: {
        fontSize: scale(11),
        color: 'rgba(255, 255, 255, 0.4)',
        textAlign: 'center',
        lineHeight: scale(16),
        marginBottom: verticalScale(16),
    },

    // ── Links ───────────────────────────────────
    linksRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: scale(8),
    },
    linkText: {
        fontSize: fontSize.xs,
        color: 'rgba(255, 255, 255, 0.5)',
        textDecorationLine: 'underline',
    },
    linkSeparator: {
        fontSize: fontSize.xs,
        color: 'rgba(255, 255, 255, 0.3)',
    },

    // ── Parental Gate Dialog ────────────────────
    dialogOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.md,
    },
    dialogContainer: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: spacing.lg,
        width: '100%',
        maxWidth: scale(400),
    },
    dialogTitle: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        color: '#1A3566',
        marginBottom: verticalScale(8),
    },
    dialogMessage: {
        fontSize: fontSize.md,
        color: '#1F2937',
        marginBottom: verticalScale(16),
    },
    mathQuestion: {
        fontSize: fontSize.xxl,
        fontWeight: 'bold',
        color: '#1A3566',
        textAlign: 'center',
        marginVertical: verticalScale(16),
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        paddingVertical: verticalScale(12),
        fontSize: fontSize.md,
        marginBottom: verticalScale(8),
    },
    inputError: {
        borderColor: '#EF4444',
    },
    errorText: {
        fontSize: fontSize.sm,
        color: '#EF4444',
        marginBottom: verticalScale(16),
    },
    dialogButtons: {
        flexDirection: 'row',
        gap: scale(12),
        marginTop: verticalScale(8),
    },
    dialogButtonCancel: {
        flex: 1,
        paddingVertical: verticalScale(12),
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    dialogButtonTextCancel: {
        fontSize: fontSize.md,
        color: '#6B7280',
    },
    dialogButtonConfirm: {
        flex: 1,
        paddingVertical: verticalScale(12),
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#1A3566',
    },
    dialogButtonTextConfirm: {
        fontSize: fontSize.md,
        fontWeight: 'bold',
        color: colors.white,
    },
});
