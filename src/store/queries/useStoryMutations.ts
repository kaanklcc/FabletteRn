/**
 * ═══════════════════════════════════════════════════════════════
 * STORY MUTATIONS (TanStack Query)
 * ═══════════════════════════════════════════════════════════════
 * 
 * 🎯 NE İŞE YARAR?
 * 
 * Hikaye oluşturma gibi API çağrıları için TanStack Query mutations.
 * 
 * ⭐ MODERN YAKLAŞIM:
 * - Otomatik loading state
 * - Otomatik error handling
 * - Otomatik retry
 * - Optimistic updates
 * - Cache invalidation
 * 
 * Redux'a göre %50 daha az kod!
 * 
 * ═══════════════════════════════════════════════════════════════
 * KOTLIN KARŞILAŞTIRMASI
 * ═══════════════════════════════════════════════════════════════
 * 
 * Kotlin'de:
 * viewModelScope.launch {
 *   try {
 *     _loading.value = true
 *     val result = repository.createStory(params)
 *     _story.value = result
 *   } catch (e: Exception) {
 *     _error.value = e.message
 *   } finally {
 *     _loading.value = false
 *   }
 * }
 * 
 * TanStack Query'de:
 * const { mutate, isPending, error } = useCreateStory();
 * mutate(params);  // Hepsi otomatik! 🚀
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Story } from '../../domain/entities/Story';
import { storyKeys } from './queryKeys';

/**
 * Create Story Params
 */
interface CreateStoryParams {
    prompt: string;
    theme: string;
    length: string;
    userId: string;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * useCreateStory - Hikaye Oluştur
 * ═══════════════════════════════════════════════════════════════
 * 
 * ⭐ MODERN PROMISE-BASED YAKLAŞIM
 * 
 * Özellikler:
 * - Otomatik loading state (isPending)
 * - Otomatik error handling (error)
 * - Otomatik retry (3 kez)
 * - Success callback (onSuccess)
 * - Error callback (onError)
 * 
 * Kullanım:
 * const { mutate: createStory, isPending, error } = useCreateStory();
 * 
 * createStory({
 *   prompt: 'Bir zamanlar...',
 *   theme: 'Macera',
 *   length: 'Kısa',
 *   userId: 'user-123',
 * });
 */
export const useCreateStory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        /**
         * Mutation Function
         * 
         * API çağrısını yap.
         * 
         * ÖNEMLİ: Şu anda mock data!
         * Modül 4'te gerçek API entegrasyonu yapılacak.
         */
        mutationFn: async (params: CreateStoryParams): Promise<Story> => {
            /**
             * TODO: Modül 4'te gerçek API çağrısı
             * 
             * const response = await fetch(CLOUD_FUNCTION_URL, {
             *   method: 'POST',
             *   headers: { 'Content-Type': 'application/json' },
             *   body: JSON.stringify(params),
             * });
             * 
             * if (!response.ok) throw new Error('API error');
             * return await response.json();
             */

            // Mock API çağrısı (2 saniye bekle)
            return new Promise<Story>((resolve) => {
                setTimeout(() => {
                    resolve({
                        id: `story-${Date.now()}`,
                        title: 'Test Hikayesi',
                        content: `${params.prompt} ile başlayan bir ${params.theme} hikayesi...`,
                        imageUrl: '',
                        imageUrls: [],
                        timestamp: new Date(),
                        userId: params.userId,
                        theme: params.theme,
                        length: params.length,
                        pages: [],
                    });
                }, 2000);
            });
        },

        /**
         * Success Callback
         * 
         * API çağrısı başarılı olduğunda çalışır.
         * 
         * Burada:
         * - Cache'i invalidate et (yeni hikaye listesi çek)
         * - Optimistic update yap
         * - Navigation yap
         */
        onSuccess: (story) => {
            // Cache'i invalidate et - Hikaye listesi yeniden çekilir
            queryClient.invalidateQueries({ queryKey: storyKeys.lists() });

            // Yeni hikayeyi cache'e ekle (instant load için)
            queryClient.setQueryData(storyKeys.detail(story.id), story);
        },

