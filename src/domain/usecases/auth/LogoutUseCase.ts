/**
 * ═══════════════════════════════════════════════════════════════
 * LOGOUT USE CASE
 * ═══════════════════════════════════════════════════════════════
 */

import { IAuthRepository } from '../../repositories/IAuthRepository';

export class LogoutUseCase {
    constructor(private authRepository: IAuthRepository) { }

    async invoke(): Promise<void> {
        await this.authRepository.logout();
    }
}
