import { View, StyleSheet } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { FeedList } from '@/components/feed/FeedList';
import { usePosts } from '@/hooks/usePosts';
import { Appbar, Text } from 'react-native-paper';
import { router } from 'expo-router';
import type { Post } from '@/types';

export default function FeedScreen() {
    const { data: posts, isLoading, error } = usePosts();

    const handlePostPress = (post: Post) => {
        console.log('Post clicked:', post.id);
        // TODO: Navigate to post detail or discussion
        // router.push(`/post/${post.id}`);
    };

    return (
        <Screen scrollable={false}>
            <Appbar.Header>
                <Appbar.Content title="Feed" />
                <Appbar.Action icon="plus" onPress={() => {/* TODO: open create post modal */}} />
            </Appbar.Header>

            <View style={styles.container}>
                {error && (
                    <View style={styles.errorContainer}>
                        <Text variant="bodyMedium" style={styles.errorText}>
                            Erreur de chargement: {error.message}
                        </Text>
                    </View>
                )}
                <FeedList
                    posts={posts ?? []}
                    onPostPress={handlePostPress}
                    isLoading={isLoading}
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorContainer: {
        padding: 16,
        backgroundColor: '#fee2e2',
        margin: 16,
        borderRadius: 8,
    },
    errorText: {
        color: '#dc2626',
        textAlign: 'center',
    },
});
