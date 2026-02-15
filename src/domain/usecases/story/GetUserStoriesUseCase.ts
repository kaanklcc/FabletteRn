/**
 * ═══════════════════════════════════════════════════════════════
 * GET USER STORIES USE CASE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Kullanıcının tüm hikayelerini getir
 * 
 * Clean Architecture:
 * - Single Responsibility: Sadece hikayeleri getirme işi
 * - Business Logic: Validasyon ve iş kuralları burada
 * - Repository'den bağımsız: Interface kullanır
 */

import { IStoryRepository } from '../../repositories/IStoryRepository';
import { Story } from '../../entities/Story';

export class GetUserStoriesUseCase {
    constructor(private storyRepository: IStoryRepository) { }

    /**
     * Execute Use Case
     * 
     * @param userId - Kullanıcı ID
     * @returns Promise<Story[]>
     * @throws Error - Validasyon hatası
     */
    async invoke(userId: string): Promise<Story[]> {
        // Validasyon
        if (!userId || userId.trim().length === 0) {
            throw new Error('Kullanıcı ID gerekli');
        }

        // Repository çağrısı
        return await this.storyRepository.getUserStories(userId);
    }
}
