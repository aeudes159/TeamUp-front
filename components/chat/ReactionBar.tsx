import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import type { Reaction } from '@/types';
import { groupReactionsByEmoji } from '@/hooks/useReactions';

type ReactionBarProps = {
  reactions: Reaction[];
  currentUserId: number;
  onReactionPress: (emoji: string, userReaction?: Reaction) => void;
};

export function ReactionBar({ reactions, currentUserId, onReactionPress }: Readonly<ReactionBarProps>) {
  if (reactions.length === 0) {
    return null;
  }

  const groupedReactions = groupReactionsByEmoji(reactions);

  return (
    <View style={styles.container}>
      {Array.from(groupedReactions.entries()).map(([emoji, reactionList]) => {
        const userReaction = reactionList.find(r => r.userId === currentUserId);
        const hasUserReacted = !!userReaction;

        return (
          <TouchableOpacity
            key={emoji}
            onPress={() => onReactionPress(emoji, userReaction)}
            style={[
              styles.reactionChip,
              hasUserReacted && styles.reactionChipActive
            ]}
          >
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={[
              styles.count,
              hasUserReacted && styles.countActive
            ]}>
              {reactionList.length}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 4,
  },
  reactionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  reactionChipActive: {
    backgroundColor: '#ede9fe',
    borderColor: '#6366f1',
  },
  emoji: {
    fontSize: 14,
  },
  count: {
    fontSize: 12,
    marginLeft: 4,
    color: '#6b7280',
  },
  countActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
});
