/**
 * Auth Mutations - TanStack Query
 * 
 * Sadece logout mutation'ı. Email/Google auth kaldırıldı,
 * anonymous auth SplashScreen üzerinden yönetiliyor.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../zustand/useAuthStore';

import { LogoutUseCase } from '@/domain/usecases/auth/LogoutUseCase';
import { AuthRepositoryImpl } from '@/data/repositories/AuthRepositoryImpl';
import { FirebaseAuthDataSource } from '@/data/datasources/remote/FirebaseAuthDataSource';

const authDataSource = new FirebaseAuthDataSource();
const authRepository = new AuthRepositoryImpl(authDataSource);
const logoutUseCase = new LogoutUseCase(authRepository);

export const useLogout = () => {
    const queryClient = useQueryClient();
    const logout = useAuthStore((state) => state.logout);

    return useMutation({
        mutationFn: async () => {
            await logoutUseCase.invoke();
        },

        onSuccess: () => {
            logout();
            queryClient.clear();
        },

        onError: (error) => {
            console.error('Logout error:', error);
        },
    });
};
