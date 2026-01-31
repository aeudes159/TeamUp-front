import { FlatList, View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { PostCard } from './PostCard';
import { mockUsers, mockLocations } from '@/mock/data';
import { colors, borderRadius, shadows, typography } from '@/constants/theme';
import { Coffee } from 'lucide-react-native';
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
                <View style={styles.loadingIconContainer}>
                    <ActivityIndicator size="large" color={colors.lilac} />
                </View>
                <Text style={styles.loadingText}>
                    Chargement des activités...
                </Text>
            </View>
        );
    }

    if (posts.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                    <Coffee size={48} color={colors.coral} />
                </View>
                <Text style={styles.emptyText}>
                    Aucune activité pour le moment
                </Text>
                <Text style={styles.emptySubtext}>
                    Soyez le premier à partager un moment avec votre équipe !
                </Text>
                <View style={styles.decorativeDots}>
                    <View style={[styles.dot, { backgroundColor: colors.lilac }]} />
                    <View style={[styles.dot, { backgroundColor: colors.yellow }]} />
                    <View style={[styles.dot, { backgroundColor: colors.coral }]} />
                </View>
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
    loadingIconContainer: {
        padding: 20,
        borderRadius: borderRadius.xl,
        backgroundColor: colors.card,
        marginBottom: 20,
        ...shadows.warm,
    },
    loadingText: {
        ...typography.bodyMedium,
        color: colors.card,
        textAlign: 'center',
        marginTop: 16,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    emptyIconContainer: {
        padding: 20,
        borderRadius: borderRadius.xl,
        backgroundColor: colors.card,
        marginBottom: 24,
        ...shadows.artistic,
    },
    emptyText: {
        ...typography.titleMedium,
        color: colors.card,
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubtext: {
        ...typography.bodyMedium,
        color: colors.cardLight,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    decorativeDots: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: borderRadius.pill,
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
});
