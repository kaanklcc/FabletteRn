/**
 * ═══════════════════════════════════════════════════════════════
 * SAVED STORIES SCREEN
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 SaveSayfa.kt'nin birebir kopyası
 * 
 * Özellikler:
 * - Saved stories list
 * - Swipe-to-delete
 * - Story count header
 * - Empty state
 * - Navigation to StoryViewer
 */

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SavedStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Components
import SavedStoryCard from '../../components/saved/SavedStoryCard';
import EmptyStoriesState from '../../components/saved/EmptyStoriesState';

// Hooks
import { useStories, useDeleteStory } from '@/presentation/hooks/useStories';

// Config
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';
import { useTranslation } from 'react-i18next';

type SavedStoriesScreenNavigationProp = NativeStackNavigationProp<
    SavedStackParamList,
    'SavedStories'
>;

interface Props {
    navigation: SavedStoriesScreenNavigationProp;
}

export default function SavedStoriesScreen({ navigation }: Props) {
    // ─────────────────────────────────────────────────────────
    // FIRESTORE DATA
    // ─────────────────────────────────────────────────────────
    const { data: stories = [], isLoading, error } = useStories();
    const deleteStory = useDeleteStory();
    const { t } = useTranslation();

    // ─────────────────────────────────────────────────────────
    // HANDLERS
    // ─────────────────────────────────────────────────────────
    const handleStoryPress = (storyId: string) => {
        navigation.navigate('StoryViewer', { storyId, source: 'saved' });
    };

    const handleDeleteStory = (storyId: string) => {
        Alert.alert(
            t('saved.deleteTitle'),
            t('saved.deleteMessage'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: () => {
                        deleteStory.mutate(storyId, {
                            onError: (error) => {
                                Alert.alert(t('common.error'), t('saved.deleteError'));
                                console.error('Delete error:', error);
                            },
                        });
                    },
                },
            ]
        );
    };

    const handleCreateStory = () => {
        (navigation as any).navigate('CreateTab', {
            screen: 'CreateStory',
        });
    };

    // ─────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────
    return (
        <GestureHandlerRootView style={styles.gestureRoot}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <LinearGradient
                    colors={['#003366', '#004080', '#0055AA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.headerRow}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={styles.backButton}>
                                <Ionicons
                                    name="arrow-back"
                                    size={scale(24)}
                                    color={colors.white}
                                />
                            </TouchableOpacity>
                            <View style={styles.titleContainer}>
                                <View style={styles.titleRow}>
                                    <Ionicons
                                        name="star"
                                        size={scale(24)}
                                        color={colors.white}
                                    />
                                    <Text style={styles.headerTitle}>{t('saved.title')}</Text>
                                </View>
                                <Text style={styles.headerSubtitle}>
                                    {t('saved.storySaved', { count: stories.length })}
                                </Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Story List */}
                <LinearGradient
                    colors={['#F3E8FF', '#FFFFFF']}
                    style={styles.gradient}>
                    {isLoading ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={styles.loadingText}>{t('saved.loading')}</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.centerContainer}>
                            <Ionicons name="alert-circle" size={scale(48)} color={colors.error} />
                            <Text style={styles.errorText}>{t('saved.errorTitle')}</Text>
                            <Text style={styles.errorSubtext}>{t('saved.errorSubtitle')}</Text>
                        </View>
                    ) : stories.length === 0 ? (
                        <EmptyStoriesState onCreateStory={handleCreateStory} />
                    ) : (
                        <FlatList
                            data={stories}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <SavedStoryCard
                                    story={{
                                        id: item.id,
                                        title: item.title,
                                        imageUrl: item.imageUrls?.[0] || item.imageUrl || 'https://picsum.photos/400/480',
                                        createdAt: item.timestamp,
                                    }}
                                    onPress={() => handleStoryPress(item.id)}
                                    onDelete={handleDeleteStory}
                                />
                            )}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </LinearGradient>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    gestureRoot: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#003366',
    },
    header: {
        paddingTop: verticalScale(12),
        paddingBottom: verticalScale(12),
        paddingHorizontal: spacing.md,
    },
    headerContent: {
        // No extra gap needed
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(4),
    },
    backButton: {
        marginRight: scale(8),
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    headerTitle: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        color: colors.white,
    },
    headerSubtitle: {
        fontSize: fontSize.sm,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: verticalScale(2),
    },
    gradient: {
        flex: 1,
    },
    listContent: {
        padding: spacing.md,
        gap: verticalScale(16),
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    loadingText: {
        marginTop: verticalScale(16),
        fontSize: fontSize.md,
        color: colors.gray,
    },
    errorText: {
        marginTop: verticalScale(16),
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: colors.error,
    },
    errorSubtext: {
        marginTop: verticalScale(8),
        fontSize: fontSize.sm,
        color: colors.gray,
    },
});
