/**
 * ═══════════════════════════════════════════════════════════════
 * CREATE STORY SCREEN
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 Hikaye.kt'nin birebir kopyası
 * 
 * Özellikler:
 * - Accordion UI
 * - Theme/Length selection
 * - Dynamic character list
 * - Form validation
 * - Premium lock
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { CreateStackParamList, StoryGenerationParams } from '../../navigation/types';

// Components
import AccordionCard from '../../components/create/AccordionCard';
import ThemeButton from '../../components/create/ThemeButton';
import LockedThemeButton from '../../components/create/LockedThemeButton';
import InputCard from '../../components/create/InputCard';
import SupportingCharactersList from '../../components/create/SupportingCharactersList';
import { Ionicons } from '@expo/vector-icons';

// Store
import { useUserStore } from '@/store/zustand/useUserStore';
import { useAuthStore } from '@/store/zustand/useAuthStore';

// Config
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';
import { useTranslation } from 'react-i18next';

type CreateStoryScreenNavigationProp = NativeStackNavigationProp<
    CreateStackParamList,
    'CreateStory'
>;

interface Props {
    navigation: CreateStoryScreenNavigationProp;
}

// Theme/Length data (icons and colors only — names come from t())
const THEME_DATA = [
    { id: 'adventure', key: 'adventure', icon: '🚀', color: '#EC4899' },
    { id: 'love', key: 'love', icon: '💖', color: '#06B6D4' },
    { id: 'friendship', key: 'friendship', icon: '🧑‍🤝‍🧑', color: '#10B981' },
    { id: 'family', key: 'family', icon: '🏡', color: '#0055AA' },
    { id: 'action', key: 'action', icon: '⚡', color: '#F59E0B' },
    { id: 'scifi', key: 'scifi', icon: '🤖', color: '#8B5CF6' },
];

const LENGTH_DATA = [
    { id: 'short', key: 'short', icon: '📄', color: '#EC4899' },
    { id: 'medium', key: 'medium', icon: '📕', color: '#0055AA' },
    { id: 'long', key: 'long', icon: '📚', color: '#06B6D4' },
];

export default function CreateStoryScreen({ navigation }: Props) {
    // ─────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────
    const [topic, setTopic] = useState('');
    const [location, setLocation] = useState('');
    const [mainCharacter, setMainCharacter] = useState('');
    const [mainCharacterTrait, setMainCharacterTrait] = useState('');
    const [supportingCharacters, setSupportingCharacters] = useState(['']);
    const [selectedTheme, setSelectedTheme] = useState('');
    const [selectedLength, setSelectedLength] = useState('');

    // Accordion states
    const [themeExpanded, setThemeExpanded] = useState(false);
    const [lengthExpanded, setLengthExpanded] = useState(false);
    const [supportingExpanded, setSupportingExpanded] = useState(false);

    // Premium state from Zustand
    const { isPremium, remainingUses, userData } = useUserStore();
    const { user } = useAuthStore();
    const usedFreeTrial = userData?.usedFreeTrial ?? true;
    const { t } = useTranslation();

    // Build localized names
    const THEMES = THEME_DATA.map(td => ({ ...td, name: t(`create.themes.${td.key}`) }));
    const LENGTHS = LENGTH_DATA.map(ld => ({ ...ld, name: t(`create.lengths.${ld.key}`) }));

    // ─────────────────────────────────────────────────────────
    // HANDLERS
    // ─────────────────────────────────────────────────────────
    /**
     * Kullanıcı erişim kontrolü
     * DiscoveryBox2'deki AnasayfaViewModel.checkUserAccess() mantığı
     */
    const checkUserAccess = (): boolean => {
        // Premium kullanıcılar ve hakkı olanlar geçebilir
        if (isPremium && remainingUses > 0) {
            return true;
        }

        // Premium değilse ama hakkı varsa geçebilir
        if (!isPremium && remainingUses > 0) {
            return true;
        }

        // İlk deneme hakkı
        if (!usedFreeTrial) {
            return true;
        }

        return false;
    };

    const handleGenerateStory = () => {
        // Validation
        if (!topic.trim() || !location.trim() || !mainCharacter.trim()) {
            Alert.alert(t('common.warning'), t('create.validation.fillFields'));
            return;
        }

        if (!selectedTheme) {
            Alert.alert(t('common.warning'), t('create.validation.selectTheme'));
            return;
        }

        if (!selectedLength) {
            Alert.alert(t('common.warning'), t('create.validation.selectLength'));
            return;
        }

        // Auth check
        if (!user) {
            Alert.alert(t('common.warning'), t('create.validation.loginRequired'));
            return;
        }

        // Premium/credit check — direkt Premium ekranına yönlendir
        const canCreate = checkUserAccess();
        if (!canCreate) {
            (navigation as any).navigate('ProfileTab', {
                screen: 'Premium',
                params: { source: 'create_story' },
            });
            return;
        }

        // Build prompt (DiscoveryBox2 Hikaye.kt'deki gibi)
        const supportingCharsText = supportingCharacters
            .filter((c) => c.trim())
            .join(', ');

        const themeName = THEMES.find(tm => tm.id === selectedTheme)?.name || selectedTheme;

        const prompt = `Bana bir çocuk hikayesi yaz. 
Konu: ${topic}, 
Mekan: ${location}, 
Ana karakter: ${mainCharacter} (${mainCharacterTrait || 'cesur'}), 
Yardımcı karakterler: ${supportingCharsText || 'yok'}, 
Tema: ${themeName}, 
Uzunluk: ${selectedLength}. 
ÖNEMLİ: Karakterlerin fiziksel görünümünü her sayfada tutarlı tut. Hikaye doğrudan başlasın.`;

        const generationParams: StoryGenerationParams = {
            prompt,
            length: selectedLength as 'short' | 'medium' | 'long',
            mainCharacter,
            location,
            theme: themeName,
            topic,
        };

        console.log('🚀 Starting story generation with params:', generationParams);

        // Navigate to StoryViewer with generation params
        navigation.navigate('StoryViewer', { generationParams });
    };

    const handleLengthPress = (lengthId: string) => {
        // Orta ve Uzun hikayeler premium gerektirir (hakkı yoksa)
        const isLocked = !isPremium && lengthId !== 'short';

        if (isLocked) {
            (navigation as any).navigate('ProfileTab', {
                screen: 'Premium',
                params: { source: 'create_story_length' },
            });
            return;
        }

        setSelectedLength(lengthId);
    };

    // ─────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <LinearGradient
                colors={['#003366', '#004080', '#0055AA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backButton}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <View style={styles.headerTitleRow}>
                            <Ionicons name="pencil-outline" size={scale(24)} color={colors.white} style={{ marginRight: scale(8) }} />
                            <Text style={styles.headerTitle}>{t('create.headerTitle')}</Text>
                        </View>
                        <Text style={styles.headerSubtitle}>{t('create.headerSubtitle')}</Text>
                    </View>
                    <View style={styles.headerRight} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}>
                    {/* Theme Section */}
                    <AccordionCard
                        title={t('create.themeTitle')}
                        subtitle={selectedTheme ? THEMES.find(tm => tm.id === selectedTheme)?.name || '' : t('create.themeSubtitle')}
                        icon="🎨"
                        expanded={themeExpanded}
                        onExpandChange={() => setThemeExpanded(!themeExpanded)}>
                        <View style={styles.themeGrid}>
                            <View style={styles.themeRow}>
                                {THEMES.slice(0, 2).map((theme) => (
                                    <View key={theme.id} style={styles.themeButtonWrapper}>
                                        <ThemeButton
                                            text={theme.name}
                                            icon={theme.icon}
                                            color={theme.color}
                                            selected={selectedTheme === theme.id}
                                            onPress={() => setSelectedTheme(theme.id)}
                                        />
                                    </View>
                                ))}
                            </View>
                            <View style={styles.themeRow}>
                                {THEMES.slice(2, 4).map((theme) => (
                                    <View key={theme.id} style={styles.themeButtonWrapper}>
                                        <ThemeButton
                                            text={theme.name}
                                            icon={theme.icon}
                                            color={theme.color}
                                            selected={selectedTheme === theme.id}
                                            onPress={() => setSelectedTheme(theme.id)}
                                        />
                                    </View>
                                ))}
                            </View>
                            <View style={styles.themeRow}>
                                <View style={styles.themeButtonWrapper}>
                                    <ThemeButton
                                        text={THEMES[4].name}
                                        icon={THEMES[4].icon}
                                        color={THEMES[4].color}
                                        selected={selectedTheme === THEMES[4].id}
                                        onPress={() => setSelectedTheme(THEMES[4].id)}
                                    />
                                </View>
                                <View style={styles.themeButtonWrapper}>
                                    <ThemeButton
                                        text={THEMES[5].name}
                                        icon={THEMES[5].icon}
                                        color={THEMES[5].color}
                                        selected={selectedTheme === THEMES[5].id}
                                        onPress={() => setSelectedTheme(THEMES[5].id)}
                                    />
                                </View>
                            </View>
                        </View>
                    </AccordionCard>

                    {/* Story Length Section */}
                    <AccordionCard
                        title={t('create.lengthTitle')}
                        subtitle={selectedLength ? LENGTHS.find(l => l.id === selectedLength)?.name || '' : t('create.lengthSubtitle')}
                        icon="📚"
                        expanded={lengthExpanded}
                        onExpandChange={() => setLengthExpanded(!lengthExpanded)}>
                        <View style={styles.lengthRow}>
                            {LENGTHS.map((length) => {
                                const isLocked = !isPremium && length.id !== 'short';
                                return (
                                    <View key={length.id} style={styles.lengthButtonWrapper}>
                                        <LockedThemeButton
                                            text={length.name}
                                            icon={length.icon}
                                            color={length.color}
                                            selected={selectedLength === length.id}
                                            isLocked={isLocked}
                                            onPress={() => handleLengthPress(length.id)}
                                        />
                                    </View>
                                );
                            })}
                        </View>
                    </AccordionCard>

                    {/* Topic */}
                    <InputCard
                        title={t('create.topicTitle')}
                        icon="💡"
                        placeholder={t('create.topicPlaceholder')}
                        value={topic}
                        onChangeText={setTopic}
                    />

                    {/* Main Character */}
                    <InputCard
                        title={t('create.mainCharacterTitle')}
                        icon="🦸"
                        placeholder={t('create.mainCharacterPlaceholder')}
                        value={mainCharacter}
                        onChangeText={setMainCharacter}
                    />

                    {/* Supporting Characters */}
                    <AccordionCard
                        title={t('create.supportingTitle')}
                        subtitle={t('create.supportingSubtitle')}
                        icon="👥"
                        expanded={supportingExpanded}
                        onExpandChange={() => setSupportingExpanded(!supportingExpanded)}>
                        <SupportingCharactersList
                            characters={supportingCharacters}
                            onCharactersChange={setSupportingCharacters}
                        />
                    </AccordionCard>

                    {/* Location */}
                    <InputCard
                        title={t('create.locationTitle')}
                        icon="📍"
                        placeholder={t('create.locationPlaceholder')}
                        value={location}
                        onChangeText={setLocation}
                    />

                    {/* Character Trait */}
                    <InputCard
                        title={t('create.traitTitle')}
                        icon="⭐"
                        placeholder={t('create.traitPlaceholder')}
                        value={mainCharacterTrait}
                        onChangeText={setMainCharacterTrait}
                    />

                    {/* Generate Button */}
                    <TouchableOpacity
                        style={styles.generateButton}
                        onPress={handleGenerateStory}
                        activeOpacity={0.8}>
                        <Ionicons name="pencil-outline" size={scale(24)} color={colors.premiumText} style={{ marginRight: scale(8) }} />
                        <Text style={styles.generateButtonText}>{t('create.generateButton')}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#003366',
    },
    gradient: {
        flex: 1,
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
        fontSize: fontSize.xxxl,
        color: colors.white,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    headerIcon: {
        fontSize: fontSize.xl,
    },
    headerTitle: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        color: colors.white,
    },
    headerSubtitle: {
        fontSize: fontSize.sm,
        color: colors.textLightAlpha,
        marginTop: verticalScale(2),
    },
    headerRight: {
        width: scale(40),
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
        gap: verticalScale(16),
        paddingBottom: verticalScale(32),
    },
    themeGrid: {
        gap: verticalScale(8),
    },
    themeRow: {
        flexDirection: 'row',
        gap: scale(8),
    },
    themeRowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    themeButtonWrapper: {
        flex: 1,
    },
    themeButtonWrapperHalf: {
        width: '50%',
    },
    lengthRow: {
        flexDirection: 'row',
        gap: scale(8),
    },
    lengthButtonWrapper: {
        flex: 1,
    },
    generateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.premium,
        borderRadius: 16,
        paddingVertical: verticalScale(16),
        gap: scale(8),
    },
    generateButtonIcon: {
        fontSize: fontSize.xl,
    },
    generateButtonText: {
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        color: '#6B46C1',
    },
});
