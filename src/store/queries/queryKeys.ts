/**
 * ═══════════════════════════════════════════════════════════════
 * QUERY KEYS - TanStack Query Cache Keys
 * ═══════════════════════════════════════════════════════════════
 * 
 * 🎯 NE İŞE YARAR?
 * 
 * TanStack Query'de cache key'leri merkezi bir yerde tanımlar.
 * 
 * Hierarchical (hiyerarşik) yapı kullanılır:
 * - ['stories'] → Tüm hikaye query'leri
 * - ['stories', 'list'] → Hikaye listesi
 * - ['stories', 'detail', '123'] → ID=123 hikayesi
 * 
 * ═══════════════════════════════════════════════════════════════
 * KOTLIN KARŞILAŞTIRMASI
 * ═══════════════════════════════════════════════════════════════
 * 
 * Kotlin'de cache key yok, direkt ViewModel'de veri tutulur.
 * 
 * TanStack Query'de:
 * - Her query'nin bir key'i var
 * - Aynı key → Cache'den veri gelir
 * - Farklı key → API çağrısı yapılır
 * 
 * ═══════════════════════════════════════════════════════════════
 * NEDEN HIERARCHICAL?
 * ═══════════════════════════════════════════════════════════════
 * 
 * Kolay invalidation için!
 * 
 * Örnek:
 * - Yeni hikaye oluşturuldu
 * - Tüm hikaye query'lerini invalidate et
 * - queryClient.invalidateQueries({ queryKey: storyKeys.all })
 * - Bu, ['stories'] ile başlayan TÜM query'leri invalidate eder
 */

/**
 * Story Query Keys
 * 
 * Hikaye ile ilgili tüm cache key'leri
 */
export const storyKeys = {
    /**
     * Tüm hikaye query'leri
     * 
     * ['stories']
     */
    all: ['stories'] as const,

    /**
     * Hikaye listeleri
     * 
     * ['stories', 'list']
     */
    lists: () => [...storyKeys.all, 'list'] as const,

    /**
     * Filtrelenmiş hikaye listesi
     * 
     * ['stories', 'list', { userId: '123' }]
     */
    list: (filters: { userId?: string; theme?: string }) =>
        [...storyKeys.lists(), filters] as const,

    /**
     * Hikaye detayları
     * 
     * ['stories', 'detail']
     */
    details: () => [...storyKeys.all, 'detail'] as const,

    /**
     * Tek bir hikaye
     * 
     * ['stories', 'detail', '123']
     */
    detail: (id: string) => [...storyKeys.details(), id] as const,
};

/**
 * Auth Query Keys
 * 
 * Authentication ile ilgili cache key'leri
 */
export const authKeys = {
    /**
     * Tüm auth query'leri
     * 
     * ['auth']
     */
    all: ['auth'] as const,

    /**
     * Mevcut kullanıcı
     * 
     * ['auth', 'currentUser']
     */
    currentUser: () => [...authKeys.all, 'currentUser'] as const,
};

/**
 * User Query Keys
 * 
 * Kullanıcı verisi ile ilgili cache key'leri
 */
export const userKeys = {
    /**
     * Tüm user query'leri
     * 
     * ['users']
     */
    all: ['users'] as const,

    /**
     * Kullanıcı detayları
     * 
     * ['users', 'detail']
     */
    details: () => [...userKeys.all, 'detail'] as const,

    /**
     * Tek bir kullanıcı
     * 
     * ['users', 'detail', '123']
     */
    detail: (id: string) => [...userKeys.details(), id] as const,

    /**
     * Kullanıcı Firestore verisi
     * 
     * ['users', 'data', '123']
     */
    data: (id: string) => [...userKeys.all, 'data', id] as const,
};

/**
 * ═══════════════════════════════════════════════════════════════
 * KULLANIM ÖRNEKLERİ
 * ═══════════════════════════════════════════════════════════════
 * 
 * 1. Query'de kullanım:
 * 
 * useQuery({
 *   queryKey: storyKeys.detail('story-123'),
 *   queryFn: () => getStory('story-123'),
 * });
 * 
 * 2. Invalidation:
 * 
 * // Tüm hikaye query'lerini invalidate et
 * queryClient.invalidateQueries({ queryKey: storyKeys.all });
 * 
 * // Sadece liste query'lerini invalidate et
 * queryClient.invalidateQueries({ queryKey: storyKeys.lists() });
 * 
 * // Sadece ID=123 hikayesini invalidate et
 * queryClient.invalidateQueries({ queryKey: storyKeys.detail('123') });
 * 
 * 3. Manuel cache update:
 * 
 * queryClient.setQueryData(storyKeys.detail('123'), newStory);
 */
