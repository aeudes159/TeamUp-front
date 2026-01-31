/**
 * Group Hooks - Refactored using createCrudHooks factory
 * 
 * Demonstrates the reusable hook pattern for Group entities.
 */

import { useQuery } from '@tanstack/react-query';
import { createCrudHooks } from '@/lib/createCrudHooks';
import { apiGet, buildQueryString } from '@/lib/api';
import type { 
    Group, 
    NewGroup,
    GroupListResponse,
    PaginationParams,
} from '@/types';

// ============================================
// Create CRUD Hooks using Factory
// ============================================

const groupHooks = createCrudHooks<Group, NewGroup, GroupListResponse>({
    resourceName: 'groups',
    endpoint: '/api/groups',
});

// ============================================
// Export Individual Hooks
// ============================================

/**
 * Fetch all groups with pagination
 * 
 * @param params - Pagination parameters
 * @returns Query result with GroupListResponse
 */
export function useGroups(params: PaginationParams = { page: 0, size: 20 }) {
    return groupHooks.useList(params);
}

/**
 * Fetch a single group by ID
 */
export const useGroup = groupHooks.useById;

/**
 * Create a new group
 */
export const useCreateGroup = groupHooks.useCreate;

/**
 * Update an existing group
 */
export const useUpdateGroup = groupHooks.useUpdate;

/**
 * Delete a group
 */
export const useDeleteGroup = groupHooks.useDelete;

// ============================================
// Custom Hooks (domain-specific, not part of factory)
// ============================================

/**
 * Fetch public groups with pagination
 * 
 * This is a custom endpoint not covered by the factory.
 */
export function usePublicGroups(params: PaginationParams = { page: 0, size: 20 }) {
    return useQuery({
        queryKey: ['groups', 'public', params],
        queryFn: async () => {
            const queryString = buildQueryString({
                page: params.page,
                size: params.size,
            });
            const response = await apiGet<GroupListResponse>(`/api/groups/public${queryString}`);
            return response;
        },
    });
}

// ============================================
// Utility Exports
// ============================================

/** Get query key for groups */
export const getGroupsQueryKey = groupHooks.getQueryKey;

/** Invalidate all group queries */
export const invalidateGroupQueries = groupHooks.invalidateAll;
