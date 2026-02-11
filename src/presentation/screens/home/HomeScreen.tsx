/**
 * ═══════════════════════════════════════════════════════════════
 * HOME SCREEN
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 Anasayfa.kt'nin birebir kopyası
 * 
 * Özellikler:
 * - Gradient background
 * - SafeAreaView (notch/home indicator)
 * - ScrollView (vertical)
 * - Responsive design (iOS/Android/Tablet)
 * - Premium status
 * - Featured stories
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';

// Components
import Header from '../../components/home/Header';
import MascotSection from '../../components/home/MascotSection';
import CreateStoryCard from '../../components/home/CreateStoryCard';
import FeaturedStories from '../../components/home/FeaturedStories';

// Config
import { colors } from '@/config/theme';

type HomeScreenNavigationProp = NativeStackNavigationProp<
    HomeStackParamList,
    'Home'
>;

interface Props {
    navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
    // ─────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────
    const [isPremium] = useState(false); // TODO: Get from Zustand
    const [remainingPremiumUses] = useState(0); // TODO: Get from Firestore

    // ─────────────────────────────────────────────────────────
    // HANDLERS
    // ─────────────────────────────────────────────────────────
    const handlePremiumPress = () => {
        // TODO: Navigate to Premium screen
        console.log('Premium button pressed');
    };

    const handleCreateStoryPress = () => {
        // TODO: Navigate to CreateStory screen
        console.log('Create story pressed');
    };

    const handleStoryPress = (storyId: string) => {
        // TODO: Navigate to StoryViewer with storyId
        console.log('Story pressed:', storyId);
    };

    // ─────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <LinearGradient
                colors={colors.homeGradient as string[]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <Header
                        isPremium={isPremium}
                        remainingPremiumUses={remainingPremiumUses}
                        onPremiumPress={handlePremiumPress}
                    />

                    {/* Mascot Section */}
                    <MascotSection />

                    {/* Create Story Card */}
                    <CreateStoryCard onPress={handleCreateStoryPress} />

                    {/* Featured Stories */}
                    <FeaturedStories onStoryPress={handleStoryPress} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#003366', // Match gradient start
    },
    gradient: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
});
