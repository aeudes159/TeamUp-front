import { useState } from 'react';
import { View, StyleSheet, FlatList, Alert, Animated } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { PostCard } from '@/components/feed/PostCard';
import { CreatePostModal } from '@/components/feed/CreatePostModal';
import { EditPostModal } from '@/components/feed/EditPostModal';
import { CommentsDrawer } from '@/components/feed/CommentsDrawer';
import { usePosts, useCreatePost, useUpdatePost, useDeletePost } from '@/hooks/usePosts';
import { useCommentCount } from '@/hooks/useComments';
import { useUsers } from '@/hooks/useUsers';
import { useLocations } from '@/hooks/useLocations';
import { FAB, ActivityIndicator, Surface, Text } from 'react-native-paper';
import { colors, shadows, borderRadius, spacing, typography } from '@/constants/theme';
import type { Post, User, Location, NewPost } from '@/types';

// TODO: Replace with actual auth when implemented
const CURRENT_USER_ID = 1;

// Wrapper component to fetch and display comment count for each post
function PostCardWithComments({
    post,
    author,
    location,
    currentUserId,
    onCommentPress,
    onEditPress,
    onDeletePress,
}: {
    post: Post;
    author?: User;
    location?: Location;
    currentUserId: number;
    onCommentPress: () => void;
    onEditPress: () => void;
    onDeletePress: () => void;
}) {
    const { data: commentCount = 0 } = useCommentCount(post.id ?? undefined);

    return (
        <PostCard
            post={post}
            author={author}
            location={location}
            commentCount={commentCount}
            currentUserId={currentUserId}
            onCommentPress={onCommentPress}
            onEditPress={onEditPress}
            onDeletePress={onDeletePress}
        />
    );
}

