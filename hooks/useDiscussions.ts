/**
 * Discussion Hooks - Refactored using createCrudHooks factory
 * 
 * Demonstrates the reusable hook pattern for Discussion entities.
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { createCrudHooks } from '@/lib/createCrudHooks';
import { apiGet, apiPost, apiPut, apiDelete, buildQueryString } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { parseId, isValidId } from '@/lib/utils';
import type { 
    Discussion, 
    NewDiscussion,
    DiscussionListResponse,
    DiscussionResponse,
    PaginationParams 
} from '@/types';

// ============================================
// Create CRUD Hooks using Factory
// ============================================

const discussionHooks = createCrudHooks<Discussion, NewDiscussion, DiscussionListResponse>({
    resourceName: 'discussions',
    endpoint: '/api/discussions',
});

// ============================================
// Export Individual Hooks
// ============================================

/**
 * Fetch all discussions with pagination
 * 
 * @param params - Pagination parameters
 * @returns Query result with DiscussionListResponse
 */
export function useDiscussions(params: PaginationParams = { page: 0, size: 20 }) {
    return discussionHooks.useList(params);
}

/**
 * Fetch a single discussion by ID
 */
export const useDiscussion = discussionHooks.useById;

/**
 * Create a new discussion
 * Custom implementation to invalidate group-specific queries
 */
export function useCreateDiscussion() {
    return useMutation({
        mutationFn: async (newDiscussion: NewDiscussion) => {
            const response = await apiPost<DiscussionResponse>('/api/discussions', {
                groupId: newDiscussion.groupId,
                backgroundImageUrl: newDiscussion.backgroundImageUrl,
            });
            return response as Discussion;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['discussions'] });
            if (variables.groupId) {
                queryClient.invalidateQueries({ 
                    queryKey: ['discussions', 'group', variables.groupId] 
                });
            }
        },
    });
}

/**
 * Update an existing discussion
 * Custom implementation to invalidate group-specific queries
 */
export function useUpdateDiscussion() {
    return useMutation({
        mutationFn: async ({ 
            id, 
            updates 
        }: { 
            id: number; 
            updates: { groupId?: number; backgroundImageUrl?: string } 
        }) => {
            const response = await apiPut<DiscussionResponse>(`/api/discussions/${id}`, updates);
            return response as Discussion;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['discussions'] });
            queryClient.invalidateQueries({ queryKey: ['discussions', variables.id] });
            if (data.groupId) {
                queryClient.invalidateQueries({ 
                    queryKey: ['discussions', 'group', data.groupId] 
                });
            }
        },
    });
}

/**
 * Delete a discussion
 * Custom implementation to invalidate group-specific queries
 */
export function useDeleteDiscussion() {
    return useMutation({
        mutationFn: async ({ id, groupId }: { id: number; groupId?: number }) => {
            await apiDelete(`/api/discussions/${id}`);
            return { id, groupId };
        },
        onSuccess: (variables) => {
            queryClient.invalidateQueries({ queryKey: ['discussions'] });
            if (variables.groupId) {
                queryClient.invalidateQueries({ 
                    queryKey: ['discussions', 'group', variables.groupId] 
                });
            }
        },
    });
}

// ============================================
// Custom Hooks (domain-specific, not part of factory)
// ============================================

/**
 * Fetch discussions for a specific group
 * 
 * This is a custom endpoint not covered by the factory.
 */
export function useGroupDiscussions(
    groupId: number | string | undefined,
    params: PaginationParams = { page: 0, size: 20 }
) {
    const numericId = parseId(groupId);

    return useQuery({
        queryKey: ['discussions', 'group', numericId, params],
        queryFn: async () => {
            const queryString = buildQueryString({
                page: params.page,
                size: params.size,
            });
            const response = await apiGet<DiscussionListResponse>(
                `/api/discussions/by-group/${numericId}${queryString}`
            );
            return response;
        },
        enabled: isValidId(numericId),
    });
}

// ============================================
// Utility Exports
// ============================================

/** Get query key for discussions */
export const getDiscussionsQueryKey = discussionHooks.getQueryKey;

/** Invalidate all discussion queries */
export const invalidateDiscussionQueries = discussionHooks.invalidateAll;