        /**
         * Error Callback
         * 
         * API çağrısı başarısız olduğunda çalışır.
         */
        onError: (error) => {
            console.error('Hikaye oluşturma hatası:', error);
        },

        /**
         * Retry Configuration
         * 
         * Hata durumunda kaç kez tekrar denesin?
         */
        retry: 3,
    });
};

/**
 * ═══════════════════════════════════════════════════════════════
 * KULLANIM ÖRNEKLERİ
 * ═══════════════════════════════════════════════════════════════
 * 
 * 1. Component'te Kullanım:
 * 
 * import { useCreateStory } from '@/store/queries/useStoryMutations';
 * 
 * function CreateStoryScreen() {
 *   const { mutate: createStory, isPending, error, isSuccess } = useCreateStory();
 *   
 *   const handleCreate = () => {
 *     createStory({
 *       prompt: 'Bir zamanlar...',
 *       theme: 'Macera',
 *       length: 'Kısa',
 *       userId: 'user-123',
 *     });
 *   };
 *   
 *   if (isPending) return <ActivityIndicator />;
 *   if (error) return <Text>Hata: {error.message}</Text>;
 *   if (isSuccess) navigation.navigate('StoryViewer');
 * }
 * 
 * 2. Success Callback ile Navigation:
 * 
 * const { mutate } = useCreateStory();
 * 
 * mutate(params, {
 *   onSuccess: (story) => {
 *     navigation.navigate('StoryViewer', { storyId: story.id });
 *   },
 * });
 * 
 * 3. Loading State:
 * 
 * const { isPending } = useCreateStory();
 * 
 * <Button 
 *   onPress={handleCreate} 
 *   disabled={isPending}
 * >
 *   {isPending ? 'Oluşturuluyor...' : 'Hikaye Oluştur'}
 * </Button>
 * 
 * 4. Error Handling:
 * 
 * const { error, isError } = useCreateStory();
 * 
 * {isError && (
 *   <View>
 *     <Text>❌ Hata: {error.message}</Text>
 *     <Button onPress={() => mutate(params)}>Tekrar Dene</Button>
 *   </View>
 * )}
 */

/**
 * ═══════════════════════════════════════════════════════════════
 * REDUX VS TANSTACK QUERY KARŞILAŞTIRMASI
 * ═══════════════════════════════════════════════════════════════
 * 
 * Redux Toolkit (Eski):
 * ─────────────────────────────────────────────────────────────
 * // 1. Slice oluştur (50+ satır)
 * const storySlice = createSlice({
 *   name: 'story',
 *   initialState: { story: null, loading: false, error: null },
 *   reducers: { clearStory, clearError },
 *   extraReducers: (builder) => {
 *     builder
 *       .addCase(createStory.pending, ...)
 *       .addCase(createStory.fulfilled, ...)
 *       .addCase(createStory.rejected, ...);
 *   },
 * });
 * 
 * // 2. Async thunk oluştur (20+ satır)
 * export const createStory = createAsyncThunk(...);
 * 
 * // 3. Store'a ekle (10+ satır)
 * export const store = configureStore({ reducer: { story: storyReducer } });
 * 
 * // 4. Component'te kullan (10+ satır)
 * const dispatch = useDispatch<AppDispatch>();
 * const { story, loading, error } = useSelector((state: RootState) => state.story);
 * dispatch(createStory(params));
 * 
 * TOPLAM: ~100 satır kod
 * 
 * TanStack Query (Modern):
 * ─────────────────────────────────────────────────────────────
 * // 1. Mutation hook oluştur (30 satır)
 * export const useCreateStory = () => {
 *   return useMutation({
 *     mutationFn: async (params) => await api.createStory(params),
 *     onSuccess: (story) => { ... },
 *   });
 * };
 * 
 * // 2. Component'te kullan (3 satır)
 * const { mutate, isPending, error } = useCreateStory();
 * mutate(params);
 * 
 * TOPLAM: ~35 satır kod
 * 
 * 🚀 %65 DAHA AZ KOD!
 */
