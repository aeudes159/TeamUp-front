import { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { PostCard } from '@/components/feed/PostCard';
import { CreatePostModal } from '@/components/feed/CreatePostModal';
import { EditPostModal } from '@/components/feed/EditPostModal';
import { CommentsDrawer } from '@/components/feed/CommentsDrawer';
import { usePosts, useCreatePost, useUpdatePost, useDeletePost } from '@/hooks/usePosts';
import { useCommentCount } from '@/hooks/useComments';
import { useUsers } from '@/hooks/useUsers';
import { useLocations } from '@/hooks/useLocations';
import { Appbar, Text, FAB, ActivityIndicator } from 'react-native-paper';
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
    const { data: posts, isLoading, error } = usePosts();
    const { data: users = [] } = useUsers({ page: 0, size: 100 });
    const { data: locations = [] } = useLocations({ page: 0, size: 100 });
    
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
        <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
                No posts yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
                Be the first to share something with your team!
            </Text>
        </View>
    );

    // Render loading state
    if (isLoading) {
        return (
            <Screen scrollable={false}>
                <Appbar.Header>
                    <Appbar.Content title="Feed" />
                </Appbar.Header>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6366f1" />
                    <Text variant="bodyMedium" style={styles.loadingText}>
                        Loading posts...
                    </Text>
                </View>
            </Screen>
        );
    }

    return (
        <Screen scrollable={false}>
            <Appbar.Header>
                <Appbar.Content title="Feed" />
            </Appbar.Header>

            <View style={styles.container}>
                {error && (
                    <View style={styles.errorContainer}>
                        <Text variant="bodyMedium" style={styles.errorText}>
                            Error loading posts: {error.message}
                        </Text>
                    </View>
                )}

                {(!posts || posts.length === 0) ? (
                    renderEmptyState()
                ) : (
                    <FlatList
                        data={posts}
                        keyExtractor={(item) => String(item.id)}
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
                style={styles.fab}
                onPress={() => setShowCreateModal(true)}
                color="#ffffff"
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
                location={editingPost?.locationId ? findLocation(editingPost.locationId) : null}
            />

            {/* Comments Drawer (slides from right) */}
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
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: '#6b7280',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    listContent: {
        flexGrow: 1,
        paddingBottom: 80, // Space for FAB
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#6366f1',
    },
});
