/**
 * ═══════════════════════════════════════════════════════════════
 * SUPPORTING CHARACTERS LIST - CreateStoryScreen
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 Hikaye.kt - Supporting characters section
 * 
 * Özellikler:
 * - Dynamic list
 * - Add button (+) on last item
 * - Remove button (🗑️) on each item (if more than 1)
 */

import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';

interface SupportingCharactersListProps {
    characters: string[];
    onCharactersChange: (characters: string[]) => void;
}

export default function SupportingCharactersList({
    characters,
    onCharactersChange,
}: SupportingCharactersListProps) {
    const handleCharacterChange = (index: number, value: string) => {
        const newCharacters = [...characters];
        newCharacters[index] = value;
        onCharactersChange(newCharacters);
    };

    const handleAddCharacter = () => {
        onCharactersChange([...characters, '']);
    };

    const handleRemoveCharacter = (index: number) => {
        const newCharacters = characters.filter((_, i) => i !== index);
        onCharactersChange(newCharacters);
    };

    return (
        <View style={styles.container}>
            {characters.map((character, index) => (
                <View key={index} style={styles.row}>
                    {/* Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Karakter ekle"
                        placeholderTextColor="#9CA3AF"
                        value={character}
                        onChangeText={(value) => handleCharacterChange(index, value)}
                    />

                    {/* Add Button (only on last item) */}
                    {index === characters.length - 1 && (
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleAddCharacter}
                            activeOpacity={0.8}>
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    )}

                    {/* Remove Button (if more than 1) */}
                    {characters.length > 1 && (
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => handleRemoveCharacter(index)}
                            activeOpacity={0.8}>
                            <Text style={styles.removeButtonText}>🗑️</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: verticalScale(8),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    input: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: scale(12),
        fontSize: fontSize.md,
        color: '#1F2937',
    },
    addButton: {
        width: scale(48),
        height: scale(48),
        borderRadius: 24,
        backgroundColor: colors.premium,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: fontSize.xxl,
        color: '#6B46C1',
        fontWeight: 'bold',
    },
    removeButton: {
        width: scale(40),
        height: scale(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        fontSize: fontSize.lg,
    },
});
