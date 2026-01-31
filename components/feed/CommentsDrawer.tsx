import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, Surface, IconButton, ActivityIndicator } from 'react-native-paper';
import { MessageCircle } from 'lucide-react-native';
import { CommentItem } from './CommentItem';
import { CommentInput } from './CommentInput';
import { ReactionPicker } from '@/components/chat/ReactionPicker';
import { useComments, useCreateComment, useDeleteComment } from '@/hooks/useComments';
import {
  useCommentReactions,
  useAddCommentReaction,
  useRemoveCommentReaction,
  groupReactionsByEmoji,
} from '@/hooks/useReactions';
import { useUsers } from '@/hooks/useUsers';
import type { Comment, Reaction, User } from '@/types';

const DRAWER_WIDTH = Dimensions.get('window').width * 0.85;
const MAX_DRAWER_WIDTH = 400;

type CommentsDrawerProps = {
  visible: boolean;
  onClose: () => void;
  postId: number;
  currentUserId: number;
};

type CommentWithReactions = {
  comment: Comment;
  reactions: Reaction[];
};

function CommentItemWithReactions({
  comment,
  currentUserId,
  users,
  onDelete,
}: {
  comment: Comment;
  currentUserId: number;
  users: User[];
  onDelete: (id: number) => void;
}) {
  const { data: reactions = [] } = useCommentReactions(comment.id ?? undefined);
  const addReaction = useAddCommentReaction();
  const removeReaction = useRemoveCommentReaction();
  const [showPicker, setShowPicker] = useState(false);

  const author = users.find(u => u.id === comment.authorId);
  const isAuthor = comment.authorId === currentUserId;

  const handleReactionPress = (emoji: string, userReaction?: Reaction) => {
    if (!comment.id) return; // Guard against null comment id
    
    if (userReaction && userReaction.id) {
      // Remove reaction
      removeReaction.mutate({
        id: userReaction.id,
        commentId: comment.id,
      });
    } else {
      // Add reaction
      addReaction.mutate({
        emoji,
        userId: currentUserId,
        commentId: comment.id,
      });
    }
  };

  const handleSelectEmoji = (emoji: string) => {
    if (!comment.id) return; // Guard against null comment id
    
    // Check if user already has this reaction
    const existingReaction = reactions.find(
      r => r.userId === currentUserId && r.emoji === emoji
    );
    
    if (existingReaction && existingReaction.id) {
      removeReaction.mutate({
        id: existingReaction.id,
        commentId: comment.id,
      });
    } else {
      addReaction.mutate({
        emoji,
        userId: currentUserId,
        commentId: comment.id,
      });
    }
    setShowPicker(false);
  };

  return (
    <>
      <CommentItem
        comment={comment}
        author={author}
        currentUserId={currentUserId}
        reactions={reactions}
        onReactionPress={handleReactionPress}
        onLongPress={() => setShowPicker(true)}
        onDelete={isAuthor ? () => onDelete(comment.id!) : undefined}
        isAuthor={isAuthor}
      />
      {showPicker && (
        <ReactionPicker
          onSelectEmoji={handleSelectEmoji}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}

export function CommentsDrawer({
  visible,
  onClose,
  postId,
  currentUserId,
}: Readonly<CommentsDrawerProps>) {
  const slideAnim = useState(new Animated.Value(DRAWER_WIDTH))[0];
  const { data: comments = [], isLoading, refetch } = useComments(postId);
  const { data: users = [] } = useUsers();
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleAddComment = (content: string) => {
    createComment.mutate({
      content,
      authorId: currentUserId,
      postId,
    });
  };

  const handleDeleteComment = (commentId: number) => {
    deleteComment.mutate({ id: commentId, postId });
  };

  const drawerWidth = Math.min(DRAWER_WIDTH, MAX_DRAWER_WIDTH);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Drawer */}
        <Animated.View
          style={[
            styles.drawer,
            { width: drawerWidth },
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.drawerContent}
          >
            <Surface style={styles.surface} elevation={5}>
              {/* Header */}
              <View style={styles.header}>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={onClose}
                  style={styles.closeButton}
                />
                <Text variant="titleMedium" style={styles.title}>
                  Comments
                </Text>
                <View style={styles.headerSpacer} />
              </View>

              {/* Comments List */}
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#6366f1" />
                  <Text style={styles.loadingText}>Loading comments...</Text>
                </View>
              ) : comments.length > 0 ? (
                <FlatList
                  data={comments}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => (
                    <CommentItemWithReactions
                      comment={item}
                      currentUserId={currentUserId}
                      users={users}
                      onDelete={handleDeleteComment}
                    />
                  )}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <MessageCircle size={48} color="#d1d5db" />
                  <Text variant="bodyLarge" style={styles.emptyText}>
                    No comments yet
                  </Text>
                  <Text variant="bodySmall" style={styles.emptySubtext}>
                    Be the first to comment!
                  </Text>
                </View>
              )}

              {/* Comment Input */}
              <CommentInput
                onSubmit={handleAddComment}
                isLoading={createComment.isPending}
              />
            </Surface>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  drawerContent: {
    flex: 1,
  },
  surface: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    margin: 0,
  },
  title: {
    flex: 1,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 48,
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
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
});
