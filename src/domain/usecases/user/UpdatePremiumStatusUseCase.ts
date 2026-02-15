/**
 * ═══════════════════════════════════════════════════════════════
 * UPDATE PREMIUM STATUS USE CASE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Premium durumunu güncelle
 * 
 * Clean Architecture:
 * - Single Responsibility: Sadece premium güncelleme işi
 * - Business Logic: Validasyon ve iş kuralları burada
 * - Repository'den bağımsız: Interface kullanır
 */

import { IUserRepository } from '../../repositories/IUserRepository';

export class UpdatePremiumStatusUseCase {
    constructor(private userRepository: IUserRepository) { }

    /**
     * Execute Use Case
     * 
     * @param userId - Kullanıcı ID
     * @param isPremium - Premium durumu
     * @param durationDays - Premium süresi (gün)
     * @returns Promise<void>
     * @throws Error - Validasyon hatası
     */
    async invoke(
        userId: string,
        isPremium: boolean,
        durationDays: number
    ): Promise<void> {
        // Validasyon
        if (!userId || userId.trim().length === 0) {
            throw new Error('Kullanıcı ID gerekli');
        }

        if (durationDays < 0) {
            throw new Error('Premium süresi negatif olamaz');
        }

        if (isPremium && durationDays === 0) {
            throw new Error('Premium aktifken süre 0 olamaz');
        }

        // Repository çağrısı
        await this.userRepository.updatePremiumStatus(
            userId,
            isPremium,
            durationDays
        );
    }
}
