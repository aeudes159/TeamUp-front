import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { ReactionBar } from '@/components/chat/ReactionBar';
import type { Comment, Reaction, User } from '@/types';

type CommentItemProps = {
  comment: Comment;
  author?: User;
  currentUserId: number;
  reactions: Reaction[];
  onReactionPress: (emoji: string, userReaction?: Reaction) => void;
  onLongPress?: () => void;
  onDelete?: () => void;
  isAuthor?: boolean;
};

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function CommentItem({
  comment,
  author,
  currentUserId,
  reactions,
  onReactionPress,
  onLongPress,
  onDelete,
  isAuthor = false,
}: Readonly<CommentItemProps>) {
  const avatarUrl = author?.profilePictureUrl || `https://i.pravatar.cc/150?u=${comment.authorId}`;
  const displayName = author 
    ? `${author.firstName || ''} ${author.lastName || ''}`.trim() || `User ${comment.authorId}`
    : `User ${comment.authorId}`;

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      delayLongPress={300}
      activeOpacity={0.8}
      style={styles.container}
    >
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.authorInfo}>
            <Text variant="labelMedium" style={styles.authorName}>
              {displayName}
            </Text>
            <Text variant="bodySmall" style={styles.timestamp}>
              {formatRelativeTime(comment.createdAt)}
            </Text>
          </View>
          
          {isAuthor && onDelete && (
            <IconButton
              icon="delete-outline"
              size={16}
              iconColor="#9ca3af"
              onPress={onDelete}
              style={styles.deleteButton}
            />
          )}
        </View>
        
        <Text variant="bodyMedium" style={styles.commentText}>
          {comment.content}
        </Text>
        
        {reactions.length > 0 && (
          <ReactionBar
            reactions={reactions}
            currentUserId={currentUserId}
            onReactionPress={onReactionPress}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorName: {
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 8,
  },
  timestamp: {
    color: '#9ca3af',
  },
  deleteButton: {
    margin: -8,
  },
  commentText: {
    color: '#374151',
    lineHeight: 20,
  },
});
