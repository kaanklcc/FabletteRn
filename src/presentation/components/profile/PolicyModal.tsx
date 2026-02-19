/**
 * ═══════════════════════════════════════════════════════════════
 * POLICY MODAL
 * ═══════════════════════════════════════════════════════════════
 * 
 * Modal for displaying Privacy Policy and Terms of Use using WebView
 */

import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

// Config
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';

interface PolicyModalProps {
    visible: boolean;
    title: string;
    htmlFile: 'privacy' | 'terms';
    onClose: () => void;
}

export default function PolicyModal({
    visible,
    title,
    htmlFile,
    onClose,
}: PolicyModalProps) {
    // Both privacy and terms use the same HTML file (it has tabs for both)
    const htmlSource = require('../../../../assets/policies/privacy-policy.html');

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

                    {/* WebView for HTML Content */}
                    <WebView
                        source={htmlSource}
                        style={styles.webview}
                        originWhitelist={['*']}
                        scalesPageToFit={true}
                        startInLoadingState={true}
                    />
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
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});
