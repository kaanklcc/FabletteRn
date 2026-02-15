/**
 * ═══════════════════════════════════════════════════════════════
 * FEATURED STORY REPOSITORY INTERFACE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Domain layer interface - Framework bağımsız
 */

import { FeaturedStory } from '../entities/FeaturedStory';

export interface IFeaturedStoryRepository {
    /** Tüm aktif featured hikayeleri getir (order'a göre sıralı) */
    getFeaturedStories(): Promise<FeaturedStory[]>;

    /** ID ile tek bir featured hikaye getir */
    getFeaturedStoryById(storyId: string): Promise<FeaturedStory | null>;
}
