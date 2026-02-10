/**
 * ═══════════════════════════════════════════════════════════════
 * QUERY KEYS (TanStack Query Cache Keys)
 * ═══════════════════════════════════════════════════════════════
 * 
 * 🎯 NE İŞE YARAR?
 * 
 * TanStack Query'de caching için kullanılan key'ler.
 * Her query'nin unique bir key'i olmalı.
 * 
 * Best Practice: Query key'leri merkezi bir yerde tanımla.
 * 
 * ═══════════════════════════════════════════════════════════════
 * KOTLIN KARŞILAŞTIRMASI
 * ═══════════════════════════════════════════════════════════════
 * 
 * Kotlin'de böyle bir şey yok çünkü manuel caching yapıyoruz.
 * TanStack Query otomatik caching yapıyor!
 */

/**
 * Story Query Keys
 * 
 * Hierarchical key structure (best practice):
 * 
 * ['stories'] → Tüm hikayeler
 * ['stories', 'list'] → Hikaye listesi
 * ['stories', 'list', { userId }] → Kullanıcıya göre filtrelenmiş liste
 * ['stories', 'detail', id] → Tek hikaye detayı
 */
export const storyKeys = {
    /**
     * Base key - Tüm hikaye query'leri
     */
    all: ['stories'] as const,

    /**
     * Liste query'leri
     */
    lists: () => [...storyKeys.all, 'list'] as const,

    /**
     * Filtrelenmiş liste
     * 
     * Kullanım:
     * queryKey: storyKeys.list({ userId: 'user-123' })
     */
    list: (filters: { userId?: string }) => [...storyKeys.lists(), filters] as const,

    /**
     * Detay query'leri
     */
    details: () => [...storyKeys.all, 'detail'] as const,

    /**
     * Tek hikaye detayı
     * 
     * Kullanım:
     * queryKey: storyKeys.detail('story-123')
     */
    detail: (id: string) => [...storyKeys.details(), id] as const,
};

/**
 * User Query Keys
 * 
 * Kullanıcı verileri için query key'leri.
 */
export const userKeys = {
    all: ['users'] as const,
    detail: (id: string) => [...userKeys.all, 'detail', id] as const,
    data: (id: string) => [...userKeys.all, 'data', id] as const,
};

/**
 * ═══════════════════════════════════════════════════════════════
 * KULLANIM ÖRNEKLERİ
 * ═══════════════════════════════════════════════════════════════
 * 
 * 1. Query'de Kullanım:
 * 
 * const { data } = useQuery({
 *   queryKey: storyKeys.detail('story-123'),
 *   queryFn: () => getStoryById('story-123'),
 * });
 * 
 * 2. Cache Invalidation:
 * 
 * const queryClient = useQueryClient();
 * queryClient.invalidateQueries({ queryKey: storyKeys.all });
 * 
 * 3. Prefetch:
 * 
 * queryClient.prefetchQuery({
 *   queryKey: storyKeys.detail('story-123'),
 *   queryFn: () => getStoryById('story-123'),
 * });
 */
