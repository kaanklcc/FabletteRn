/**
 * App.tsx - Uygulama giriş noktası
 * 
 * ═══════════════════════════════════════════════════════════════
 * STATE MANAGEMENT YAPISI (MODERN)
 * ═══════════════════════════════════════════════════════════════
 * 
 * 1. TanStack Query (Server State)
 *    - API çağrıları
 *    - Otomatik caching
 *    - Background refetch
 *    - Error retry
 * 
 * 2. Zustand (Client State - Provider gerekmez!)
 *    - Auth state (useAuthStore)
 *    - User data (useUserStore)
 * 
 * ⭐ MODERN YAKLAŞIM: TanStack Query + Zustand
 * ❌ ESKİ YAKLAŞIM: Redux Toolkit
 * 
 * Avantajlar:
 * - %50 daha az kod
 * - Otomatik caching
 * - Daha kolay öğrenme
 * - 2024 endüstri standardı
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootNavigator from './src/presentation/navigation/RootNavigator';

/**
 * Query Client Oluştur
 * 
 * TanStack Query'nin merkezi konfigürasyonu.
 * 
 * Kotlin karşılığı:
 * Hilt/Dagger ile dependency injection
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * Stale Time: Data ne kadar süre "fresh" sayılır?
       * 5 dakika boyunca cache'den serve edilir, API çağrısı yapılmaz.
       */
      staleTime: 5 * 60 * 1000, // 5 dakika

      /**
       * GC Time: Cache'de ne kadar süre kalır?
       * 10 dakika boyunca cache'de tutulur.
       */
      gcTime: 10 * 60 * 1000, // 10 dakika (eski adı: cacheTime)

      /**
       * Retry: Hata durumunda kaç kez tekrar denesin?
       */
      retry: 3,

      /**
       * Refetch on Window Focus: Uygulama tekrar açıldığında refetch yapsın mı?
       */
      refetchOnWindowFocus: true,
    },
    mutations: {
      /**
       * Mutation Retry: Mutation başarısız olursa tekrar denesin mi?
       */
      retry: 1,
    },
  },
});

export default function App() {
  return (
    /**
     * QueryClientProvider
     * 
     * Tüm component'lere TanStack Query'ye erişim sağlar.
     * 
     * Redux Provider'a benzer ama çok daha basit!
     */
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
      <StatusBar style="light" />
    </QueryClientProvider>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════
 * REDUX VS TANSTACK QUERY KARŞILAŞTIRMASI
 * ═══════════════════════════════════════════════════════════════
 * 
 * Redux (Eski):
 * ─────────────────────────────────────────────────────────────
 * import { Provider } from 'react-redux';
 * import { store } from './store/redux/store';
 * 
 * <Provider store={store}>
 *   <RootNavigator />
 * </Provider>
 * 
 * TanStack Query (Modern):
 * ─────────────────────────────────────────────────────────────
 * import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 * 
 * const queryClient = new QueryClient();
 * 
 * <QueryClientProvider client={queryClient}>
 *   <RootNavigator />
 * </QueryClientProvider>
 * 
 * 🚀 Daha basit, daha az kod!
 */
