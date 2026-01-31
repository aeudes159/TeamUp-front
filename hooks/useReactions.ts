/**
 * Reaction Hooks - Partially refactored
 * 
 * Reactions have a different pattern than standard CRUD:
 * - No update operation
 * - Fetched by message or user, not by ID
 * - Uses parseId/isValidId from shared utils
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { apiGet, apiPost, apiDelete, buildQueryString } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { parseId, isValidId } from '@/lib/utils';
import type {
    Reaction,
    NewReaction,
    ReactionListResponse,
    ReactionResponse,
    PaginationParams
} from '@/types';

// ============================================
// Query Key Helpers
// ============================================

const RESOURCE_NAME = 'reactions';

/** Get query key for reactions */
export function getReactionsQueryKey(suffix?: string | number | Record<string, unknown>) {
    const base: (string | number | Record<string, unknown>)[] = [RESOURCE_NAME];
    if (suffix !== undefined) base.push(suffix);
    return base;
}

/** Invalidate all reaction queries */
export async function invalidateReactionQueries() {
    await queryClient.invalidateQueries({ queryKey: [RESOURCE_NAME] });
}

// ============================================
// Fetch Hooks
// ============================================

/**
 * Fetch reactions for a specific message
 */
export function useReactions(
    messageId: number | string | undefined,
    params: PaginationParams = { page: 0, size: 50 }
) {
    const numericId = parseId(messageId);

    return useQuery({
        queryKey: [RESOURCE_NAME, 'by-message', numericId, params],
        queryFn: async () => {
            const queryString = buildQueryString({
                page: params.page,
                size: params.size,
            });
            const response = await apiGet<ReactionListResponse>(
                `/api/reactions/by-message/${numericId}${queryString}`
            );
            return response;
        },
        enabled: isValidId(numericId),
    });
}

/**
 * Fetch all reactions by a user (useful for notifications)
 */
export function useUserReactions(
    userId: number | string | undefined,
    params: PaginationParams = { page: 0, size: 20 }
) {
    const numericId = parseId(userId);

    return useQuery({
        queryKey: [RESOURCE_NAME, 'by-user', numericId, params],
        queryFn: async () => {
            const queryString = buildQueryString({
                page: params.page,
                size: params.size,
            });
            const response = await apiGet<ReactionListResponse>(
                `/api/reactions/by-user/${numericId}${queryString}`
            );
            return response;
        },
        enabled: isValidId(numericId),
    });
}

// ============================================
// Mutation Hooks
// ============================================

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
                queryKey: [RESOURCE_NAME, 'by-message', variables.messageId]
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
                queryKey: [RESOURCE_NAME, 'by-message', variables.messageId]
            });
        },
    });
}

// ============================================
// Utility Hooks and Functions
// ============================================

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
            hasReacted: (_emoji: string) => false,
            getMyReaction: (_emoji: string) => undefined,
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
