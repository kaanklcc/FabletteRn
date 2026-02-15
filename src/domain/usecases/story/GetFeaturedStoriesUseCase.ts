/**
 * ═══════════════════════════════════════════════════════════════
 * GET FEATURED STORIES USE CASE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Business Logic: Aktif featured hikayeleri getir
 * 
 * Clean Architecture:
 * - Domain layer (framework bağımsız)
 * - Repository interface kullanır (dependency injection)
 */

import { FeaturedStory } from '@/domain/entities/FeaturedStory';
import { IFeaturedStoryRepository } from '@/domain/repositories/IFeaturedStoryRepository';

export class GetFeaturedStoriesUseCase {
    constructor(private repository: IFeaturedStoryRepository) {}

    async execute(): Promise<FeaturedStory[]> {
        return await this.repository.getFeaturedStories();
    }
}
