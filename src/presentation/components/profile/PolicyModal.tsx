/**
 * ═══════════════════════════════════════════════════════════════
 * POLICY MODAL
 * ═══════════════════════════════════════════════════════════════
 * 
 * Modal for displaying Privacy Policy and Terms of Use
 */

import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Config
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';

interface PolicyModalProps {
    visible: boolean;
    title: string;
    content: string;
    onClose: () => void;
}

export default function PolicyModal({
    visible,
    title,
    content,
    onClose,
}: PolicyModalProps) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={scale(28)} color={colors.white} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}>
                        <Text style={styles.content}>{content}</Text>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#003366',
    },
    container: {
        flex: 1,
        backgroundColor: '#003366',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: verticalScale(16),
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    },
    title: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        color: colors.white,
    },
    closeButton: {
        padding: scale(4),
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
    },
    content: {
        fontSize: fontSize.md,
        color: colors.white,
        lineHeight: verticalScale(24),
    },
});
