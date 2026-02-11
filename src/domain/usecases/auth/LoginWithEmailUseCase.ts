/**
 * ═══════════════════════════════════════════════════════════════
 * LOGIN WITH EMAIL USE CASE
 * ═══════════════════════════════════════════════════════════════
 * 
 * 🎯 NE İŞE YARAR?
 * 
 * Email ve şifre ile giriş yapma iş mantığı.
 * 
 * Clean Architecture'da her use case tek bir iş yapar.
 * (Single Responsibility Principle)
 * 
 * ═══════════════════════════════════════════════════════════════
 * KOTLIN KARŞILAŞTIRMASI
 * ═══════════════════════════════════════════════════════════════
 * 
 * Kotlin'de (DiscoveryBox2):
 * - ViewModel'de direkt Firebase çağrısı yapılıyor
 * - İş mantığı ViewModel'de
 * 
 * Clean Architecture'da:
 * - İş mantığı Use Case'de
 * - ViewModel/Hook sadece Use Case'i çağırır
 * - Daha test edilebilir, daha modüler
 */

import { IAuthRepository } from '../../repositories/IAuthRepository';
import { User } from '../../entities/User';

/**
 * Login With Email Use Case
 * 
 * Kotlin karşılığı:
 * class LoginUseCase(private val repository: AuthRepository) {
 *   suspend operator fun invoke(email: String, password: String): User {
 *     return repository.login(email, password)
 *   }
 * }
 */
export class LoginWithEmailUseCase {
    /**
     * Constructor
     * 
     * @param authRepository - Auth repository interface
     * 
     * Dependency Injection:
     * - Interface'i alıyoruz, concrete class'ı değil
     * - Test'te mock repository verebiliriz
     * - Firebase yerine başka auth provider kullanılabilir
     */
    constructor(private authRepository: IAuthRepository) { }

    /**
     * Execute Use Case
     * 
     * @param email - Kullanıcı email
     * @param password - Kullanıcı şifresi
     * @returns User entity
     * @throws Error - Validasyon hatası veya auth hatası
     * 
     * Kotlin'de:
     * suspend operator fun invoke(email: String, password: String): User
     * 
     * TypeScript'te:
     * async invoke(email: string, password: string): Promise<User>
     */
    async invoke(email: string, password: string): Promise<User> {
        // ─────────────────────────────────────────────────────────
        // VALIDASYON (İş Mantığı)
        // ─────────────────────────────────────────────────────────

        // Email boş mu?
        if (!email || email.trim().length === 0) {
            throw new Error('Email adresi gerekli');
        }

        // Email formatı doğru mu?
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Geçersiz email formatı');
        }

        // Şifre boş mu?
        if (!password || password.length === 0) {
            throw new Error('Şifre gerekli');
        }

        // Şifre en az 6 karakter mi?
        if (password.length < 6) {
            throw new Error('Şifre en az 6 karakter olmalı');
        }

        // ─────────────────────────────────────────────────────────
        // REPOSITORY ÇAĞRISI
        // ─────────────────────────────────────────────────────────

        /**
         * Repository'yi çağır
         * 
         * Repository nasıl çalışır bilmiyoruz (Firebase mi, REST API mi?)
         * Sadece interface'i kullanıyoruz.
         * 
         * Kotlin karşılığı:
         * return repository.login(email, password)
         */
        return await this.authRepository.signInWithEmail(email, password);
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * KULLANIM ÖRNEĞİ
 * ═══════════════════════════════════════════════════════════════
 * 
 * 1. TanStack Query Mutation'da:
 * 
 * const loginUseCase = new LoginWithEmailUseCase(authRepository);
 * 
 * export const useLogin = () => {
 *   return useMutation({
 *     mutationFn: async (params) => {
 *       return await loginUseCase.invoke(params.email, params.password);
 *     },
 *   });
 * };
 * 
 * 2. Screen'de:
 * 
 * const { mutate: login, isPending, error } = useLogin();
 * 
 * const handleLogin = () => {
 *   login({ email, password });
 * };
 */

/**
 * ═══════════════════════════════════════════════════════════════
 * NEDEN USE CASE?
 * ═══════════════════════════════════════════════════════════════
 * 
 * 1. **Single Responsibility**: Sadece login iş mantığı
 * 2. **Reusability**: Farklı yerlerden kullanılabilir
 * 3. **Testability**: Mock repository ile test edilebilir
 * 4. **Maintainability**: İş mantığı değişirse sadece burası değişir
 * 
 * Örnek Test:
 * 
 * test('should throw error if email is empty', async () => {
 *   const mockRepo = { signInWithEmail: jest.fn() };
 *   const useCase = new LoginWithEmailUseCase(mockRepo);
 *   
 *   await expect(useCase.invoke('', 'password'))
 *     .rejects
 *     .toThrow('Email adresi gerekli');
 * });
 */
