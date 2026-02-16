/**
 * ═══════════════════════════════════════════════════════════════
 * AUTH MUTATIONS - TanStack Query
 * ═══════════════════════════════════════════════════════════════
 * 
 * 🎯 NE İŞE YARAR?
 * 
 * Authentication işlemleri için TanStack Query mutations.
 * 
 * Mutation = Veri değiştirme işlemi (POST, PUT, DELETE)
 * 
 * ═══════════════════════════════════════════════════════════════
 * KOTLIN KARŞILAŞTIRMASI
 * ═══════════════════════════════════════════════════════════════
 * 
 * Kotlin'de (ViewModel):
 * fun login(email: String, password: String) {
 *   viewModelScope.launch {
 *     _loading.value = true
 *     try {
 *       val user = repository.login(email, password)
 *       _user.value = user
 *     } catch (e: Exception) {
 *       _error.value = e.message
 *     } finally {
 *       _loading.value = false
 *     }
 *   }
 * }
 * 
 * TanStack Query'de:
 * const { mutate, isPending, error } = useLogin();
 * mutate({ email, password });
 * 
 * ⭐ AVANTAJLAR:
 * - isPending otomatik (manuel _loading.value = true/false yok!)
 * - error otomatik (manuel try/catch yok!)
 * - Retry otomatik
 * - Cache invalidation otomatik
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../zustand/useAuthStore';
import { useUserStore } from '../zustand/useUserStore';
import { authKeys } from './queryKeys';

// Use Cases
import { LoginWithEmailUseCase } from '@/domain/usecases/auth/LoginWithEmailUseCase';
import { RegisterWithEmailUseCase } from '@/domain/usecases/auth/RegisterWithEmailUseCase';
import { LogoutUseCase } from '@/domain/usecases/auth/LogoutUseCase';

// Repository & DataSource
import { AuthRepositoryImpl } from '@/data/repositories/AuthRepositoryImpl';
import { FirebaseAuthDataSource } from '@/data/datasources/remote/FirebaseAuthDataSource';

/**
 * ═══════════════════════════════════════════════════════════════
 * DEPENDENCY INJECTION (Basit Versiyon)
 * ═══════════════════════════════════════════════════════════════
 * 
 * Şimdilik basit DI yapıyoruz.
 * İleride Dependency Injection Container kullanılabilir.
 */

// DataSource oluştur
const authDataSource = new FirebaseAuthDataSource();

// Repository oluştur
const authRepository = new AuthRepositoryImpl(authDataSource);

// Use Cases oluştur
const loginUseCase = new LoginWithEmailUseCase(authRepository);
const registerUseCase = new RegisterWithEmailUseCase(authRepository);
const logoutUseCase = new LogoutUseCase(authRepository);

/**
 * ═══════════════════════════════════════════════════════════════
 * LOGIN MUTATION
 * ═══════════════════════════════════════════════════════════════
 * 
 * Email ile giriş yapma mutation'ı.
 * 
 * Kotlin karşılığı:
 * viewModel.login(email, password)
 */
export const useLogin = () => {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state) => state.setUser);
    const setUserData = useUserStore((state) => state.setUserData);

    return useMutation({
        mutationFn: async (params: { email: string; password: string }) => {
            return await loginUseCase.invoke(params.email, params.password);
        },

        onSuccess: (user) => {
            setUser(user);

            // UserData store'u da güncelle
            setUserData({
                ad: user.firstName,
                soyad: user.lastName,
                email: user.email,
                premium: user.isPremium,
                premiumStartDate: user.premiumStartDate,
                premiumDurationDays: user.premiumDurationDays,
                remainingChatgptUses: user.remainingCredits,
                usedFreeTrial: user.usedFreeTrial,
            });

            queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
        },

        onError: (error) => {
            console.error('Login error:', error);
        },

        retry: 1,
    });
};

/**
 * ═══════════════════════════════════════════════════════════════
 * REGISTER MUTATION
 * ═══════════════════════════════════════════════════════════════
 */
export const useRegister = () => {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state) => state.setUser);
    const setUserData = useUserStore((state) => state.setUserData);

    return useMutation({
        mutationFn: async (params: {
            email: string;
            password: string;
            displayName: string;
        }) => {
            return await registerUseCase.invoke(
                params.email,
                params.password,
                params.displayName
            );
        },

        onSuccess: (user) => {
            setUser(user);

            // UserData store'u da güncelle (yeni kullanıcı varsayılan değerleri)
            setUserData({
                ad: user.firstName,
                soyad: user.lastName,
                email: user.email,
                premium: false,
                premiumStartDate: null,
                premiumDurationDays: 0,
                remainingChatgptUses: 0,
                usedFreeTrial: true,
            });

            queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
        },

        onError: (error) => {
            console.error('Register error:', error);
        },

        retry: 1,
    });
};

/**
 * ═══════════════════════════════════════════════════════════════
 * LOGOUT MUTATION
 * ═══════════════════════════════════════════════════════════════
 */
export const useLogout = () => {
    const queryClient = useQueryClient();
    const logout = useAuthStore((state) => state.logout);

    return useMutation({
        mutationFn: async () => {
            await logoutUseCase.invoke();
        },

        onSuccess: () => {
            // Zustand store'dan kullanıcıyı sil
            logout();

            // Tüm cache'i temizle
            queryClient.clear();
        },

        onError: (error) => {
            console.error('Logout error:', error);
        },
    });
};

/**
 * ═══════════════════════════════════════════════════════════════
 * KULLANIM ÖRNEĞİ (LoginScreen'de)
 * ═══════════════════════════════════════════════════════════════
 * 
 * import { useLogin } from '@/store/queries/useAuthMutations';
 * 
 * function LoginScreen() {
 *   const [email, setEmail] = useState('');
 *   const [password, setPassword] = useState('');
 *   
 *   const { mutate: login, isPending, error } = useLogin();
 *   
 *   const handleLogin = () => {
 *     login(
 *       { email, password },
 *       {
 *         onSuccess: () => {
 *           navigation.replace('Main');
 *         },
 *       }
 *     );
 *   };
 *   
 *   if (isPending) {
 *     return <ActivityIndicator />;
 *   }
 *   
 *   return (
 *     <View>
 *       {error && <Text>{error.message}</Text>}
 *       <TextInput value={email} onChangeText={setEmail} />
 *       <TextInput value={password} onChangeText={setPassword} secureTextEntry />
 *       <Button onPress={handleLogin}>Giriş Yap</Button>
 *     </View>
 *   );
 * }
 */
