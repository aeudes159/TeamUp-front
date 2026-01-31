import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Card, Text, Avatar } from 'react-native-paper';
import { MapPin, Clock, MessageCircle, Pencil, Trash2 } from 'lucide-react-native';
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
        <Card style={styles.card} onPress={onPress}>
            {/* Author Header */}
            <View style={styles.authorRow}>
                <Avatar.Image 
                    size={40} 
                    source={{ uri: getAuthorAvatar() }} 
                />
                <View style={styles.authorInfo}>
                    <Text variant="titleSmall" style={styles.authorName}>
                        {getAuthorName()}
                    </Text>
                    <View style={styles.dateRow}>
                        <Clock size={12} color="#6b7280" />
                        <Text variant="bodySmall" style={styles.dateText}>
                            {formatDate(post.postedAt)}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Post Image */}
            {post.imageUrl && (
                <Card.Cover source={{ uri: post.imageUrl }} style={styles.cover} />
            )}

            {/* Post Content */}
            <Card.Content style={styles.content}>
                {post.content && (
                    <Text variant="bodyMedium" style={styles.postContent}>
                        {post.content}
                    </Text>
                )}

                {/* Location */}
                {location && (
                    <View style={styles.locationRow}>
                        <MapPin size={14} color="#6366f1" />
                        <Text variant="bodySmall" style={styles.locationText}>
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
                    >
                        <MessageCircle size={18} color="#6b7280" />
                        <Text variant="bodySmall" style={styles.commentCount}>
                            {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
                        </Text>
                    </TouchableOpacity>

                    {/* Edit/Delete buttons for author */}
                    {isAuthor && (
                        <View style={styles.authorActions}>
                            <TouchableOpacity 
                                style={styles.actionIconButton}
                                onPress={onEditPress}
                            >
                                <Pencil size={16} color="#6b7280" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.actionIconButton}
                                onPress={onDeletePress}
                            >
                                <Trash2 size={16} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        borderRadius: 12,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingBottom: 8,
    },
    authorInfo: {
        marginLeft: 12,
        flex: 1,
    },
    authorName: {
        fontWeight: '600',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    dateText: {
        color: '#6b7280',
        fontSize: 12,
    },
    cover: {
        height: 200,
        marginHorizontal: 0,
    },
    content: {
        paddingTop: 12,
    },
    postContent: {
        marginBottom: 12,
        lineHeight: 22,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    locationText: {
        color: '#6366f1',
        flex: 1,
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    commentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    commentCount: {
        color: '#6b7280',
    },
    authorActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionIconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
    },
});
