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

// Store
import { useUserStore } from '@/store/zustand/useUserStore';
import { useAuthStore } from '@/store/zustand/useAuthStore';

// Config
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';

type CreateStoryScreenNavigationProp = NativeStackNavigationProp<
    CreateStackParamList,
    'CreateStory'
>;

interface Props {
    navigation: CreateStoryScreenNavigationProp;
}

// Themes
const THEMES = [
    { id: 'adventure', name: 'Macera', icon: '🚀', color: '#EC4899' },
    { id: 'love', name: 'Aşk', icon: '💖', color: '#06B6D4' },
    { id: 'friendship', name: 'Dostluk', icon: '🧑‍🤝‍🧑', color: '#10B981' },
    { id: 'family', name: 'Aile', icon: '🏡', color: '#0055AA' },
    { id: 'action', name: 'Aksiyon', icon: '⚡', color: '#F59E0B' },
];

// Story Lengths
const LENGTHS = [
    { id: 'short', name: 'Kısa', icon: '📄', color: '#EC4899' },
    { id: 'medium', name: 'Orta', icon: '📕', color: '#0055AA' },
    { id: 'long', name: 'Uzun', icon: '📚', color: '#06B6D4' },
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
            Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun');
            return;
        }

        if (!selectedTheme) {
            Alert.alert('Uyarı', 'Lütfen bir tema seçin');
            return;
        }

        if (!selectedLength) {
            Alert.alert('Uyarı', 'Lütfen hikaye uzunluğu seçin');
            return;
        }

        // Auth check
        if (!user) {
            Alert.alert('Uyarı', 'Giriş yapmanız gerekiyor');
            return;
        }

        // Premium/credit check
        const canCreate = checkUserAccess();
        if (!canCreate) {
            Alert.alert(
                'Hikaye Hakkınız Bitti',
                'Hikaye oluşturmak için premium satın alın veya reklam izleyin.',
                [
                    { text: 'İptal', style: 'cancel' },
                    {
                        text: 'Premium Al',
                        onPress: () => {
                            // ProfileTab > Premium'a navigate et
                            (navigation as any).navigate('ProfileTab', {
                                screen: 'Premium',
                                params: { source: 'create_story' },
                            });
                        },
                    },
                ]
            );
            return;
        }

        // Build prompt (DiscoveryBox2 Hikaye.kt'deki gibi)
        const supportingCharsText = supportingCharacters
            .filter((c) => c.trim())
            .join(', ');

        const themeName = THEMES.find(t => t.id === selectedTheme)?.name || selectedTheme;

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
            Alert.alert(
                'Premium Gerekli',
                'Bu uzunluk için premium üyelik gereklidir',
                [
                    { text: 'İptal', style: 'cancel' },
                    {
                        text: 'Premium Al',
                        onPress: () => {
                            (navigation as any).navigate('ProfileTab', {
                                screen: 'Premium',
                                params: { source: 'create_story_length' },
                            });
                        },
                    },
                ]
            );
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
                            <Text style={styles.headerIcon}>✏️</Text>
                            <Text style={styles.headerTitle}>Hikayeni Oluştur</Text>
                        </View>
                        <Text style={styles.headerSubtitle}>Hayal gücün yaşasın</Text>
                    </View>
                    <View style={styles.headerRight} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}>
                    {/* Theme Section */}
                    <AccordionCard
                        title="Tema"
                        subtitle={selectedTheme || 'Tema seç'}
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
                            <View style={styles.themeRowCenter}>
                                <View style={styles.themeButtonWrapperHalf}>
                                    <ThemeButton
                                        text={THEMES[4].name}
                                        icon={THEMES[4].icon}
                                        color={THEMES[4].color}
                                        selected={selectedTheme === THEMES[4].id}
                                        onPress={() => setSelectedTheme(THEMES[4].id)}
                                    />
                                </View>
                            </View>
                        </View>
                    </AccordionCard>

                    {/* Story Length Section */}
                    <AccordionCard
                        title="Hikaye Uzunluğu"
                        subtitle={selectedLength || 'Uzunluk seç'}
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
                        title="Konu"
                        icon="💡"
                        placeholder="Örn: Uzay macerası"
                        value={topic}
                        onChangeText={setTopic}
                    />

                    {/* Main Character */}
                    <InputCard
                        title="Ana Karakter"
                        icon="🦸"
                        placeholder="Örn: Cesur bir astronot"
                        value={mainCharacter}
                        onChangeText={setMainCharacter}
                    />

                    {/* Supporting Characters */}
                    <AccordionCard
                        title="Yardımcı Karakterler"
                        subtitle="Karakter ekle"
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
                        title="Mekan"
                        icon="📍"
                        placeholder="Örn: Uzak bir galaksi"
                        value={location}
                        onChangeText={setLocation}
                    />

                    {/* Character Trait */}
                    <InputCard
                        title="Ana Karakter Özelliği"
                        icon="⭐"
                        placeholder="Örn: Cesur ve meraklı"
                        value={mainCharacterTrait}
                        onChangeText={setMainCharacterTrait}
                    />

                    {/* Generate Button */}
                    <TouchableOpacity
                        style={styles.generateButton}
                        onPress={handleGenerateStory}
                        activeOpacity={0.8}>
                        <Text style={styles.generateButtonIcon}>✏️</Text>
                        <Text style={styles.generateButtonText}>Hikayeyi Oluştur</Text>
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
