import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { Input } from '@/components/ui/Input';
import { colors, borderRadius, spacing, typography } from '@/constants/theme';
import { Send } from 'lucide-react-native';
import { useState } from 'react';
import { useComments, useCreateComment } from '@/hooks/useComments';
import { Comment } from '@/types';

type CommentsSectionProps = {
    targetId: number;
    targetType: 'post' | 'location';
    currentUserId: number;
};

export function CommentsSection({
    targetId,
    targetType,
    currentUserId,
}: Readonly<CommentsSectionProps>) {
    const [content, setContent] = useState('');
    const { data: comments = [], isLoading } = useComments(targetId, targetType);
    const createComment = useCreateComment();

    const handleSend = () => {
        if (!content.trim()) return;
        
        createComment.mutate({
            content,
            targetId,
            targetType,
            authorId: currentUserId
        });
        setContent('');
    };

    const renderComment = ({ item }: { item: Comment }) => (
        <View style={styles.commentItem}>
            <Avatar.Image 
                size={32} 
                source={{ uri: item.author?.profilePictureUrl || `https://i.pravatar.cc/100?u=${item.authorId}` }} 
                style={styles.avatar}
            />
            <View style={styles.commentContent}>
                <Text style={styles.authorName}>
                    {item.author?.firstName} {item.author?.lastName}
                </Text>
                <Text style={styles.commentText}>{item.content}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={comments}
                    renderItem={renderComment}
                    keyExtractor={item => String(item.id)}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
                        </View>
                    }
                />
            )}

            <View style={styles.footer}>
                <Input
                    placeholder="Add a comment..."
                    value={content}
                    onChangeText={setContent}
                    style={styles.input}
                />
                <TouchableOpacity 
                    onPress={handleSend} 
                    disabled={!content.trim() || createComment.isPending}
                    style={styles.sendButton}
                >
                    <Send size={24} color={content.trim() ? colors.primary : colors.textLight} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
    },
    emptyContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        ...typography.bodyMedium,
        color: colors.textSecondary,
    },
    commentItem: {
        flexDirection: 'row',
        marginBottom: spacing.md,
    },
    avatar: {
        backgroundColor: colors.lilac,
        marginRight: spacing.sm,
    },
    commentContent: {
        flex: 1,
        backgroundColor: colors.white,
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        borderTopLeftRadius: 0,
    },
    authorName: {
        ...typography.bodySmall,
        fontWeight: '700',
        marginBottom: 2,
    },
    commentText: {
        ...typography.bodyMedium,
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.cardLight,
        backgroundColor: colors.card,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    input: {
        backgroundColor: colors.white,
        marginBottom: 0,
        flex: 1,
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.cardLight,
    }
});
