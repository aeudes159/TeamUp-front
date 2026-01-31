import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Surface, Text, ProgressBar, Button, Chip } from 'react-native-paper';
import { MapPin, Plus, Check, Lock } from 'lucide-react-native';
import { colors, shadows, borderRadius, spacing, typography } from '@/constants/theme';
import type { Poll, PollOption } from '@/types';

type PollCardProps = {
  poll: Poll;
  currentUserId: number;
  onVote: (optionId: number) => void;
  onRemoveVote: (optionId: number) => void;
  onAddOption: (pollId: number) => void;
  onClosePoll?: (pollId: number) => void;
};

type PollOptionItemProps = {
  option: PollOption;
  totalVotes: number;
  currentUserId: number;
  isClosed: boolean;
  onVote: (optionId: number) => void;
  onRemoveVote: (optionId: number) => void;
};

function PollOptionItem({
  option,
  totalVotes,
  currentUserId,
  isClosed,
  onVote,
  onRemoveVote,
}: Readonly<PollOptionItemProps>) {
  const hasVoted = option.voters.some((v) => v.userId === currentUserId);
  const votePercentage = totalVotes > 0 ? option.voteCount / totalVotes : 0;

  const handlePress = () => {
    if (option.id === null || isClosed) return;
    if (hasVoted) {
      onRemoveVote(option.id);
    } else {
      onVote(option.id);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.optionContainer, isClosed && styles.optionContainerClosed]}
      disabled={isClosed}
    >
      <View style={styles.optionContent}>
        {option.locationPictureUrl && (
          <Image
            source={{ uri: option.locationPictureUrl }}
            style={styles.locationImage}
          />
        )}
        <View style={styles.optionInfo}>
          <View style={styles.optionHeader}>
            <View style={styles.locationNameRow}>
              <MapPin size={14} color={isClosed ? colors.textLight : colors.primary} />
              <Text style={[typography.bodyMedium, styles.locationName, isClosed && styles.textMuted]}>
                {option.locationName || 'Unknown location'}
              </Text>
            </View>
            {hasVoted && (
              <Chip
                icon={() => <Check size={12} color={colors.white} />}
                style={[styles.votedChip, isClosed && styles.votedChipClosed]}
                textStyle={styles.votedChipText}
              >
                Voted
              </Chip>
            )}
          </View>
          {option.locationAddress && (
            <Text style={[typography.bodySmall, styles.locationAddress]}>
              {option.locationAddress}
            </Text>
          )}
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={votePercentage}
              color={hasVoted ? (isClosed ? colors.textLight : colors.primary) : colors.lilac}
              style={styles.progressBar}
            />
            <Text style={[typography.bodySmall, styles.voteCount]}>
              {option.voteCount} vote{option.voteCount !== 1 ? 's' : ''} (
              {Math.round(votePercentage * 100)}%)
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function PollCard({
  poll,
  currentUserId,
  onVote,
  onRemoveVote,
  onAddOption,
  onClosePoll,
}: Readonly<PollCardProps>) {
  const isClosed = poll.closedAt !== null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Surface style={[styles.card, shadows.soft]} elevation={0}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[typography.titleMedium, styles.title]}>
              {poll.title}
            </Text>
            {isClosed && (
              <Chip
                icon={() => <Lock size={12} color={colors.white} />}
                style={styles.closedChip}
                textStyle={styles.closedChipText}
              >
                Closed
              </Chip>
            )}
          </View>
          <Text style={[typography.bodySmall, styles.date]}>
            {isClosed
              ? `Closed ${formatDate(poll.closedAt)}`
              : formatDate(poll.createdAt)
            }
          </Text>
        </View>

        {poll.description && (
          <Text style={[typography.bodyMedium, styles.description]}>
            {poll.description}
          </Text>
        )}

        <View style={styles.optionsList}>
          {poll.options.map((option) => (
            <PollOptionItem
              key={option.id}
              option={option}
              totalVotes={poll.totalVotes}
              currentUserId={currentUserId}
              isClosed={isClosed}
              onVote={onVote}
              onRemoveVote={onRemoveVote}
            />
          ))}
        </View>

        {!isClosed && (
          <TouchableOpacity
            style={styles.addOptionButton}
            onPress={() => poll.id && onAddOption(poll.id)}
          >
            <Plus size={18} color={colors.primary} />
            <Text style={styles.addOptionText}>Add a location</Text>
          </TouchableOpacity>
        )}

        <Text style={[typography.bodySmall, styles.totalVotes]}>
          {poll.totalVotes} total vote{poll.totalVotes !== 1 ? 's' : ''}
        </Text>

        {!isClosed && onClosePoll && (
          <Button
            mode="outlined"
            onPress={() => poll.id && onClosePoll(poll.id)}
            style={styles.closeButton}
            textColor={colors.coral}
            icon={() => <Lock size={16} color={colors.coral} />}
          >
            Close Poll
          </Button>
        )}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  cardContent: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    flex: 1,
  },
  closedChip: {
    backgroundColor: colors.coral,
    marginLeft: spacing.sm,
    height: 24,
  },
  closedChipText: {
    color: colors.white,
    fontSize: 10,
  },
  date: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  description: {
    color: colors.text,
    marginBottom: spacing.md,
  },
  optionsList: {
    marginTop: spacing.sm,
  },
  optionContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  optionContainerClosed: {
    opacity: 0.7,
  },
  optionContent: {
    flexDirection: 'row',
    padding: spacing.sm,
  },
  locationImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  optionInfo: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  locationNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationName: {
    color: colors.text,
    marginLeft: 4,
    flex: 1,
  },
  textMuted: {
    color: colors.textLight,
  },
  votedChip: {
    backgroundColor: colors.primary,
    height: 24,
  },
  votedChipClosed: {
    backgroundColor: colors.textLight,
  },
  votedChipText: {
    color: colors.white,
    fontSize: 10,
  },
  locationAddress: {
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cardLight,
  },
  voteCount: {
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'right',
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  addOptionText: {
    color: colors.primary,
    marginLeft: 8,
    fontWeight: '500',
  },
  totalVotes: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  closeButton: {
    marginTop: spacing.md,
    borderColor: colors.coral,
  },
});
