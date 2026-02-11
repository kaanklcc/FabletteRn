/**
 * ═══════════════════════════════════════════════════════════════
 * REGISTER WITH EMAIL USE CASE
 * ═══════════════════════════════════════════════════════════════
 */

import { IAuthRepository } from '../../repositories/IAuthRepository';
import { User } from '../../entities/User';

export class RegisterWithEmailUseCase {
    constructor(private authRepository: IAuthRepository) { }

    async invoke(
        email: string,
        password: string,
        displayName: string
    ): Promise<User> {
        // Validasyon
        if (!email || !email.trim()) {
            throw new Error('Email adresi gerekli');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Geçersiz email formatı');
        }

        if (!password || password.length < 6) {
            throw new Error('Şifre en az 6 karakter olmalı');
        }

        if (!displayName || !displayName.trim()) {
            throw new Error('İsim gerekli');
        }

        // Repository çağrısı
        return await this.authRepository.signUpWithEmail(email, password, displayName);
    }
}
