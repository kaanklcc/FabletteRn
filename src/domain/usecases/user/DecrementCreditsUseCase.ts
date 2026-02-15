/**
 * ═══════════════════════════════════════════════════════════════
 * DECREMENT CREDITS USE CASE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Hikaye hakkını azalt
 * 
 * Clean Architecture:
 * - Single Responsibility: Sadece kredi azaltma işi
 * - Business Logic: Validasyon ve iş kuralları burada
 * - Repository'den bağımsız: Interface kullanır
 */

import { IUserRepository } from '../../repositories/IUserRepository';

export class DecrementCreditsUseCase {
    constructor(private userRepository: IUserRepository) { }

    /**
     * Execute Use Case
     * 
     * @param userId - Kullanıcı ID
     * @returns Promise<void>
     * @throws Error - Validasyon hatası
     */
    async invoke(userId: string): Promise<void> {
        // Validasyon
        if (!userId || userId.trim().length === 0) {
            throw new Error('Kullanıcı ID gerekli');
        }

        // Repository çağrısı
        await this.userRepository.decrementCredits(userId);
    }
}
