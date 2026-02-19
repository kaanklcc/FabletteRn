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

import { useAuthStore } from '@/store/zustand/useAuthStore';
import { useUserStore } from '@/store/zustand/useUserStore';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
    ProfileStackParamList,
    'Profile'
>;

interface Props {
    navigation: ProfileScreenNavigationProp;
}

export default function ProfileScreen({ navigation }: Props) {
    // ─────────────────────────────────────────────────────────
    // FIREBASE DATA
    // ─────────────────────────────────────────────────────────
    const { user } = useAuthStore();
    const { isPremium, userData } = useUserStore();
    const { t } = useTranslation();

    const userName = userData?.ad || user?.email?.split('@')[0] || t('profile.defaultUser');

    // ─────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────
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
            t('profile.logoutTitle'),
            t('profile.logoutMessage'),
            [
                { text: t('common.no'), style: 'cancel' },
                {
                    text: t('common.yes'),
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
            t('profile.deleteAccountTitle'),
            t('profile.deleteAccountMessage'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
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
                <Text style={styles.headerTitle}>{t('profile.title')}</Text>
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
                        <LanguageSwitcher variant="dark" />
                    </View>

                    {/* Profile Avatar */}
                    <View style={styles.avatarContainer}>
                        <Image
                            source={require('../../../../assets/parskedi.png')}
                            style={styles.avatar}
                            resizeMode="cover"
                        />
                    </View>

                    {/* User Name */}
                    <Text style={styles.userName}>{userName}</Text>

                    {/* Premium Status Card */}
                    <TouchableOpacity
                        style={[
                            styles.premiumCard,
                            {
                                backgroundColor: isPremium
                                    ? 'rgba(252, 211, 77, 0.3)'
                                    : 'rgba(0, 85, 170, 0.3)',
                            },
                        ]}
                        onPress={handleUpgrade}
                        activeOpacity={0.8}>
                        <View style={styles.premiumLeft}>
                            <Ionicons
                                name={isPremium ? 'diamond' : 'star'}
                                size={scale(32)}
                                color={isPremium ? '#FCD34D' : colors.white}
                            />
                            <View>
                                <Text style={styles.premiumLabel}>{t('profile.accountStatus')}</Text>
                                <Text style={styles.premiumStatus}>
                                    {isPremium ? t('profile.premiumMember') : t('profile.freeMember')}
                                </Text>
                            </View>
                        </View>
                        {!isPremium && (
                            <View style={styles.upgradeButton}>
                                <Text style={styles.upgradeButtonText}>{t('profile.upgrade')}</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Menu Items */}
                    <ProfileMenuItem
                        icon="information-circle"
                        title={t('profile.privacyPolicy')}
                        onPress={() => setShowPrivacyPolicy(true)}
                    />

                    <ProfileMenuItem
                        icon="information-circle"
                        title={t('profile.termsOfUse')}
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
                            <Text style={styles.aiDisclosureTitle}>{t('profile.aiDisclosureTitle')}</Text>
                            <Text style={styles.aiDisclosureMessage}>
                                {t('profile.aiDisclosureMessage')}
                            </Text>
                        </View>
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                        activeOpacity={0.8}>
                        <Ionicons name="exit-outline" size={scale(24)} color="#003366" />
                        <Text style={styles.logoutButtonText}>{t('profile.logout')}</Text>
                    </TouchableOpacity>

                    {/* Delete Account Button */}
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDeleteAccount}
                        activeOpacity={0.8}>
                        <Ionicons name="trash-outline" size={scale(24)} color={colors.white} />
                        <Text style={styles.deleteButtonText}>{t('profile.deleteAccount')}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>

            {/* Modals */}
            <PolicyModal
                visible={showPrivacyPolicy}
                title={t('profile.privacyPolicy')}
                htmlFile="privacy"
                onClose={() => setShowPrivacyPolicy(false)}
            />

            <PolicyModal
                visible={showTermsOfUse}
                title={t('profile.termsOfUse')}
                htmlFile="terms"
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
