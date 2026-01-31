import { useQuery, useMutation } from '@tanstack/react-query';
import { apiGet, apiPost, apiPut, apiDelete, buildQueryString } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { mockPosts } from '@/mock/data';
import type {
  Post,
  NewPost,
  PostResponse,
  PostListResponse,
  PostCreateRequest,
  PostUpdateRequest,
  PaginationParams,
} from '@/types';

/**
 * Fetch all posts with pagination
 * Falls back to mock data if API fails
 */
export function usePosts(params: PaginationParams = { page: 0, size: 20 }) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: async () => {
      try {
        const queryString = buildQueryString({
          page: params.page,
          size: params.size,
        });
        const response = await apiGet<PostListResponse>(`/api/posts${queryString}`);
        return response.data as Post[];
      } catch (error) {
        console.warn('Failed to fetch posts from API, using mock data:', error);
        // Return mock data as fallback
        return mockPosts as Post[];
      }
    },
  });
}

/**
 * Fetch a single post by ID
 */
export function usePost(id: number | string | undefined) {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

  return useQuery({
    queryKey: ['posts', numericId],
    queryFn: async () => {
      try {
        const response = await apiGet<PostResponse>(`/api/posts/${numericId}`);
        return response as Post;
      } catch (error) {
        console.warn('Failed to fetch post from API, using mock data:', error);
        const post = mockPosts.find(p => p.id === numericId);
        if (!post) throw new Error(`Post with id ${numericId} not found`);
        return post as Post;
      }
    },
    enabled: !!numericId && !isNaN(numericId),
  });
}

/**
 * Fetch posts by author ID
 */
export function usePostsByAuthor(authorId: number | undefined, params: PaginationParams = { page: 0, size: 20 }) {
  return useQuery({
    queryKey: ['posts', 'by-author', authorId, params],
    queryFn: async () => {
      try {
        const queryString = buildQueryString({
          page: params.page,
          size: params.size,
        });
        const response = await apiGet<PostListResponse>(`/api/posts/by-author/${authorId}${queryString}`);
        return response.data as Post[];
      } catch (error) {
        console.warn('Failed to fetch posts by author from API, using mock data:', error);
        return mockPosts.filter(p => p.authorId === authorId) as Post[];
      }
    },
    enabled: !!authorId,
  });
}

/**
 * Create a new post
 */
export function useCreatePost() {
  return useMutation({
    mutationFn: async (newPost: NewPost) => {
      const request: PostCreateRequest = {
        content: newPost.content,
        imageUrl: newPost.imageUrl,
        authorId: newPost.authorId,
        locationId: newPost.locationId,
        discussionId: newPost.discussionId,
      };
      const response = await apiPost<PostResponse>('/api/posts', request);
      return response as Post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

/**
 * Update an existing post
 */
export function useUpdatePost() {
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<NewPost>) => {
      const request: PostUpdateRequest = {
        content: updates.content,
        imageUrl: updates.imageUrl,
        locationId: updates.locationId,
      };
      const response = await apiPut<PostResponse>(`/api/posts/${id}`, request);
      return response as Post;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', variables.id] });
    },
  });
}

/**
 * Delete a post
 */
export function useDeletePost() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiDelete(`/api/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
