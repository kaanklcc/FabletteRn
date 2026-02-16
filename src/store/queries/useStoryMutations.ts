/**
 * ═══════════════════════════════════════════════════════════════
 * STORY MUTATIONS (TanStack Query)
 * ═══════════════════════════════════════════════════════════════
 * 
 * Hikaye kaydetme ve silme gibi API çağrıları için TanStack Query mutations.
 * 
 * Hikaye oluşturma akışı useStoryGeneration hook'unda yönetilir.
 * Bu dosya sadece CRUD operasyonları için kullanılır.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Story, CreateStoryDTO } from '../../domain/entities/Story';
import { StoryRepositoryImpl } from '../../data/repositories/StoryRepositoryImpl';
import { storyKeys } from './queryKeys';

const storyRepository = new StoryRepositoryImpl();

/**
 * Save Story Params
 */
interface SaveStoryParams {
    userId: string;
    title: string;
    content: string;
    imageUrls: string[];
}

/**
 * useSaveStory - Hikayeyi Firestore'a kaydet
 */
export const useSaveStory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: SaveStoryParams): Promise<string> => {
            const dto: CreateStoryDTO = {
                userId: params.userId,
                title: params.title,
                content: params.content,
                imageUrls: params.imageUrls,
            };
            return await storyRepository.saveStory(dto);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: storyKeys.lists() });
        },

        onError: (error) => {
            console.error('Hikaye kaydetme hatası:', error);
        },

        retry: 2,
    });
};

/**
 * useDeleteStory - Hikayeyi sil
 */
export const useDeleteStory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, storyId }: { userId: string; storyId: string }) => {
            await storyRepository.deleteStory(userId, storyId);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: storyKeys.lists() });
        },

        onError: (error) => {
            console.error('Hikaye silme hatası:', error);
        },

        retry: 1,
    });
};
