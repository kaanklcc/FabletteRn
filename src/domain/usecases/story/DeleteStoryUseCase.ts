/**
 * ═══════════════════════════════════════════════════════════════
 * DELETE STORY USE CASE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Hikaye sil
 * 
 * Clean Architecture:
 * - Single Responsibility: Sadece hikaye silme işi
 * - Business Logic: Validasyon ve iş kuralları burada
 * - Repository'den bağımsız: Interface kullanır
 */

import { IStoryRepository } from '../../repositories/IStoryRepository';

export class DeleteStoryUseCase {
    constructor(private storyRepository: IStoryRepository) { }

    /**
     * Execute Use Case
     * 
     * @param userId - Kullanıcı ID
     * @param storyId - Silinecek hikaye ID
     * @returns Promise<void>
     * @throws Error - Validasyon hatası
     */
    async invoke(userId: string, storyId: string): Promise<void> {
        // Validasyon
        if (!userId || userId.trim().length === 0) {
            throw new Error('Kullanıcı ID gerekli');
        }

        if (!storyId || storyId.trim().length === 0) {
            throw new Error('Hikaye ID gerekli');
        }

        // Repository çağrısı
        await this.storyRepository.deleteStory(userId, storyId);
    }
}
