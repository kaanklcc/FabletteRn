/**
 * Theme Configuration
 * 
 * DiscoveryBox2'deki renk paleti ve stil sabitleri.
 * Kotlin'de inline Color(0xFF...) kullanımı yerine,
 * React Native'de merkezi theme dosyası kullanmak şirket standardıdır.
 * 
 * 🎨 Renk Paleti:
 * - Primary: Koyu mavi (#003366) - Ana renk, bottom bar
 * - Accent: Altın sarısı (#FCD34D) - Vurgu rengi, seçili tab
 * - Secondary: Cyan (#22D3EE) - İkincil vurgu, profil tab
 * 
 * Kotlin karşılığı:
 * Color(0xFF003366) → colors.primary
 * Color(0xFFFCD34D) → colors.accent
 */

export const colors = {
    // Primary Colors
    primary: '#003366',           // Koyu mavi - Ana renk
    primaryLight: '#004080',      // Açık mavi
    primaryDark: '#002244',       // Daha koyu mavi

    // Accent Colors
    accent: '#FCD34D',            // Altın sarısı - Vurgu
    accentDark: '#F59E0B',        // Koyu altın

    // Secondary Colors
    secondary: '#22D3EE',         // Cyan - İkincil vurgu
    secondaryDark: '#06B6D4',     // Koyu cyan

    // Neutral Colors
    white: '#FFFFFF',
    black: '#000000',
    gray: '#6B7280',
    grayLight: '#F3F4F6',
    grayDark: '#374151',

    // Status Colors
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',

    // Background Colors
    background: '#FFFFFF',
    backgroundDark: '#1F2937',

    // Gradient Colors (GradientBackground için)
    gradientStart: '#1E3A8A',     // Koyu mavi
    gradientEnd: '#3B82F6',       // Açık mavi
};

/**
 * Spacing (Boşluk) Sabitleri
 * 
 * Kotlin'de: Modifier.padding(16.dp)
 * React Native'de: style={{ padding: spacing.md }}
 */
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

/**
 * Font Boyutları
 * 
 * Kotlin'de: fontSize = 24.sp
 * React Native'de: fontSize: typography.heading
 */
export const typography = {
    // Font Sizes
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    heading: 28,
    title: 32,

    // Font Weights
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
};

/**
 * Border Radius (Köşe Yuvarlama)
 */
export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,  // Tam yuvarlak (CircleShape)
};

/**
 * Shadows (Gölgeler)
 * 
 * React Native'de shadow iOS ve Android'de farklı çalışır.
 * iOS: shadowColor, shadowOffset, shadowOpacity, shadowRadius
 * Android: elevation
 */
export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
};

/**
 * Theme objesi - Tüm stil sabitlerini bir arada tutar
 */
export const theme = {
    colors,
    spacing,
    typography,
    borderRadius,
    shadows,
};

export type Theme = typeof theme;
