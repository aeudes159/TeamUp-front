import {TouchableOpacity, View} from 'react-native';
import {Avatar, Surface, Text} from 'react-native-paper';
import type {Location, Post, User} from '@/types';
import {borderRadius, shadows, typography} from "@/constants/theme";
import {Clock, MapPin, MessageCircle, Pencil, Trash2} from "lucide-react-native";
import colors = module

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
        if (!dateString) return 'Unknown date';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getAuthorName = () => {
        if (author) {
            return `${author.firstName ?? ''} ${author.lastName ?? ''}`.trim() || 'Utilisateur';
        }
        return 'Utilisateur Inconnu';
    };

    const getAuthorAvatar = () => {
        return author?.profilePictureUrl ?? `https://i.pravatar.cc/150?u=${post.authorId}`;
    };

    return (
        <Surface style={[styles.card, shadows.soft]} elevation={0}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                {/* Author Header */}
                <View style={styles.authorRow}>
                    <Avatar.Image 
                        size={48} 
                        source={{ uri: getAuthorAvatar() }} 
                        style={{ backgroundColor: colors.cardLight }}
                    />
                    <View style={styles.authorInfo}>
                        <Text style={[typography.titleMedium, { color: colors.text }]}>
                            {getAuthorName()}
                        </Text>
                        <View style={styles.dateRow}>
                            <Clock size={14} color={colors.textSecondary} />
                            <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                                {formatDate(post.postedAt)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Post Content */}
                <View style={styles.content}>
                    {post.content && (
                        <Text style={[typography.bodyLarge, styles.postContent]}>
                            {post.content}
                        </Text>
                    )}
                </View>
                
                {/* Post Image */}
                {post.imageUrl && (
                    <Image source={{ uri: post.imageUrl }} style={styles.cover} contentFit="cover" />
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    {/* Location */}
                    {location && (
                        <View style={styles.locationRow}>
                            <MapPin size={16} color={colors.primary} />
                            <Text style={[typography.bodyMedium, styles.locationText]}>
                                {location.name ?? location.address}
                            </Text>
                        </View>
                    )}

                    {/* Actions Row */}
                    <View style={styles.actionsRow}>
                        <TouchableOpacity 
                            style={styles.commentButton}
                            onPress={onCommentPress}
                        >
                            <MessageCircle size={20} color={colors.textSecondary} />
                            <Text style={[typography.bodyMedium, styles.commentCount]}>
                                {commentCount}
                            </Text>
                        </TouchableOpacity>

                        {isAuthor && (
                            <View style={styles.authorActions}>
                                <TouchableOpacity 
                                    style={styles.actionIconButton}
                                    onPress={onEditPress}
                                >
                                    <Pencil size={18} color={colors.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.actionIconButton}
                                    onPress={onDeletePress}
                                >
                                    <Trash2 size={18} color={colors.coral} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </Surface>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 24,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.card,
        overflow: 'hidden',
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    authorInfo: {
        marginLeft: 12,
        flex: 1,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    postContent: {
        color: colors.text,
    },
    cover: {
        height: 220,
        backgroundColor: colors.cardLight,
    },
    footer: {
        padding: 20,
        paddingTop: 16,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    locationText: {
        color: colors.primary,
        fontWeight: '600',
        flex: 1,
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 1,
        borderColor: colors.cardLight,
    },
    commentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    commentCount: {
        color: colors.textSecondary,
        fontWeight: '600',
    },
    authorActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    actionIconButton: {
        padding: 8,
    },
});
