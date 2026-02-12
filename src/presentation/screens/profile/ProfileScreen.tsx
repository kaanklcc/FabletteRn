/**
 * ═══════════════════════════════════════════════════════════════
 * PROFILE SCREEN
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 ProfilSayfa.kt'nin birebir kopyası
 * 
 * Özellikler:
 * - User profile info
 * - Premium status
 * - Settings menu
 * - Logout / Delete account
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

// Components
import ProfileMenuItem from '../../components/profile/ProfileMenuItem';
import PolicyModal from '../../components/profile/PolicyModal';

// Config
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
    ProfileStackParamList,
    'Profile'
>;

interface Props {
    navigation: ProfileScreenNavigationProp;
}

// Mock User Data (TODO: Replace with Firebase)
const MOCK_USER = {
    name: 'Kaan Kılıç',
    email: 'kaan@example.com',
    isPremium: false,
    avatarUrl: 'https://picsum.photos/200/200?random=1', // Placeholder avatar
};

export default function ProfileScreen({ navigation }: Props) {
    // ─────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────
    const [userName] = useState(MOCK_USER.name);
    const [isPremium] = useState(MOCK_USER.isPremium);
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
    const [showTermsOfUse, setShowTermsOfUse] = useState(false);

    // ─────────────────────────────────────────────────────────
    // HANDLERS
    // ─────────────────────────────────────────────────────────
    const handleUpgrade = () => {
        navigation.navigate('Premium', { source: 'profile' });
    };

    const handleLogout = () => {
        Alert.alert(
            'Çıkış Yapmak İstiyor Musunuz?',
            'Çıkış yapmak istediğinize emin misiniz?',
            [
                { text: 'Hayır', style: 'cancel' },
                {
                    text: 'Evet',
                    onPress: () => {
                        // TODO: Firebase sign out
                        console.log('Logout');
                    },
                },
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Hesabı Sil',
            'Bu işlem geri alınamaz. Tüm verileriniz silinecektir.',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: () => {
                        // TODO: Delete from Firebase + Firestore
                        console.log('Delete account');
                    },
                },
            ]
        );
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
                <Text style={styles.headerTitle}>Profil</Text>
                <View style={styles.headerRight} />
            </View>

            {/* Content */}
            <LinearGradient
                colors={['#003366', '#004080', '#0055AA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}>
                    {/* Language Switcher - TODO */}
                    <View style={styles.languageSwitcher}>
                        <Text style={styles.languageText}>🌐 TR</Text>
                    </View>

                    {/* Profile Avatar */}
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: MOCK_USER.avatarUrl }}
                            style={styles.avatar}
                            resizeMode="cover"
                        />
                    </View>

                    {/* User Name */}
                    <Text style={styles.userName}>{userName}</Text>

                    {/* Premium Status Card */}
                    <View
                        style={[
                            styles.premiumCard,
                            {
                                backgroundColor: isPremium
                                    ? 'rgba(252, 211, 77, 0.3)'
                                    : 'rgba(0, 85, 170, 0.3)',
                            },
                        ]}>
                        <View style={styles.premiumLeft}>
                            <Ionicons
                                name={isPremium ? 'trophy' : 'star'}
                                size={scale(32)}
                                color={isPremium ? '#FCD34D' : colors.white}
                            />
                            <View>
                                <Text style={styles.premiumLabel}>Hesap Durumu</Text>
                                <Text style={styles.premiumStatus}>
                                    {isPremium ? 'Premium Üye' : 'Ücretsiz Üye'}
                                </Text>
                            </View>
                        </View>
                        {!isPremium && (
                            <TouchableOpacity
                                style={styles.upgradeButton}
                                onPress={handleUpgrade}
                                activeOpacity={0.8}>
                                <Text style={styles.upgradeButtonText}>Yükselt</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Menu Items */}
                    <ProfileMenuItem
                        icon="information-circle"
                        title="Gizlilik Politikası"
                        onPress={() => setShowPrivacyPolicy(true)}
                    />

                    <ProfileMenuItem
                        icon="information-circle"
                        title="Kullanım Şartları"
                        onPress={() => setShowTermsOfUse(true)}
                    />

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

                    {/* Logout Button */}
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                        activeOpacity={0.8}>
                        <Ionicons name="exit-outline" size={scale(24)} color="#003366" />
                        <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
                    </TouchableOpacity>

                    {/* Delete Account Button */}
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDeleteAccount}
                        activeOpacity={0.8}>
                        <Ionicons name="trash-outline" size={scale(24)} color={colors.white} />
                        <Text style={styles.deleteButtonText}>Hesabı Sil</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>

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
        gap: verticalScale(16),
        paddingBottom: verticalScale(32),
    },
    languageSwitcher: {
        alignSelf: 'flex-end',
    },
    languageText: {
        fontSize: fontSize.md,
        color: colors.white,
    },
    avatarContainer: {
        alignSelf: 'center',
        marginTop: verticalScale(16),
    },
    avatar: {
        width: scale(100),
        height: scale(100),
        borderRadius: 50,
        backgroundColor: colors.white,
    },
    userName: {
        fontSize: fontSize.xxxl,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
    },
    premiumCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.white,
        padding: spacing.md,
    },
    premiumLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
    },
    premiumLabel: {
        fontSize: fontSize.sm,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    premiumStatus: {
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        color: colors.white,
    },
    upgradeButton: {
        backgroundColor: '#FCD34D',
        borderRadius: 12,
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(16),
    },
    upgradeButtonText: {
        fontSize: fontSize.md,
        fontWeight: 'bold',
        color: '#003366',
    },
    aiDisclosure: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(252, 211, 77, 0.2)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FCD34D',
        padding: spacing.md,
        gap: scale(12),
    },
    aiDisclosureText: {
        flex: 1,
        gap: verticalScale(4),
    },
    aiDisclosureTitle: {
        fontSize: fontSize.sm,
        fontWeight: 'bold',
        color: colors.white,
    },
    aiDisclosureMessage: {
        fontSize: fontSize.xs,
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: verticalScale(16),
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FCD34D',
        borderRadius: 16,
        paddingVertical: verticalScale(16),
        gap: scale(8),
    },
    logoutButtonText: {
        fontSize: fontSize.md,
        fontWeight: 'bold',
        color: '#003366',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EF4444',
        borderRadius: 16,
        paddingVertical: verticalScale(16),
        gap: scale(8),
    },
    deleteButtonText: {
        fontSize: fontSize.md,
        fontWeight: 'bold',
        color: colors.white,
    },
});
