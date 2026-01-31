/**
 * User Hooks - Refactored using createCrudHooks factory
 * 
 * Demonstrates the reusable hook pattern for User entities.
 */

import { useQuery } from '@tanstack/react-query';
import { createCrudHooks, createSearchHook } from '@/lib/createCrudHooks';
import { apiGet, buildQueryString } from '@/lib/api';
import type { 
    User, 
    NewUser,
    UserListResponse,
    UserResponse,
    PaginationParams 
} from '@/types';

// ============================================
// Create CRUD Hooks using Factory
// ============================================

const userHooks = createCrudHooks<User, NewUser, UserListResponse>({
    resourceName: 'users',
    endpoint: '/api/users',
});

// ============================================
// Export Individual Hooks
// ============================================

/**
 * Fetch all users with pagination
 * 
 * @param params - Pagination parameters
 * @returns Query result with UserListResponse
 */
export function useUsers(params: PaginationParams = { page: 0, size: 20 }) {
    return userHooks.useList(params);
}

/**
 * Fetch a single user by ID
 */
export const useUser = userHooks.useById;

/**
 * Create a new user
 */
export const useCreateUser = userHooks.useCreate;

/**
 * Update an existing user
 */
export const useUpdateUser = userHooks.useUpdate;

/**
 * Delete a user
 */
export const useDeleteUser = userHooks.useDelete;

// ============================================
// Custom Hooks (domain-specific, not part of factory)
// ============================================

/**
 * Search users by name
 * 
 * @param name - The search query
 * @param params - Pagination parameters
 * @returns Query result with users matching the search
 */
export const useSearchUsers = createSearchHook<User, UserListResponse>({
    resourceName: 'users',
    endpoint: '/api/users',
    searchParam: 'name',
});

/**
 * Fetch user by phone number
 * 
 * This is a custom endpoint not covered by the factory.
 */
export function useUserByPhoneNumber(phoneNumber: string | undefined) {
    return useQuery({
        queryKey: ['users', 'phone', phoneNumber],
        queryFn: async () => {
            const queryString = buildQueryString({ phoneNumber: phoneNumber! });
            const response = await apiGet<UserResponse>(`/api/users/by-phone${queryString}`);
            return response as User;
        },
        enabled: !!phoneNumber,
    });
}

// ============================================
// Utility Exports
// ============================================

/** Get query key for users */
export const getUsersQueryKey = userHooks.getQueryKey;

/** Invalidate all user queries */
export const invalidateUserQueries = userHooks.invalidateAll;
