/**
 * Auth Repository Implementation
 * 
 * IAuthRepository interface'ini implement eder.
 * Sadece anonymous auth desteklenir - email/Google kaldırıldı.
 */

import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { FirebaseAuthDataSource } from '../datasources/remote/FirebaseAuthDataSource';

export class AuthRepositoryImpl implements IAuthRepository {
    constructor(private authDataSource: FirebaseAuthDataSource) { }

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
