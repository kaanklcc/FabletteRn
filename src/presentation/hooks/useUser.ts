/**
 * ═══════════════════════════════════════════════════════════════
 * USER HOOKS - CLEAN ARCHITECTURE
 * ═══════════════════════════════════════════════════════════════
 * 
 * TanStack Query hooks for user operations
 * 
 * Clean Architecture:
 * - Presentation layer hooks
 * - Use Case'leri kullanır (direkt repository değil)
 * - Dependency Injection pattern
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/zustand/useAuthStore';

// Use Cases
import { GetUserDataUseCase } from '@/domain/usecases/user/GetUserDataUseCase';
import { UpdatePremiumStatusUseCase } from '@/domain/usecases/user/UpdatePremiumStatusUseCase';
import { DecrementCreditsUseCase } from '@/domain/usecases/user/DecrementCreditsUseCase';

// Repository Implementation
import { UserRepositoryImpl } from '@/data/repositories/UserRepositoryImpl';

// ─────────────────────────────────────────────────────────
// DEPENDENCY INJECTION
// ─────────────────────────────────────────────────────────
const userRepository = new UserRepositoryImpl();
const getUserDataUseCase = new GetUserDataUseCase(userRepository);
const updatePremiumStatusUseCase = new UpdatePremiumStatusUseCase(userRepository);
const decrementCreditsUseCase = new DecrementCreditsUseCase(userRepository);

// ─────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────

/**
 * Get user data
 * 
 * Clean Architecture:
 * - Hook → Use Case → Repository → Firebase
 */
export function useUser() {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ['user', user?.uid],
        queryFn: () => getUserDataUseCase.invoke(user!.uid),
        enabled: !!user,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Update premium status
 * 
 * Clean Architecture:
 * - Hook → Use Case → Repository → Firebase
 */
export function useUpdatePremiumStatus() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: ({
            isPremium,
            durationDays,
        }: {
            isPremium: boolean;
            durationDays: number;
        }) => {
            if (!user) throw new Error('User not authenticated');
            return updatePremiumStatusUseCase.invoke(user.uid, isPremium, durationDays);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', user?.uid] });
        },
    });
}

/**
 * Decrement credits
 * 
 * Clean Architecture:
 * - Hook → Use Case → Repository → Firebase
 */
export function useDecrementCredits() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: () => {
            if (!user) throw new Error('User not authenticated');
            return decrementCreditsUseCase.invoke(user.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', user?.uid] });
        },
    });
}
