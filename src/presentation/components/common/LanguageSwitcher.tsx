/**
 * ═══════════════════════════════════════════════════════════════
 * LANGUAGE SWITCHER COMPONENT (Dropdown Style)
 * ═══════════════════════════════════════════════════════════════
 *
 * 🌍 TR ↔ EN dil seçimi dropdown menüsü.
 * LoginScreen ve ProfileScreen'de kullanılır.
 */

import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Modal, Pressable } from 'react-native';
import { useLanguageStore } from '@/store/zustand/useLanguageStore';
import { Ionicons } from '@expo/vector-icons';
import { scale, fontSize } from '@/utils/responsive';

interface LanguageSwitcherProps {
    /** Light tema (beyaz bg) veya Dark tema (transparan bg) */
    variant?: 'light' | 'dark';
}

const LANGUAGES = [
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
];

export default function LanguageSwitcher({ variant = 'light' }: LanguageSwitcherProps) {
    const { language, setLanguage } = useLanguageStore();
    const [isOpen, setIsOpen] = useState(false);

    const isLight = variant === 'light';
    const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

    const handleSelect = (code: string) => {
        setLanguage(code as 'tr' | 'en');
        setIsOpen(false);
    };

    return (
        <>
            {/* Trigger Button */}
            <TouchableOpacity
                style={[
                    styles.button,
                    isLight ? styles.buttonLight : styles.buttonDark,
                ]}
                onPress={() => setIsOpen(true)}
                activeOpacity={0.7}
            >
                <Text style={styles.flag}>{currentLang.flag}</Text>
                <Text
                    style={[
                        styles.label,
                        isLight ? styles.labelLight : styles.labelDark,
                    ]}
                >
                    {currentLang.code.toUpperCase()}
                </Text>
                <Ionicons
                    name="chevron-down"
                    size={scale(16)}
                    color={isLight ? '#0055AA' : '#FFFFFF'}
                />
            </TouchableOpacity>

            {/* Dropdown Modal */}
            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setIsOpen(false)}
                >
                    <View style={styles.dropdown}>
                        {LANGUAGES.map((lang) => (
                            <TouchableOpacity
                                key={lang.code}
                                style={[
                                    styles.dropdownItem,
                                    language === lang.code && styles.dropdownItemActive,
                                ]}
                                onPress={() => handleSelect(lang.code)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.dropdownFlag}>{lang.flag}</Text>
                                <Text style={[
                                    styles.dropdownLabel,
                                    language === lang.code && styles.dropdownLabelActive,
                                ]}>
                                    {lang.label}
                                </Text>
                                {language === lang.code && (
                                    <Ionicons
                                        name="checkmark"
                                        size={scale(20)}
                                        color="#0055AA"
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    buttonLight: {
        backgroundColor: '#FFFFFF',
    },
    buttonDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    flag: {
        fontSize: 16,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 13,
    },
    labelLight: {
        color: '#0055AA',
    },
    labelDark: {
        color: '#FFFFFF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 8,
        minWidth: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    dropdownItemActive: {
        backgroundColor: '#F0F7FF',
    },
    dropdownFlag: {
        fontSize: 20,
    },
    dropdownLabel: {
        fontSize: fontSize.md,
        color: '#333333',
        flex: 1,
    },
    dropdownLabelActive: {
        fontWeight: 'bold',
        color: '#0055AA',
    },
});
