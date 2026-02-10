/**
 * App.tsx - Uygulama giriş noktası
 * 
 * Kotlin karşılığı: MainActivity.kt + setContent { }
 * 
 * React Native'de App.tsx, uygulamanın başlangıç component'idir.
 * Burada:
 * - Navigation yapısı kurulur
 * - Global provider'lar (Redux, Zustand) sarılır
 * - Theme provider'lar eklenir
 * 
 * Şimdilik sadece Navigation'ı render ediyoruz.
 * Modül 3'te state management eklenecek.
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/presentation/navigation/RootNavigator';

export default function App() {
  return (
    <>
      {/* RootNavigator - Tüm navigation yapısı */}
      <RootNavigator />

      {/* StatusBar - Üst durum çubuğu (saat, batarya, vb.) */}
      <StatusBar style="light" />
    </>
  );
}
