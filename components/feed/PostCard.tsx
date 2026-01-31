import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Card, Text, Avatar } from 'react-native-paper';
import { MapPin, Clock } from 'lucide-react-native';
import type { Post, User, Location, PostCardProps } from '@/types';

export function PostCard({
    post,
    author,
    location,
    onPress,
}: Readonly<PostCardProps>) {
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
});
