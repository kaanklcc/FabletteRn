/**
 * AuthNavigator - Giriş yapmamış kullanıcılar için
 * 
 * DiscoveryBox2'de sadece GirisSayfa var.
 * Onboarding ve Register ekranı yok.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false,
            }}>
            {/* Sadece Login Screen - DiscoveryBox2 gibi */}
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    );
}
