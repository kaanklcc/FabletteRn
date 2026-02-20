/**
 * Firebase Auth Data Source
 * 
 * Firebase Authentication işlemlerini yapar.
 * Sadece anonymous auth desteklenir - email/Google kaldırıldı.
 */

import {
    signOut,
    User as FirebaseUser,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { User } from '../../../domain/entities/User';

export class FirebaseAuthDataSource {
    async signOut(): Promise<void> {
        try {
            await signOut(auth);
        } catch (error: any) {
            throw new Error('Çıkış yapılırken bir hata oluştu');
        }
    }

    getCurrentUser(): User | null {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return null;
        return this.mapFirebaseUserToEntity(firebaseUser);
    }

    onAuthStateChanged(callback: (user: User | null) => void): () => void {
        return onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                callback(this.mapFirebaseUserToEntity(firebaseUser));
            } else {
                callback(null);
            }
        });
    }

    private mapFirebaseUserToEntity(firebaseUser: FirebaseUser): User {
        const displayName = firebaseUser.displayName || '';
        const [firstName = '', ...lastNameParts] = displayName.split(' ');
        const lastName = lastNameParts.join(' ');

        return {
            uid: firebaseUser.uid,
            firstName,
            lastName,
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || undefined,
            emailVerified: firebaseUser.emailVerified,
            usedFreeTrial: false,
            isPremium: false,
            remainingCredits: 0,
            premiumStartDate: null,
            premiumDurationDays: 0,
        };
    }
}
