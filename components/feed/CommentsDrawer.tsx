import { Modal, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { colors, borderRadius, spacing, shadows, typography } from '@/constants/theme';
import { X } from 'lucide-react-native';
import { CommentsSection } from '@/components/comments/CommentsSection';

type CommentsDrawerProps = {
    visible: boolean;
    onClose: () => void;
    postId: number;
    currentUserId: number;
};

export function CommentsDrawer({
    visible,
    onClose,
    postId,
    currentUserId,
}: Readonly<CommentsDrawerProps>) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <View style={styles.overlay}>
                    <TouchableOpacity style={styles.backdrop} onPress={onClose} />
                    <Surface style={[styles.container, shadows.soft]} elevation={4}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Comments</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <X size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <CommentsSection 
                            targetId={postId} 
                            targetType="post" 
                            currentUserId={currentUserId} 
                        />
                    </Surface>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        backgroundColor: colors.card,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        height: '80%',
        paddingTop: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    title: {
        ...typography.titleMedium,
        color: colors.text,
    },
    closeButton: {
        padding: spacing.xs,
    },
});
