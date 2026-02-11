/**
 * ═══════════════════════════════════════════════════════════════
 * AUTH REPOSITORY IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════
 * 
 * IAuthRepository interface'ini implement eder.
 * FirebaseAuthDataSource'u kullanır.
 */

import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { FirebaseAuthDataSource } from '../datasources/remote/FirebaseAuthDataSource';

export class AuthRepositoryImpl implements IAuthRepository {
    constructor(private authDataSource: FirebaseAuthDataSource) { }

    async signInWithEmail(email: string, password: string): Promise<User> {
        return await this.authDataSource.signInWithEmail(email, password);
    }

    async signUpWithEmail(
        email: string,
        password: string,
        displayName?: string
    ): Promise<User> {
        return await this.authDataSource.signUpWithEmail(
            email,
            password,
            displayName || ''
        );
    }

    async signInWithGoogle(): Promise<User> {
        // TODO: Google Sign-In implementasyonu
        throw new Error('Google Sign-In henüz implement edilmedi');
    }

    async logout(): Promise<void> {
        await this.authDataSource.signOut();
    }

    async getCurrentUser(): Promise<User | null> {
        return this.authDataSource.getCurrentUser();
    }

    onAuthStateChanged(callback: (user: User | null) => void): () => void {
        return this.authDataSource.onAuthStateChanged(callback);
    }
}
