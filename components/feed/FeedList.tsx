import { FlatList, View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { PostCard } from './PostCard';
import { mockUsers, mockLocations } from '@/mock/data';
import type { Post, User, Location } from '@/types';

type FeedListProps = {
    posts: Post[];
    users?: User[];
    locations?: Location[];
    onPostPress?: (post: Post) => void;
    isLoading?: boolean;
};

export function FeedList({ 
    posts, 
    users = mockUsers, 
    locations = mockLocations,
    onPostPress,
    isLoading = false,
}: Readonly<FeedListProps>) {
    // Helper to find author by ID
    const findAuthor = (authorId: number | null): User | undefined => {
        if (!authorId) return undefined;
        return users.find(u => u.id === authorId);
    };

    // Helper to find location by ID
    const findLocation = (locationId: number | null): Location | undefined => {
        if (!locationId) return undefined;
        return locations.find(l => l.id === locationId);
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text variant="bodyMedium" style={styles.loadingText}>
                    Chargement des posts...
                </Text>
            </View>
        );
    }

    if (posts.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text variant="bodyLarge" style={styles.emptyText}>
                    Aucun post pour le moment
                </Text>
                <Text variant="bodyMedium" style={styles.emptySubtext}>
                    Soyez le premier a partager une activite !
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
                <PostCard
                    post={item}
                    author={findAuthor(item.authorId)}
                    location={findLocation(item.locationId)}
                    onPress={() => onPostPress?.(item)}
                />
            )}
            contentContainerStyle={styles.listContent}
        />
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    loadingText: {
        marginTop: 16,
        color: '#6b7280',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    emptyText: {
        textAlign: 'center',
        color: '#374151',
        fontWeight: '600',
    },
    emptySubtext: {
        textAlign: 'center',
        color: '#6b7280',
        marginTop: 8,
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
});
