/**
 * FeedList Component - Refactored to use shared state components
 * 
 * Uses ListWrapper for loading/empty states and shared utilities.
 */

import { FlatList, StyleSheet } from 'react-native';
import { FileText } from 'lucide-react-native';
import { PostCard } from './PostCard';
import { ListWrapper } from '@/components/ui/StateComponents';
import { mockUsers, mockLocations } from '@/mock/data';
import type { Post, User, Location } from '@/types';

type FeedListProps = {
    posts: Post[];
    users?: User[];
    locations?: Location[];
    onPostPress?: (post: Post) => void;
    isLoading?: boolean;
    error?: Error | null;
    onRetry?: () => void;
};

export function FeedList({ 
    posts, 
    users = mockUsers, 
    locations = mockLocations,
    onPostPress,
    isLoading = false,
    error = null,
    onRetry,
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

    return (
        <ListWrapper
            isLoading={isLoading}
            error={error}
            isEmpty={posts.length === 0}
            loadingMessage="Chargement des posts..."
            emptyTitle="Aucun post pour le moment"
            emptySubtitle="Soyez le premier à partager une activité !"
            emptyIcon={<FileText size={48} color="#d1d5db" />}
            onRetry={onRetry}
        >
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
        </ListWrapper>
    );
}

const styles = StyleSheet.create({
    listContent: {
        flexGrow: 1,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
});
