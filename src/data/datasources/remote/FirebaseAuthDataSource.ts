/**
 * ═══════════════════════════════════════════════════════════════
 * FIREBASE AUTH DATA SOURCE
 * ═══════════════════════════════════════════════════════════════
 * 
 * 🎯 NE İŞE YARAR?
 * 
 * Firebase Authentication işlemlerini yapar.
 * 
 * Clean Architecture'da DataSource = Veri kaynağı ile direkt iletişim.
 * 
 * ═══════════════════════════════════════════════════════════════
 * KOTLIN KARŞILAŞTIRMASI
 * ═══════════════════════════════════════════════════════════════
 * 
 * Kotlin'de (DiscoveryBox2):
 * DiscoveryBoxDataSource.signInWithEmail() direkt Firebase çağrısı
 * 
 * Clean Architecture'da:
 * FirebaseAuthDataSource → Firebase işlemleri
 * AuthRepositoryImpl → DataSource'u kullanır
 * Use Case → Repository'yi kullanır
 */

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    User as FirebaseUser,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { User } from '../../../domain/entities/User';

/**
 * Firebase Auth Data Source
 * 
 * Firebase SDK ile direkt iletişim kurar.
 */
export class FirebaseAuthDataSource {
    /**
     * Email ile giriş yap
     * 
     * @param email - Kullanıcı email
     * @param password - Kullanıcı şifresi
     * @returns User entity
     * 
     * Kotlin karşılığı:
     * Firebase.auth.signInWithEmailAndPassword(email, password)
     *   .addOnSuccessListener { result -> onResult(result.user) }
     */
    async signInWithEmail(email: string, password: string): Promise<User> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return this.mapFirebaseUserToEntity(userCredential.user);
        } catch (error: any) {
            // Firebase error kodlarını kullanıcı dostu mesajlara çevir
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    /**
     * Email ile kayıt ol
     * 
     * @param email - Kullanıcı email
     * @param password - Kullanıcı şifresi
     * @param displayName - Kullanıcı adı
     * @returns User entity
     */
    async signUpWithEmail(
        email: string,
        password: string,
        displayName: string
    ): Promise<User> {
        try {
            // 1. Firebase'de kullanıcı oluştur
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // 2. Display name güncelle
            await updateProfile(userCredential.user, { displayName });

            // 3. User entity döndür
            return this.mapFirebaseUserToEntity(userCredential.user);
        } catch (error: any) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    /**
     * Çıkış yap
     */
    async signOut(): Promise<void> {
        try {
            await signOut(auth);
        } catch (error: any) {
            throw new Error('Çıkış yapılırken bir hata oluştu');
        }
    }

    /**
     * Mevcut kullanıcıyı getir
     */
    getCurrentUser(): User | null {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return null;
        return this.mapFirebaseUserToEntity(firebaseUser);
    }

    /**
     * Auth state değişikliklerini dinle
     * 
     * @param callback - User değiştiğinde çağrılacak fonksiyon
     * @returns Unsubscribe fonksiyonu
     */
    onAuthStateChanged(callback: (user: User | null) => void): () => void {
        return onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                callback(this.mapFirebaseUserToEntity(firebaseUser));
            } else {
                callback(null);
            }
        });
    }

    /**
     * Firebase User → Domain User Entity
     * 
     * Firebase'den gelen user objesini domain entity'ye çevirir.
     * 
     * Kotlin karşılığı:
     * fun FirebaseUser.toUser(): User {
     *   return User(uid = uid, email = email ?: "", ...)
     * }
     */
    private mapFirebaseUserToEntity(firebaseUser: FirebaseUser): User {
        return {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            emailVerified: firebaseUser.emailVerified,
        };
    }

    /**
     * Firebase error kodlarını kullanıcı dostu mesajlara çevir
     */
    private getErrorMessage(errorCode: string): string {
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'Geçersiz email adresi';
            case 'auth/user-disabled':
                return 'Bu hesap devre dışı bırakılmış';
            case 'auth/user-not-found':
                return 'Kullanıcı bulunamadı';
            case 'auth/wrong-password':
                return 'Hatalı şifre';
            case 'auth/email-already-in-use':
                return 'Bu email adresi zaten kullanılıyor';
            case 'auth/weak-password':
                return 'Şifre çok zayıf';
            case 'auth/network-request-failed':
                return 'İnternet bağlantısı yok';
            default:
                return 'Bir hata oluştu. Lütfen tekrar deneyin.';
        }
    }
}
