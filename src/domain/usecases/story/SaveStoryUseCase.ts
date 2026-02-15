/**
 * ═══════════════════════════════════════════════════════════════
 * SAVE STORY USE CASE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Yeni hikaye kaydet
 * 
 * Clean Architecture:
 * - Single Responsibility: Sadece hikaye kaydetme işi
 * - Business Logic: Validasyon ve iş kuralları burada
 * - Repository'den bağımsız: Interface kullanır
 */

import { IStoryRepository } from '../../repositories/IStoryRepository';
import { CreateStoryDTO } from '../../entities/Story';

export interface SaveStoryParams {
    userId: string;
    title: string;
    content: string;
    imageUrls?: string[];
}

export class SaveStoryUseCase {
    constructor(private storyRepository: IStoryRepository) { }

    /**
     * Execute Use Case
     * 
     * @param params - Hikaye bilgileri
     * @returns Promise<string> - Oluşturulan hikaye ID'si
     * @throws Error - Validasyon hatası
     */
    async invoke(params: SaveStoryParams): Promise<string> {
        // Validasyon
        if (!params.userId || params.userId.trim().length === 0) {
            throw new Error('Kullanıcı ID gerekli');
        }

        if (!params.title || params.title.trim().length === 0) {
            throw new Error('Hikaye başlığı gerekli');
        }

        if (!params.content || params.content.trim().length === 0) {
            throw new Error('Hikaye içeriği gerekli');
        }

        if (params.title.length > 100) {
            throw new Error('Başlık en fazla 100 karakter olabilir');
        }

        if (params.content.length > 10000) {
            throw new Error('İçerik en fazla 10000 karakter olabilir');
        }

        // CreateStoryDTO oluştur
        const storyDTO: CreateStoryDTO = {
            userId: params.userId,
            title: params.title.trim(),
            content: params.content.trim(),
            imageUrls: params.imageUrls || [],
        };

        // Repository çağrısı
        return await this.storyRepository.saveStory(storyDTO);
    }
}
