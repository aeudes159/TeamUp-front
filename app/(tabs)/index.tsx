import React, { useState } from 'react';
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
import { Appbar, Text, FAB, ActivityIndicator } from 'react-native-paper';
import { colors, borderRadius, shadows, typography } from '@/constants/theme';
import { Sparkles, Coffee } from 'lucide-react-native';
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

    // Animation values
    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(50))[0];

    // Entrance animation
    React.useEffect(() => {
        if (!isLoading && posts && posts.length > 0) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isLoading, posts, fadeAnim, slideAnim]);

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

    // Render loading state
    if (isLoading) {
        return (
            <Screen scrollable={false}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Sparkles size={24} color={colors.yellow} />
                        <Text style={styles.headerTitle}>TeamUp</Text>
                        <Sparkles size={24} color={colors.coral} />
                    </View>
                </View>
                <View style={styles.loadingContainer}>
                    <View style={styles.loadingIconContainer}>
                        <ActivityIndicator size="large" color={colors.lilac} />
                    </View>
                    <Text style={styles.loadingText}>
                        Chargement des activités...
                    </Text>
                </View>
            </Screen>
        );
    }

    return (
        <Screen scrollable={false}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Sparkles size={24} color={colors.yellow} />
                    <Text style={styles.headerTitle}>TeamUp</Text>
                    <Sparkles size={24} color={colors.coral} />
                </View>
            </View>

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
                    <Animated.View
                        style={[
                            styles.listContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <FlatList
                            data={posts}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={({ item, index }) => (
                                <Animated.View
                                    style={{
                                        opacity: fadeAnim,
                                        transform: [
                                            {
                                                translateY: slideAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0, 20 * index],
                                                }),
                                            },
                                        ],
                                    }}
                                >
                                    <PostCardWithComments
                                        post={item}
                                        author={findAuthor(item.authorId)}
                                        location={findLocation(item.locationId)}
                                        currentUserId={CURRENT_USER_ID}
                                        onCommentPress={() => handleOpenComments(item)}
                                        onEditPress={() => handleOpenEdit(item)}
                                        onDeletePress={() => handleDeletePost(item)}
                                    />
                                </Animated.View>
                            )}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    </Animated.View>
                )}
            </View>

            {/* FAB for creating new post */}
            <Animated.View
                style={[
                    styles.fab,
                    {
                        opacity: fadeAnim,
                        transform: [
                            {
                                scale: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.8, 1],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <FAB
                    icon="plus"
                    style={styles.fabButton}
                    onPress={() => setShowCreateModal(true)}
                    color="#ffffff"
                />
            </Animated.View>

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
        backgroundColor: colors.background,
    },
    listContainer: {
        flex: 1,
    },
    header: {
        backgroundColor: colors.background,
        paddingTop: 16,
        paddingBottom: 8,
        paddingHorizontal: 20,
        ...shadows.soft,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    headerTitle: {
        ...typography.titleLarge,
        color: colors.card,
        fontWeight: '700',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
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
        marginTop: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    errorContainer: {
        padding: 16,
        backgroundColor: '#fee2e2',
        margin: 16,
        borderRadius: borderRadius.lg,
    },
    errorText: {
        color: '#dc2626',
        textAlign: 'center',
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: 100,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
    fabButton: {
        backgroundColor: colors.coral,
        borderRadius: borderRadius.pill,
        ...shadows.warm,
    },
});
