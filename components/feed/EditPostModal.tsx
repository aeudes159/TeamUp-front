import { Modal, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors, borderRadius, spacing, shadows, typography } from '@/constants/theme';
import { Image as ExpoImage } from 'expo-image';
import { X, Image as ImageIcon } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import type { Post, Location } from '@/types';

type EditPostModalProps = {
    visible: boolean;
    onClose: () => void;
    onUpdatePost: (postId: number, updates: { content?: string; imageUrl?: string; locationId?: number }) => void;
    isLoading: boolean;
    post: Post | null;
    location: Location | null;
};

export function EditPostModal({
    visible,
    onClose,
    onUpdatePost,
    isLoading,
    post,
    location,
}: Readonly<EditPostModalProps>) {
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (post) {
            setContent(post.content || '');
            setImageUrl(post.imageUrl || null);
        }
    }, [post]);

    const handleSubmit = () => {
        if (!content.trim() || !post?.id) return;

        onUpdatePost(post.id, {
            content,
            imageUrl: imageUrl ?? undefined,
        });
    };

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
                    <Surface style={[styles.container, shadows.soft]} elevation={4}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Edit Post</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <X size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.content}>
                            <Input
                                placeholder="What's happening?"
                                value={content}
                                onChangeText={setContent}
                                multiline
                                numberOfLines={4}
                                style={styles.input}
                            />

                            {imageUrl && (
                                <View style={styles.imagePreview}>
                                    <ExpoImage source={{ uri: imageUrl }} style={styles.image} />
                                    <TouchableOpacity
                                        style={styles.removeImageButton}
                                        onPress={() => setImageUrl(null)}
                                    >
                                        <X size={16} color={colors.white} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.imageButton}>
                                <ImageIcon size={24} color={colors.primary} />
                            </TouchableOpacity>

                            <Button
                                onPress={handleSubmit}
                                loading={isLoading}
                                disabled={!content.trim() || isLoading}
                                size="md"
                            >
                                Save
                            </Button>
                        </View>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: colors.card,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.lg,
        paddingBottom: Platform.OS === 'ios' ? 40 : spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    title: {
        ...typography.titleMedium,
        color: colors.text,
    },
    closeButton: {
        padding: spacing.xs,
    },
    content: {
        marginBottom: spacing.md,
    },
    input: {
        backgroundColor: colors.white,
        minHeight: 100,
    },
    imagePreview: {
        marginTop: spacing.md,
        position: 'relative',
        borderRadius: borderRadius.md,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 200,
    },
    removeImageButton: {
        position: 'absolute',
        top: spacing.xs,
        right: spacing.xs,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: borderRadius.pill,
        padding: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    imageButton: {
        padding: spacing.sm,
        backgroundColor: colors.cardLight,
        borderRadius: borderRadius.pill,
    },
});
