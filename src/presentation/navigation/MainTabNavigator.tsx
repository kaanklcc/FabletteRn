/**
 * MainTabNavigator - Alt menü (Bottom Tabs) navigator
 * 
 * Kotlin karşılığı: CommonBottomBar.kt
 * 
 * 🎓 Bottom Tab Navigator Açıklaması:
 * 
 * Bottom Tab Navigator = Alt menü bar ile ekranlar arası geçiş
 * - Her tab kendi stack navigator'ına sahip olabilir
 * - Kullanıcı tab'lar arasında geçiş yaparken state korunur
 * - Material Design ve iOS Human Interface Guidelines'a uygun
 * 
 * DiscoveryBox2'deki CommonBottomBar.kt ile aynı mantık:
 * - 4 tab: Home, Create, Saved, Profile
 * - Her tab'ın ikonu ve rengi var
 * - Seçili tab vurgulanır
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    MainTabParamList,
    HomeStackParamList,
    CreateStackParamList,
    SavedStackParamList,
    ProfileStackParamList,
} from './types';
import { colors } from '@/config/theme';

// React Native'de icon'lar için Ionicons kullanılır (Expo ile gelir)
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import CreateStoryScreen from '../screens/create/CreateStoryScreen';
import StoryViewerScreen from '../screens/story/StoryViewerScreen';
import SavedStoriesScreen from '../screens/saved/SavedStoriesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import PremiumScreen from '../screens/premium/PremiumScreen';

/**
 * Her tab için ayrı Stack Navigator oluşturuyoruz
 * 
 * Neden?
 * - Her tab kendi navigation history'sine sahip olmalı
 * - Örnek: Create tab'ında CreateStory → StoryViewer geçişi
 * - Home tab'ına geçip geri dönünce StoryViewer hala orada olmalı
 */

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const CreateStack = createNativeStackNavigator<CreateStackParamList>();
const SavedStack = createNativeStackNavigator<SavedStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

/**
 * Home Tab Stack Navigator
 */
function HomeTabNavigator() {
    return (
        <HomeStack.Navigator
            screenOptions={{ headerShown: false }} // Home tab'ında header yok, diğer ekranlarda olabilir
        >
            <HomeStack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Ana Sayfa' }}
               
            />
        </HomeStack.Navigator>
    );
}

/**
 * Create Tab Stack Navigator
 * 
 * Bu stack 2 ekran içerir:
 * - CreateStory (ana ekran)
 * - StoryViewer (hikaye görüntüleme)
 */
function CreateTabNavigator() {
    return (
        <CreateStack.Navigator
            screenOptions={{ headerShown: false }} // Home tab'ında header yok, diğer ekranlarda olabilir
        >
            <CreateStack.Screen
                name="CreateStory"
                component={CreateStoryScreen}
                options={{ title: 'Hikaye Oluştur' }}
            />
            <CreateStack.Screen
                name="StoryViewer"
                component={StoryViewerScreen}
                options={{ title: 'Hikaye' }}
            />
        </CreateStack.Navigator>
    );
}

/**
 * Saved Tab Stack Navigator
 */
function SavedTabNavigator() {
    return (
        <SavedStack.Navigator>
            <SavedStack.Screen
                name="SavedStories"
                component={SavedStoriesScreen}
                options={{ title: 'Kaydedilenler' }}
            />
        </SavedStack.Navigator>
    );
}

/**
 * Profile Tab Stack Navigator
 * 
 * Bu stack 2 ekran içerir:
 * - Profile (ana ekran)
 * - Premium (premium abonelik)
 */
function ProfileTabNavigator() {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profil' }}
            />
            <ProfileStack.Screen
                name="Premium"
                component={PremiumScreen}
                options={{ title: 'Premium' }}
            />
        </ProfileStack.Navigator>
    );
}

/**
 * Bottom Tab Navigator
 */
const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                /**
                 * Tab bar stili
                 * 
                 * Kotlin karşılığı:
                 * NavigationBar(containerColor = Color(0xFF003366))
                 */
                tabBarStyle: {
                    backgroundColor: colors.primary,
                    borderTopWidth: 0,
                    elevation: 0,
                },

                /**
                 * Tab bar label stili
                 */
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '500',
                },

                /**
                 * Aktif tab rengi
                 * 
                 * Kotlin karşılığı:
                 * selectedIconColor = Color(0xFFFCD34D)
                 */
                tabBarActiveTintColor: colors.accent,

                /**
                 * İnaktif tab rengi
                 */
                tabBarInactiveTintColor: colors.white,

                /**
                 * Header'ı gizle (her tab kendi header'ını gösterir)
                 */
                headerShown: false,
            }}
        >
            {/**
       * Home Tab
       * 
       * Kotlin karşılığı:
       * NavigationBarItem(
       *   icon = { Icon(Icons.Default.Home, ...) },
       *   label = { Text("Home") }
       * )
       */}
            <Tab.Screen
                name="HomeTab"
                component={HomeTabNavigator}
                options={{
                    title: 'Ana Sayfa',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />

            {/**
       * Create Tab
       */}
            <Tab.Screen
                name="CreateTab"
                component={CreateTabNavigator}
                options={{
                    title: 'Oluştur',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="create" size={size} color={color} />
                    ),
                }}
            />

            {/**
       * Saved Tab
       */}
            <Tab.Screen
                name="SavedTab"
                component={SavedTabNavigator}
                options={{
                    title: 'Kaydedilenler',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="heart" size={size} color={color} />
                    ),
                }}
            />

            {/**
       * Profile Tab
       * 
       * Kotlin'de Profile tab'ı farklı renk kullanıyor (#22D3EE)
       * Ama Bottom Tab Navigator'da tab bazlı renk değişimi zor
       * Şimdilik hepsi aynı renk, gerekirse özelleştirilebilir
       */}
            <Tab.Screen
                name="ProfileTab"
                component={ProfileTabNavigator}
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
