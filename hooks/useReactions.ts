import { useQuery, useMutation } from '@tanstack/react-query';
import { apiGet, apiPost, apiDelete, buildQueryString } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import type {
  Reaction,
  NewReaction,
  ReactionListResponse,
  ReactionResponse,
  PaginationParams
} from '@/types';

/**
 * Fetch reactions for a specific message
 */
export function useReactions(
  messageId: number | undefined,
  params: PaginationParams = { page: 0, size: 50 }
) {
  return useQuery({
    queryKey: ['reactions', 'by-message', messageId, params],
    queryFn: async () => {
      const queryString = buildQueryString({
        page: params.page,
        size: params.size,
      });
      const response = await apiGet<ReactionListResponse>(
        `/api/reactions/by-message/${messageId}${queryString}`
      );
      return response.data as Reaction[];
    },
    enabled: !!messageId,
  });
}

/**
 * Fetch all reactions by a user (useful for notifications)
 */
export function useUserReactions(
  userId: number | undefined,
  params: PaginationParams = { page: 0, size: 20 }
) {
  return useQuery({
    queryKey: ['reactions', 'by-user', userId, params],
    queryFn: async () => {
      const queryString = buildQueryString({
        page: params.page,
        size: params.size,
      });
      const response = await apiGet<ReactionListResponse>(
        `/api/reactions/by-user/${userId}${queryString}`
      );
      return response.data as Reaction[];
    },
    enabled: !!userId,
  });
}

/**
 * Add a reaction to a message
 */
export function useAddReaction() {
  return useMutation({
    mutationFn: async (newReaction: NewReaction) => {
      const response = await apiPost<ReactionResponse>('/api/reactions', {
        emoji: newReaction.emoji,
        userId: newReaction.userId,
        messageId: newReaction.messageId,
      });
      return response as Reaction;
    },
    onSuccess: (_, variables) => {
      // Invalidate reactions for this message
      queryClient.invalidateQueries({
        queryKey: ['reactions', 'by-message', variables.messageId]
      });
    },
  });
}

/**
 * Remove a reaction
 */
export function useRemoveReaction() {
  return useMutation({
    mutationFn: async ({ id, messageId }: { id: number; messageId: number }) => {
      await apiDelete(`/api/reactions/${id}`);
      return { id, messageId };
    },
    onSuccess: (variables) => {
      // Invalidate reactions for this message
      queryClient.invalidateQueries({
        queryKey: ['reactions', 'by-message', variables.messageId]
      });
    },
  });
}

/**
 * Check if current user has reacted to a message with a specific emoji
 */
export function useMyReactionOnMessage(
  messageId: number | undefined,
  userId: number | undefined,
  reactions: Reaction[] | undefined
) {
  if (!messageId || !userId || !reactions) {
    return {
      hasReacted: (emoji: string) => false,
      getMyReaction: (emoji: string) => undefined,
    };
  }

  const hasReacted = (emoji: string) => {
    return reactions.some(r => r.userId === userId && r.emoji === emoji);
  };

  const getMyReaction = (emoji: string) => {
    return reactions.find(r => r.userId === userId && r.emoji === emoji);
  };

  return { hasReacted, getMyReaction };
}

/**
 * Group reactions by emoji for display
 */
export function groupReactionsByEmoji(reactions: Reaction[]): Map<string, Reaction[]> {
  const grouped = new Map<string, Reaction[]>();

  for (const reaction of reactions) {
    const existing = grouped.get(reaction.emoji) || [];
    existing.push(reaction);
    grouped.set(reaction.emoji, existing);
  }

  return grouped;
}
