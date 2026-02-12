/**
 * ═══════════════════════════════════════════════════════════════
 * PREMIUM SCREEN
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 PremiumSayfa.kt'nin birebir kopyası
 * 
 * Özellikler:
 * - Premium features list
 * - Package selection (weekly/monthly)
 * - Parental gate (math question)
 * - Purchase flow
 * - Success dialog
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ProfileStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

// Components
import PremiumPackageCard from '../../components/premium/PremiumPackageCard';
import PolicyModal from '../../components/profile/PolicyModal';

// Config
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';

type PremiumScreenNavigationProp = NativeStackNavigationProp<
    ProfileStackParamList,
    'Premium'
>;

type PremiumScreenRouteProp = RouteProp<ProfileStackParamList, 'Premium'>;

interface Props {
    navigation: PremiumScreenNavigationProp;
    route: PremiumScreenRouteProp;
}

// Package Interface
interface Package {
    id: string;
    title: string;
    price: string;
    duration: string;
    tokens: string;
}

// Mock Packages (TODO: Replace with RevenueCat)
const PACKAGES: Record<string, Package> = {
    weekly: {
        id: 'weekly',
        title: 'Haftalık Paket',
        price: '₺49.99',
        duration: '7 gün',
        tokens: '7 token',
    },
    monthly: {
        id: 'monthly',
        title: 'Aylık Paket',
        price: '₺149.99',
        duration: '30 gün',
        tokens: '30 token',
    },
};

const FEATURES = [
    'Kişiselleştirilmiş hikaye oluşturma',
    'AI görsel oluşturma',
    'Premium ses (OpenAI)',
];

export default function PremiumScreen({ navigation }: Props) {
    // ─────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────
    const [selectedPackage, setSelectedPackage] = useState<'weekly' | 'monthly'>('monthly');
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [showParentalGate, setShowParentalGate] = useState(false);
    const [parentalAnswer, setParentalAnswer] = useState('');
    const [parentalError, setParentalError] = useState(false);
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
    const [showTermsOfUse, setShowTermsOfUse] = useState(false);

    // Random math question (memoized so it doesn't change on re-render)
    const mathQuestion = useMemo(() => {
        const num1 = Math.floor(Math.random() * 41) + 10; // 10-50
        const num2 = Math.floor(Math.random() * 9) + 1; // 1-9
        return { num1, num2, answer: num1 * num2 };
    }, []);

    // ─────────────────────────────────────────────────────────
    // HANDLERS
    // ─────────────────────────────────────────────────────────
    const handlePurchase = () => {
        setShowParentalGate(true);
    };

    const handleParentalGateSubmit = () => {
        if (parentalAnswer === mathQuestion.answer.toString()) {
            // Correct answer - proceed with purchase
            setShowParentalGate(false);
            setParentalAnswer('');
            setParentalError(false);

            // Mock purchase flow
            setIsPurchasing(true);
            setTimeout(() => {
                setIsPurchasing(false);
                Alert.alert(
                    'Satın Alma Başarılı',
                    'Premium üyeliğiniz aktif edildi!',
                    [
                        {
                            text: 'Tamam',
                            onPress: () => navigation.goBack(),
                        },
                    ]
                );
            }, 1500);
        } else {
            // Wrong answer
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
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}>
                    <Ionicons name="arrow-back" size={scale(24)} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Premium Paketler</Text>
                <View style={styles.headerRight} />
            </View>

            {/* Content */}
            <LinearGradient
                colors={['#003366', '#004080', '#0055AA']}
                style={styles.gradient}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}>
                    {/* Features List */}
                    <View style={styles.featuresList}>
                        {FEATURES.map((feature, index) => (
                            <View key={index} style={styles.featureItem}>
                                <Text style={styles.featureBullet}>•</Text>
                                <Text style={styles.featureText}>{feature}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Package Cards */}
                    <View style={styles.packagesContainer}>
                        <PremiumPackageCard
                            package={PACKAGES.weekly}
                            isSelected={selectedPackage === 'weekly'}
                            onPress={() => setSelectedPackage('weekly')}
                        />

                        {/* Monthly Package with Discount Badge */}
                        <View>
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>%65 İndirim</Text>
                            </View>
                            <PremiumPackageCard
                                package={PACKAGES.monthly}
                                isSelected={selectedPackage === 'monthly'}
                                onPress={() => setSelectedPackage('monthly')}
                                highlight
                            />
                        </View>
                    </View>

                    {/* Purchase Button */}
                    <TouchableOpacity
                        style={styles.purchaseButton}
                        onPress={handlePurchase}
                        disabled={isPurchasing}
                        activeOpacity={0.8}>
                        {isPurchasing ? (
                            <ActivityIndicator size="small" color="#0055AA" />
                        ) : (
                            <Text style={styles.purchaseButtonText}>
                                Pro Satın Al - {PACKAGES[selectedPackage].price}
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Auto-Renew Disclaimer */}
                    <Text style={styles.disclaimer}>
                        Abonelik otomatik yenilenir ve iptal edilene kadar her ay
                        ücretlendirilir.
                    </Text>

                    {/* Privacy & Terms Links */}
                    <View style={styles.linksContainer}>
                        <TouchableOpacity onPress={() => setShowTermsOfUse(true)}>
                            <Text style={styles.linkText}>Kullanım Şartları</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowPrivacyPolicy(true)}>
                            <Text style={styles.linkText}>Gizlilik Politikası</Text>
                        </TouchableOpacity>
                    </View>

                    {/* AI Disclosure */}
                    <View style={styles.aiDisclosure}>
                        <Ionicons
                            name="information-circle"
                            size={scale(24)}
                            color="#FCD34D"
                        />
                        <View style={styles.aiDisclosureText}>
                            <Text style={styles.aiDisclosureTitle}>AI Kullanımı</Text>
                            <Text style={styles.aiDisclosureMessage}>
                                Bu uygulama yapay zeka kullanarak hikayeler oluşturur. Tüm
                                içerikler AI tarafından üretilir.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>

            {/* Parental Gate Dialog */}
            {showParentalGate && (
                <View style={styles.dialogOverlay}>
                    <View style={styles.dialogContainer}>
                        <Text style={styles.dialogTitle}>Ebeveyn Onayı</Text>
                        <Text style={styles.dialogMessage}>
                            Lütfen devam etmek için aşağıdaki soruyu cevaplayın:
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
                            placeholder="Cevabınız"
                            keyboardType="number-pad"
                            maxLength={5}
                        />
                        {parentalError && (
                            <Text style={styles.errorText}>Yanlış cevap!</Text>
                        )}
                        <View style={styles.dialogButtons}>
                            <TouchableOpacity
                                style={styles.dialogButtonCancel}
                                onPress={handleParentalGateCancel}>
                                <Text style={styles.dialogButtonTextCancel}>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dialogButtonConfirm}
                                onPress={handleParentalGateSubmit}>
                                <Text style={styles.dialogButtonTextConfirm}>Devam Et</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Modals */}
            <PolicyModal
                visible={showPrivacyPolicy}
                title="Gizlilik Politikası"
                content="Bu uygulama kullanıcı verilerini korur ve gizliliğinize saygı duyar. Verileriniz üçüncü taraflarla paylaşılmaz."
                onClose={() => setShowPrivacyPolicy(false)}
            />

            <PolicyModal
                visible={showTermsOfUse}
                title="Kullanım Şartları"
                content="Bu uygulamayı kullanarak kullanım şartlarını kabul etmiş olursunuz. Lütfen sorumlu bir şekilde kullanın."
                onClose={() => setShowTermsOfUse(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#003366',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: verticalScale(12),
        backgroundColor: '#003366',
    },
    backButton: {
        padding: scale(4),
    },
    headerTitle: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        color: colors.white,
    },
    headerRight: {
        width: scale(32),
    },
    gradient: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
        gap: verticalScale(20),
        paddingBottom: verticalScale(32),
    },
    featuresList: {
        gap: verticalScale(6),
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    featureBullet: {
        fontSize: fontSize.md,
        color: '#FCD34D',
    },
    featureText: {
        fontSize: fontSize.md,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    packagesContainer: {
        gap: verticalScale(10),
    },
    discountBadge: {
        position: 'absolute',
        top: verticalScale(6),
        right: scale(-12),
        backgroundColor: '#FBBF24',
        borderRadius: 6,
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(2),
        zIndex: 1,
    },
    discountText: {
        fontSize: fontSize.xs,
        fontWeight: 'bold',
        color: '#0055AA',
    },
    purchaseButton: {
        backgroundColor: '#FBBF24',
        borderRadius: 12,
        paddingVertical: verticalScale(14),
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: verticalScale(48),
    },
    purchaseButtonText: {
        fontSize: fontSize.md,
        fontWeight: 'bold',
        color: '#0055AA',
    },
    disclaimer: {
        fontSize: fontSize.xs,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        lineHeight: verticalScale(12),
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    linkText: {
        fontSize: fontSize.xs,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    aiDisclosure: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(252, 211, 77, 0.15)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(252, 211, 77, 0.5)',
        padding: spacing.sm,
        gap: scale(10),
    },
    aiDisclosureText: {
        flex: 1,
        gap: verticalScale(3),
    },
    aiDisclosureTitle: {
        fontSize: fontSize.xs,
        fontWeight: 'bold',
        color: colors.white,
    },
    aiDisclosureMessage: {
        fontSize: fontSize.xs,
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: verticalScale(12),
    },
    // Parental Gate Dialog
    dialogOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.md,
    },
    dialogContainer: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: spacing.lg,
        width: '100%',
        maxWidth: scale(400),
    },
    dialogTitle: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        color: '#003366',
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
        color: '#003366',
        textAlign: 'center',
        marginVertical: verticalScale(16),
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
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
        borderRadius: 8,
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
        borderRadius: 8,
        backgroundColor: '#003366',
    },
    dialogButtonTextConfirm: {
        fontSize: fontSize.md,
        fontWeight: 'bold',
        color: colors.white,
    },
});
