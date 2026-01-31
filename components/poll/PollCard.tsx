import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Text, ProgressBar, Button, Chip } from 'react-native-paper';
import { MapPin, Plus, Check, Lock } from 'lucide-react-native';
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
              <MapPin size={14} color={isClosed ? '#9ca3af' : '#6366f1'} />
              <Text variant="bodyMedium" style={[styles.locationName, isClosed && styles.textMuted]}>
                {option.locationName || 'Unknown location'}
              </Text>
            </View>
            {hasVoted && (
              <Chip
                icon={() => <Check size={12} color="#fff" />}
                style={[styles.votedChip, isClosed && styles.votedChipClosed]}
                textStyle={styles.votedChipText}
              >
                Voted
              </Chip>
            )}
          </View>
          {option.locationAddress && (
            <Text variant="bodySmall" style={styles.locationAddress}>
              {option.locationAddress}
            </Text>
          )}
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={votePercentage}
              color={hasVoted ? (isClosed ? '#9ca3af' : '#6366f1') : '#94a3b8'}
              style={styles.progressBar}
            />
            <Text variant="bodySmall" style={styles.voteCount}>
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
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text variant="titleMedium" style={styles.title}>
              {poll.title}
            </Text>
            {isClosed && (
              <Chip
                icon={() => <Lock size={12} color="#fff" />}
                style={styles.closedChip}
                textStyle={styles.closedChipText}
              >
                Closed
              </Chip>
            )}
          </View>
          <Text variant="bodySmall" style={styles.date}>
            {isClosed
              ? `Closed ${formatDate(poll.closedAt)}`
              : formatDate(poll.createdAt)
            }
          </Text>
        </View>

        {poll.description && (
          <Text variant="bodyMedium" style={styles.description}>
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
            <Plus size={18} color="#6366f1" />
            <Text style={styles.addOptionText}>Add a location</Text>
          </TouchableOpacity>
        )}

        <Text variant="bodySmall" style={styles.totalVotes}>
          {poll.totalVotes} total vote{poll.totalVotes !== 1 ? 's' : ''}
        </Text>

        {!isClosed && onClosePoll && (
          <Button
            mode="outlined"
            onPress={() => poll.id && onClosePoll(poll.id)}
            style={styles.closeButton}
            textColor="#ef4444"
            icon={() => <Lock size={16} color="#ef4444" />}
          >
            Close Poll
          </Button>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  header: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
  },
  closedChip: {
    backgroundColor: '#ef4444',
    marginLeft: 8,
  },
  closedChipText: {
    color: '#ffffff',
    fontSize: 10,
  },
  date: {
    color: '#6b7280',
    marginTop: 4,
  },
  description: {
    color: '#4b5563',
    marginBottom: 12,
  },
  optionsList: {
    marginTop: 8,
  },
  optionContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  optionContainerClosed: {
    opacity: 0.7,
  },
  optionContent: {
    flexDirection: 'row',
    padding: 12,
  },
  locationImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
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
    fontWeight: '600',
    marginLeft: 4,
    flex: 1,
  },
  textMuted: {
    color: '#6b7280',
  },
  votedChip: {
    backgroundColor: '#6366f1',
    height: 24,
  },
  votedChipClosed: {
    backgroundColor: '#9ca3af',
  },
  votedChipText: {
    color: '#ffffff',
    fontSize: 10,
  },
  locationAddress: {
    color: '#6b7280',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e2e8f0',
  },
  voteCount: {
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'right',
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#6366f1',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginTop: 8,
  },
  addOptionText: {
    color: '#6366f1',
    marginLeft: 8,
    fontWeight: '500',
  },
  totalVotes: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
  },
  closeButton: {
    marginTop: 12,
    borderColor: '#ef4444',
  },
});
