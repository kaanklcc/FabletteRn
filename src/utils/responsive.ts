/**
 * ═══════════════════════════════════════════════════════════════
 * RESPONSIVE UTILITIES
 * ═══════════════════════════════════════════════════════════════
 *
 * Manuel responsive sistem - Ekstra dependency yok!
 *
 * Base dimensions: iPhone 11 Pro (375x812)
 */

import { Dimensions, PixelRatio, Platform } from "react-native";

// ─────────────────────────────────────────────────────────
// SCREEN DIMENSIONS
// ─────────────────────────────────────────────────────────
const { width, height } = Dimensions.get("window");

// Base dimensions (iPhone 15 Pro)
const baseWidth = 393;
const baseHeight = 852;

// ─────────────────────────────────────────────────────────
// SCALING FUNCTIONS
// ─────────────────────────────────────────────────────────

/**
 * Yatay scaling (genişlik bazlı)
 * Padding, margin, width için kullan
 */
export const scale = (size: number): number => {
  return (width / baseWidth) * size;
};

/**
 * Dikey scaling (yükseklik bazlı)
 * Height, marginTop/Bottom için kullan
 */
export const verticalScale = (size: number): number => {
  return (height / baseHeight) * size;
};

/**
 * Orta yol scaling
 * Font size, border radius için kullan
 *
 * factor: 0 = scale yok, 1 = tam scale
 */
export const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

// ─────────────────────────────────────────────────────────
// FONT SCALING
// ─────────────────────────────────────────────────────────

/**
 * Responsive font size
 * iOS ve Android için optimize edilmiş
 */
export const responsiveFontSize = (size: number): number => {
  const newSize = size * (width / baseWidth);

  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }

  // Android'de biraz daha küçük göster
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

// ─────────────────────────────────────────────────────────
// DEVICE CHECKS
// ─────────────────────────────────────────────────────────

export const isSmallDevice = width < 375; // iPhone SE
export const isMediumDevice = width >= 375 && width < 430; // iPhone 15 Pro
export const isLargeDevice = width >= 430 && width < 768; // iPhone 15 Pro Max
export const isTablet = width >= 768; // iPad

// ─────────────────────────────────────────────────────────
// SPACING (Responsive)
// ─────────────────────────────────────────────────────────

export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  xxl: scale(40),
};

// ─────────────────────────────────────────────────────────
// FONT SIZES (Preset)
// ─────────────────────────────────────────────────────────

export const fontSize = {
  xs: responsiveFontSize(10),
  sm: responsiveFontSize(12),
  md: responsiveFontSize(14),
  lg: responsiveFontSize(16),
  xl: responsiveFontSize(18),
  xxl: responsiveFontSize(22),
  xxxl: responsiveFontSize(32),
};

// ─────────────────────────────────────────────────────────
// PLATFORM HELPERS
// ─────────────────────────────────────────────────────────

/**
 * Platform-specific değer seç
 *
 * Kullanım:
 * const padding = platformValue(10, 12); // iOS: 10, Android: 12
 */
export const platformValue = <T>(ios: T, android: T): T => {
  return Platform.select({ ios, android }) as T;
};

/**
 * Shadow helper (iOS ve Android için)
 */
export const shadow = (elevation: number) => {
  if (Platform.OS === "ios") {
    return {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: elevation / 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: elevation,
    };
  }

  return {
    elevation,
  };
};

// ─────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────

export const responsive = {
  width,
  height,
  scale,
  verticalScale,
  moderateScale,
  responsiveFontSize,
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
  isTablet,
  spacing,
  fontSize,
  platformValue,
  shadow,
};

export default responsive;
