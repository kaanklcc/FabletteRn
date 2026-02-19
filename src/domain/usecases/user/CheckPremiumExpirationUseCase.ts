/**
 * ═══════════════════════════════════════════════════════════════
 * CHECK PREMIUM EXPIRATION USE CASE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Premium üyelik süresinin dolup dolmadığını kontrol eder.
 * Süre dolmuşsa Firestore'da premium'u kapatır.
 * 
 * Kotlin karşılığı: AnasayfaViewModel.checkUserAccess() (satır 76-99)
 * 
 * Mantık:
 *   premiumStartDate + premiumDurationDays > now → hâlâ geçerli
 *   aksi halde → premium'u kapat
 */

import { IUserRepository } from '../../repositories/IUserRepository';

export interface PremiumExpirationResult {
    /** Premium hâlâ geçerli mi? */
    isStillPremium: boolean;
    /** Premium expire oldu ve Firestore güncellendi mi? */
    wasExpired: boolean;
}

export class CheckPremiumExpirationUseCase {
    constructor(private userRepository: IUserRepository) { }

    /**
     * Premium süresini kontrol et
     * 
     * @param userId - Kullanıcı ID
     * @param isPremium - Firestore'daki mevcut premium durumu
     * @param premiumStartDate - Premium başlangıç tarihi
     * @param premiumDurationDays - Premium süresi (gün)
     * @returns PremiumExpirationResult
     */
    async invoke(
        userId: string,
        isPremium: boolean,
        premiumStartDate: Date | null,
        premiumDurationDays: number,
    ): Promise<PremiumExpirationResult> {
        // Premium değilse kontrol etmeye gerek yok
        if (!isPremium) {
            return { isStillPremium: false, wasExpired: false };
        }

        // premiumStartDate yoksa ama premium true ise → geçersiz durum, kapat
        if (!premiumStartDate) {
            await this.userRepository.expirePremium(userId);
            return { isStillPremium: false, wasExpired: true };
        }

        // Süre hesaplama (Kotlin AnasayfaViewModel.kt ile aynı mantık)
        const nowMillis = Date.now();
        const startMillis = premiumStartDate.getTime();
        const expireMillis = startMillis + premiumDurationDays * 24 * 60 * 60 * 1000;

        if (nowMillis > expireMillis) {
            // Süre dolmuş → Firestore'da premium'u kapat
            await this.userRepository.expirePremium(userId);
            console.log(`⏰ Premium süresi doldu. Kullanıcı: ${userId}`);
            return { isStillPremium: false, wasExpired: true };
        }

        // Hâlâ geçerli
        return { isStillPremium: true, wasExpired: false };
    }
}
