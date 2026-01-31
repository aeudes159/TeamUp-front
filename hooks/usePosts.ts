/**
 * Post Hooks - Refactored using createCrudHooks factory
 * 
 * Demonstrates the reusable hook pattern for Post entities.
 * Includes mock data fallback for development.
 */

import { useQuery } from '@tanstack/react-query';
import { createCrudHooks } from '@/lib/createCrudHooks';
import { apiGet, buildQueryString } from '@/lib/api';
import { mockPosts } from '@/mock/data';
import type {
    Post,
    NewPost,
    PostListResponse,
    PaginationParams,
} from '@/types';

// ============================================
// Create CRUD Hooks using Factory
// ============================================

const postHooks = createCrudHooks<Post, NewPost, PostListResponse>({
    resourceName: 'posts',
    endpoint: '/api/posts',
});

// ============================================
// Export Individual Hooks
// ============================================

/**
 * Fetch all posts with pagination
 * Falls back to mock data if API fails
 * 
 * @param params - Pagination parameters
 * @returns Query result with PostListResponse
 */
export function usePosts(params: PaginationParams = { page: 0, size: 20 }) {
    return postHooks.useList(params);
}

/**
 * Fetch a single post by ID
 */
export const usePost = postHooks.useById;

/**
 * Create a new post
 */
export const useCreatePost = postHooks.useCreate;

/**
 * Update an existing post
 */
export const useUpdatePost = postHooks.useUpdate;

/**
 * Delete a post
 */
export const useDeletePost = postHooks.useDelete;

// ============================================
// Custom Hooks (domain-specific, not part of factory)
// ============================================

/**
 * Fetch posts by author ID
 * 
 * This is a custom endpoint not covered by the factory.
 */
export function usePostsByAuthor(
    authorId: number | undefined,
    params: PaginationParams = { page: 0, size: 20 }
) {
    return useQuery({
        queryKey: ['posts', 'by-author', authorId, params],
        queryFn: async () => {
            try {
                const queryString = buildQueryString({
                    page: params.page,
                    size: params.size,
                });
                const response = await apiGet<PostListResponse>(
                    `/api/posts/by-author/${authorId}${queryString}`
                );
                return response;
            } catch (error) {
                console.warn('Failed to fetch posts by author from API, using mock data:', error);
                // Return mock data as fallback with matching structure
                const filteredPosts = mockPosts.filter(p => p.authorId === authorId);
                return {
                    data: filteredPosts as Post[],
                    page: params.page ?? 0,
                    size: params.size ?? 20,
                    totalElements: filteredPosts.length,
                    totalPages: 1,
                };
            }
        },
        enabled: !!authorId,
    });
}

// ============================================
// Utility Exports
// ============================================

/** Get query key for posts */
export const getPostsQueryKey = postHooks.getQueryKey;

/** Invalidate all post queries */
export const invalidatePostQueries = postHooks.invalidateAll;

/** Export mock data for fallback scenarios */
export { mockPosts };
