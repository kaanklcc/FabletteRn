/**
 * ═══════════════════════════════════════════════════════════════
 * GOOGLE SIGN-IN HOOK (EXPO GO COMPATIBLE)
 * ═══════════════════════════════════════════════════════════════
 * 
 * Uses expo-auth-session for Expo Go compatibility
 * Opens browser for Google authentication
 * 
 * SETUP REQUIRED:
 * 1. Go to Google Cloud Console → APIs & Services → Credentials
 * 2. Create a new OAuth 2.0 Client ID (type: iOS)
 * 3. Set Bundle ID to: host.exp.exponent (for Expo Go)
 * 4. Copy the Client ID and paste below as iosClientId
 */

import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Complete auth session when returning from browser
WebBrowser.maybeCompleteAuthSession();

/**
 * Google Sign-In Hook
 * 
 * Returns:
 * - promptAsync: Function to trigger Google Sign-In
 * - loading: Boolean indicating if sign-in is in progress
 * - error: Error message if sign-in fails
 */
export function useGoogleSignIn() {
    const [signInLoading, setSignInLoading] = useState(false);
    const [signInError, setSignInError] = useState<string | null>(null);

    // Configure Google OAuth
    const [request, response, promptAsync] = Google.useAuthRequest({
        // Web Client ID from Firebase Console (google-services.json - client_type: 3)
        webClientId: '430097357601-b2t3af3hhj9upgqf81sdfdu0mpshfgtf.apps.googleusercontent.com',

        // iOS Client ID - MUST be created in Google Cloud Console
        // Go to: https://console.cloud.google.com/apis/credentials
        // Create OAuth 2.0 Client ID → iOS → Bundle ID: host.exp.exponent
        iosClientId: '430097357601-ftc1rgqa4o5j6nhb0g7kd17slmhbprbj.apps.googleusercontent.com',

        // Android Client ID from google-services.json (client_type: 1)
        androidClientId: '430097357601-1ho7ncohle2nq8q954c0kbao1e2v92dh.apps.googleusercontent.com',
    });

    // Handle authentication response
    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            handleFirebaseSignIn(id_token);
        } else if (response?.type === 'error') {
            setSignInError(response.error?.message || 'Google Sign-In failed');
            setSignInLoading(false);
        }
    }, [response]);

    /**
     * Sign in to Firebase with Google ID token
     */
    const handleFirebaseSignIn = async (idToken: string) => {
        try {
            setSignInLoading(true);
            setSignInError(null);

            // Create Firebase credential from Google ID token
            const credential = GoogleAuthProvider.credential(idToken);

            // Sign in to Firebase
            const userCredential = await signInWithCredential(auth, credential);
            const user = userCredential.user;

            // Check if user document exists in Firestore
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            // Create user document if it doesn't exist (new user)
            if (!userDoc.exists()) {
                const displayName = user.displayName || '';
                const [firstName = '', ...lastNameParts] = displayName.split(' ');
                const lastName = lastNameParts.join(' ');

                await setDoc(userRef, {
                    ad: firstName,
                    soyad: lastName,
                    email: user.email || '',
                    usedFreeTrial: true,
                    premium: false,
                    remainingChatgptUses: 0,
                    premiumStartDate: null,
                    premiumDurationDays: 0,
                });
            }

            console.log('✅ Google Sign-In successful:', user.email);
        } catch (error: any) {
            console.error('❌ Google Sign-In error:', error);
            setSignInError(error.message || 'Firebase sign-in failed');
        } finally {
            setSignInLoading(false);
        }
    };

    return {
        promptAsync,
        loading: !request || signInLoading,
        error: signInError,
    };
}
