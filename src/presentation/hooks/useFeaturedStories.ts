/**
 * ═══════════════════════════════════════════════════════════════
 * USE FEATURED STORIES HOOK
 * ═══════════════════════════════════════════════════════════════
 * 
 * TanStack Query hook - Firebase'den featured stories çeker
 */

import { useQuery } from '@tanstack/react-query';
import { FeaturedStory } from '@/domain/entities/FeaturedStory';
import { FeaturedStoryRepositoryImpl } from '@/data/repositories/FeaturedStoryRepositoryImpl';
import { GetFeaturedStoriesUseCase } from '@/domain/usecases/story/GetFeaturedStoriesUseCase';

const repository = new FeaturedStoryRepositoryImpl();
const useCase = new GetFeaturedStoriesUseCase(repository);

/** Tüm aktif featured hikayeleri getir */
export function useFeaturedStories() {
    return useQuery<FeaturedStory[], Error>({
        queryKey: ['featuredStories'],
        queryFn: () => useCase.execute(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
    });
}

/** Tek bir featured hikaye getir (ID ile) */
export function useFeaturedStory(storyId: string) {
    return useQuery<FeaturedStory | null, Error>({
        queryKey: ['featuredStory', storyId],
        queryFn: () => repository.getFeaturedStoryById(storyId),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: !!storyId,
    });
}
