import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Card, Text, Avatar } from 'react-native-paper';
import { MapPin, Clock, MessageCircle, Pencil, Trash2, Heart } from 'lucide-react-native';
import { colors, borderRadius, shadows, typography } from '@/constants/theme';
import type { Post, User, Location } from '@/types';

type PostCardProps = {
    post: Post;
    author?: User;
    location?: Location;
    commentCount?: number;
    currentUserId?: number;
    onPress?: () => void;
    onCommentPress?: () => void;
    onEditPress?: () => void;
    onDeletePress?: () => void;
};

export function PostCard({
    post,
    author,
    location,
    commentCount = 0,
    currentUserId,
    onPress,
    onCommentPress,
    onEditPress,
    onDeletePress,
}: Readonly<PostCardProps>) {
    const isAuthor = currentUserId !== undefined && post.authorId === currentUserId;
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getAuthorName = () => {
        if (author) {
            return `${author.firstName ?? ''} ${author.lastName ?? ''}`.trim() || 'Utilisateur';
        }
        return 'Utilisateur';
    };

    const getAuthorAvatar = () => {
        return author?.profilePictureUrl ?? 'https://i.pravatar.cc/150?img=1';
    };

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <View style={styles.card}>
                {/* Author Header */}
                <View style={styles.authorRow}>
                    <View style={styles.avatarContainer}>
                        <Avatar.Image 
                            size={44} 
                            source={{ uri: getAuthorAvatar() }} 
                            style={styles.avatar}
                        />
                    </View>
                    <View style={styles.authorInfo}>
                        <Text style={styles.authorName}>
                            {getAuthorName()}
                        </Text>
                        <View style={styles.dateRow}>
                            <Clock size={12} color={colors.textSecondary} />
                            <Text style={styles.dateText}>
                                {formatDate(post.postedAt)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.decorativeElement}>
                        <Heart size={16} color={colors.coral} fill={colors.coral} />
                    </View>
                </View>

                {/* Post Image */}
                {post.imageUrl && (
                    <View style={styles.imageContainer}>
                        <Image 
                            source={{ uri: post.imageUrl }} 
                            style={styles.cover}
                            contentFit="cover"
                        />
                    </View>
                )}

                {/* Post Content */}
                <View style={styles.content}>
                    {post.content && (
                        <Text style={styles.postContent}>
                            {post.content}
                        </Text>
                    )}

                    {/* Location */}
                    {location && (
                        <View style={styles.locationRow}>
                            <MapPin size={14} color={colors.lilac} />
                            <Text style={styles.locationText}>
                                {location.name ?? location.address}
                            </Text>
                        </View>
                    )}

                    {/* Actions Row */}
                    <View style={styles.actionsRow}>
                        {/* Comment Button */}
                        <TouchableOpacity 
                            style={styles.commentButton}
                            onPress={onCommentPress}
                            activeOpacity={0.7}
                        >
                            <MessageCircle size={18} color={colors.textSecondary} />
                            <Text style={styles.commentCount}>
                                {commentCount} {commentCount === 1 ? 'commentaire' : 'commentaires'}
                            </Text>
                        </TouchableOpacity>

                        {/* Edit/Delete buttons for author */}
                        {isAuthor && (
                            <View style={styles.authorActions}>
                                <TouchableOpacity 
                                    style={styles.actionIconButton}
                                    onPress={onEditPress}
                                    activeOpacity={0.7}
                                >
                                    <Pencil size={16} color={colors.textSecondary} />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.actionIconButton, styles.deleteButton]}
                                    onPress={onDeletePress}
                                    activeOpacity={0.7}
                                >
                                    <Trash2 size={16} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 20,
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        padding: 20,
        ...shadows.soft,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarContainer: {
        borderRadius: borderRadius.pill,
        padding: 2,
        backgroundColor: colors.cardLight,
    },
    avatar: {
        borderRadius: borderRadius.pill,
    },
    authorInfo: {
        marginLeft: 12,
        flex: 1,
    },
    authorName: {
        ...typography.titleSmall,
        marginBottom: 4,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateText: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    decorativeElement: {
        padding: 8,
        borderRadius: borderRadius.pill,
        backgroundColor: colors.cardLight,
    },
    imageContainer: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        marginBottom: 16,
    },
    cover: {
        height: 200,
        width: '100%',
        borderRadius: borderRadius.lg,
    },
    content: {
        gap: 12,
    },
    postContent: {
        ...typography.bodyMedium,
        lineHeight: 24,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: colors.cardLight,
        borderRadius: borderRadius.md,
        alignSelf: 'flex-start',
    },
    locationText: {
        ...typography.bodySmall,
        color: colors.lilac,
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: `${colors.primary}20`,
    },
    commentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.cardLight,
        borderRadius: borderRadius.pill,
    },
    commentCount: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    authorActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionIconButton: {
        padding: 10,
        borderRadius: borderRadius.pill,
        backgroundColor: colors.cardLight,
    },
    deleteButton: {
        backgroundColor: '#fee2e2',
    },
});