export default function FeedScreen() {
    const { data: postsData, isLoading, error } = usePosts();
    const { data: usersData } = useUsers({ page: 0, size: 100 });
    const { data: locations = [] } = useLocations({ page: 0, size: 100 });
    
    const posts = postsData?.data || [];
    const users = usersData?.data || [];

    const createPost = useCreatePost();
    const updatePost = useUpdatePost();
    const deletePost = useDeletePost();

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    // Comments drawer state
    const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    const [scrollY] = useState(new Animated.Value(0));

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.8],
        extrapolate: 'clamp',
    });

    // Helper functions
    const findAuthor = (authorId: number | null): User | undefined => {
        if (!authorId) return undefined;
        return users.find(u => u.id === authorId);
    };

    const findLocation = (locationId: number | null): Location | undefined => {
        if (!locationId) return undefined;
        return locations.find(l => l.id === locationId);
    };

    // Handlers
    const handleCreatePost = (newPost: NewPost) => {
        createPost.mutate(newPost, {
            onSuccess: () => {
                setShowCreateModal(false);
            },
            onError: (error) => {
                Alert.alert('Error', 'Failed to create post. Please try again.');
                console.error('Create post error:', error);
            },
        });
    };

    const handleUpdatePost = (postId: number, updates: { content?: string; imageUrl?: string; locationId?: number }) => {
        updatePost.mutate({ id: postId, ...updates }, {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingPost(null);
            },
            onError: (error) => {
                Alert.alert('Error', 'Failed to update post. Please try again.');
                console.error('Update post error:', error);
            },
        });
    };

    const handleDeletePost = (post: Post) => {
        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post? This will also delete all comments.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        if (post.id) {
                            deletePost.mutate(post.id, {
                                onError: (error) => {
                                    Alert.alert('Error', 'Failed to delete post. Please try again.');
                                    console.error('Delete post error:', error);
                                },
                            });
                        }
                    },
                },
            ]
        );
    };

    const handleOpenEdit = (post: Post) => {
        setEditingPost(post);
        setShowEditModal(true);
    };

    const handleOpenComments = (post: Post) => {
        if (post.id) {
            setSelectedPostId(post.id);
            setShowCommentsDrawer(true);
        }
    };

    const handleCloseComments = () => {
        setShowCommentsDrawer(false);
        setSelectedPostId(null);
    };

    // Render empty state
    const renderEmptyState = () => (
        <View style={styles.centerContent}>
            <Surface style={[styles.emptyCard, shadows.soft]}>
                <View style={styles.emptyIconContainer}>
                    <Text style={styles.emptyIcon}>📰</Text>
                </View>
                <Text style={styles.emptyTitle}>Le fil est vide</Text>
                <Text style={styles.emptyDetail}>Soyez le premier à partager une actualité !</Text>
            </Surface>
        </View>
    );

    // Render loading state
    if (isLoading) {
        return (
            <Screen scrollable={false} style={{ backgroundColor: colors.background }}>
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={colors.lilac} />
                    <Text style={styles.loadingText}>Chargement des actualités...</Text>
                </View>
            </Screen>
        );
    }

    return (
        <Screen scrollable={false} style={{ backgroundColor: colors.background }}>
            <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
                <Surface style={[styles.headerSurface, shadows.soft]} elevation={0}>
                    <Text style={[styles.title, { color: colors.text }]}>Actualités</Text>
                </Surface>
            </Animated.View>

            <View style={styles.container}>
                {error && (
                    <View style={styles.centerContent}>
                        <Surface style={styles.errorCard}>
                            <Text style={styles.errorTitle}>Oups !</Text>
                            <Text style={styles.errorDetail}>
                                {error instanceof Error ? error.message : 'Une erreur est survenue'}
                            </Text>
                        </Surface>
                    </View>
                )}
                {(!posts || posts.length === 0) ? (
                    renderEmptyState()
                ) : (
                    <Animated.FlatList
                        data={posts}
                        keyExtractor={(item) => String(item.id)}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: false }
                        )}
                        scrollEventThrottle={16}
                        renderItem={({ item }) => (
                            <PostCardWithComments
                                post={item}
                                author={findAuthor(item.authorId)}
                                location={findLocation(item.locationId)}
                                currentUserId={CURRENT_USER_ID}
                                onCommentPress={() => handleOpenComments(item)}
                                onEditPress={() => handleOpenEdit(item)}
                                onDeletePress={() => handleDeletePost(item)}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            {/* FAB for creating new post */}
            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: colors.primary }]}
                onPress={() => setShowCreateModal(true)}
                color={colors.white}
            />

            {/* Create Post Modal */}
            <CreatePostModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreatePost={handleCreatePost}
                isLoading={createPost.isPending}
                currentUserId={CURRENT_USER_ID}
            />

            {/* Edit Post Modal */}
            <EditPostModal
                visible={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingPost(null);
                }}
                onUpdatePost={handleUpdatePost}
                isLoading={updatePost.isPending}
                post={editingPost}
                location={editingPost?.locationId ? findLocation(editingPost.locationId) ?? null : null}
            />

            {/* Comments Drawer */}
            {selectedPostId && (
                <CommentsDrawer
                    visible={showCommentsDrawer}
                    onClose={handleCloseComments}
                    postId={selectedPostId}
                    currentUserId={CURRENT_USER_ID}
                />
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: spacing.md,
    },
    headerContainer: {
        paddingTop: 16,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.sm,
    },
    headerSurface: {
        borderRadius: borderRadius.lg,
        paddingVertical: 12,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        backgroundColor: colors.card,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: -0.5,
        color: colors.text,
    },


    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    loadingText: {
        marginTop: spacing.md,
        fontSize: 16,
        color: colors.lilac,
    },
    emptyCard: {
        borderRadius: borderRadius.xl,
        backgroundColor: colors.card,
        padding: 40,
        alignItems: 'center',
        marginHorizontal: spacing.md,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.yellow,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    emptyIcon: {
        fontSize: 40,
    },
    emptyTitle: {
        ...typography.titleLarge,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    emptyDetail: {
        ...typography.bodyMedium,
        textAlign: 'center',
    },
    errorCard: {
        borderRadius: borderRadius.lg,
        backgroundColor: colors.card,
        padding: spacing.xl,
        alignItems: 'center',
        marginHorizontal: spacing.md,
    },
    errorTitle: {
        ...typography.titleMedium,
        color: colors.coral,
        marginBottom: spacing.sm,
    },
    errorDetail: {
        ...typography.bodyMedium,
        textAlign: 'center',
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 100, // Space for FAB
    },
    fab: {
        position: 'absolute',
        right: spacing.lg,
        bottom: spacing.lg,
        borderRadius: borderRadius.xl,
    },
});
