/**
 * ═══════════════════════════════════════════════════════════════
 * GET USER DATA USE CASE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Kullanıcı verilerini getir
 * 
 * Clean Architecture:
 * - Single Responsibility: Sadece kullanıcı verisi getirme işi
 * - Business Logic: Validasyon ve iş kuralları burada
 * - Repository'den bağımsız: Interface kullanır
 */

import { IUserRepository } from '../../repositories/IUserRepository';
import { User } from '../../entities/User';

export class GetUserDataUseCase {
    constructor(private userRepository: IUserRepository) { }

    /**
     * Execute Use Case
     * 
     * @param userId - Kullanıcı ID
     * @returns Promise<User | null>
     * @throws Error - Validasyon hatası
     */
    async invoke(userId: string): Promise<User | null> {
        // Validasyon
        if (!userId || userId.trim().length === 0) {
            throw new Error('Kullanıcı ID gerekli');
        }

        // Repository çağrısı
        return await this.userRepository.getUserData(userId);
    }
}
