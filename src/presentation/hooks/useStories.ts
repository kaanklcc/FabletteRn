/**
 * ═══════════════════════════════════════════════════════════════
 * STORY HOOKS - CLEAN ARCHITECTURE
 * ═══════════════════════════════════════════════════════════════
 * 
 * TanStack Query hooks for story operations
 * 
 * Clean Architecture:
 * - Presentation layer hooks
 * - Use Case'leri kullanır (direkt repository değil)
 * - Dependency Injection pattern
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/zustand/useAuthStore';

// Use Cases
import { GetUserStoriesUseCase } from '@/domain/usecases/story/GetUserStoriesUseCase';
import { SaveStoryUseCase, SaveStoryParams } from '@/domain/usecases/story/SaveStoryUseCase';
import { DeleteStoryUseCase } from '@/domain/usecases/story/DeleteStoryUseCase';
import { GetStoryByIdUseCase } from '@/domain/usecases/story/GetStoryByIdUseCase';

// Repository Implementation
import { StoryRepositoryImpl } from '@/data/repositories/StoryRepositoryImpl';

// ─────────────────────────────────────────────────────────
// DEPENDENCY INJECTION
// ─────────────────────────────────────────────────────────
const storyRepository = new StoryRepositoryImpl();
const getUserStoriesUseCase = new GetUserStoriesUseCase(storyRepository);
const saveStoryUseCase = new SaveStoryUseCase(storyRepository);
const deleteStoryUseCase = new DeleteStoryUseCase(storyRepository);
const getStoryByIdUseCase = new GetStoryByIdUseCase(storyRepository);

// ─────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────

/**
 * Get all user stories
 * 
 * Clean Architecture:
 * - Hook → Use Case → Repository → Firebase
 */
export function useStories() {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ['stories', user?.uid],
        queryFn: () => getUserStoriesUseCase.invoke(user!.uid),
        enabled: !!user,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Save story
 * 
 * Clean Architecture:
 * - Hook → Use Case → Repository → Firebase
 */
export function useSaveStory() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: (params: SaveStoryParams) => saveStoryUseCase.invoke(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stories', user?.uid] });
        },
    });
}

/**
 * Delete story
 * 
 * Clean Architecture:
 * - Hook → Use Case → Repository → Firebase
 */
export function useDeleteStory() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: (storyId: string) => {
            if (!user) throw new Error('User not authenticated');
            return deleteStoryUseCase.invoke(user.uid, storyId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stories', user?.uid] });
        },
    });
}

/**
 * Get single story by ID
 * 
 * Clean Architecture:
 * - Hook → Use Case → Repository → Firebase
 */
export function useStory(storyId: string) {
    return useQuery({
        queryKey: ['story', storyId],
        queryFn: () => getStoryByIdUseCase.invoke(storyId),
        enabled: !!storyId,
    });
}
