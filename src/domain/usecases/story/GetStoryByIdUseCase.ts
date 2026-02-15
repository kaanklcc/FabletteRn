/**
 * ═══════════════════════════════════════════════════════════════
 * GET STORY BY ID USE CASE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Tek bir hikayeyi ID ile getir
 * 
 * Clean Architecture:
 * - Single Responsibility: Sadece hikaye getirme işi
 * - Business Logic: Validasyon ve iş kuralları burada
 * - Repository'den bağımsız: Interface kullanır
 */

import { IStoryRepository } from '../../repositories/IStoryRepository';
import { Story } from '../../entities/Story';

export class GetStoryByIdUseCase {
    constructor(private storyRepository: IStoryRepository) { }

    /**
     * Execute Use Case
     * 
     * @param storyId - Hikaye ID
     * @returns Promise<Story | null>
     * @throws Error - Validasyon hatası
     */
    async invoke(storyId: string): Promise<Story | null> {
        // Validasyon
        if (!storyId || storyId.trim().length === 0) {
            throw new Error('Hikaye ID gerekli');
        }

        // Repository çağrısı
        const story = await this.storyRepository.getStoryById(storyId);

        // İş mantığı: Hikaye bulunamadıysa null dön
        if (!story) {
            return null;
        }

        return story;
    }
}
