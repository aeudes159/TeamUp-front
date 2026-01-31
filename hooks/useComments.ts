import { useQuery, useMutation } from '@tanstack/react-query';
import { apiGet, apiPost, apiPut, apiDelete, buildQueryString } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import type {
  Comment,
  NewComment,
  CommentResponse,
  CommentListResponse,
  CommentCreateRequest,
  CommentUpdateRequest,
  PaginationParams,
} from '@/types';

/**
 * Fetch comments for a specific post
 */
export function useComments(postId: number | undefined, params: PaginationParams = { page: 0, size: 50 }) {
  return useQuery({
    queryKey: ['comments', 'by-post', postId, params],
    queryFn: async () => {
      const queryString = buildQueryString({
        page: params.page,
        size: params.size,
      });
      const response = await apiGet<CommentListResponse>(`/api/comments/by-post/${postId}${queryString}`);
      return response.data as Comment[];
    },
    enabled: !!postId,
  });
}

/**
 * Fetch a single comment by ID
 */
export function useComment(id: number | undefined) {
  return useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const response = await apiGet<CommentResponse>(`/api/comments/${id}`);
      return response as Comment;
    },
    enabled: !!id,
  });
}

/**
 * Get comment count for a post
 */
export function useCommentCount(postId: number | undefined) {
  return useQuery({
    queryKey: ['comments', 'count', postId],
    queryFn: async () => {
      const response = await apiGet<number>(`/api/comments/count/by-post/${postId}`);
      return response;
    },
    enabled: !!postId,
  });
}

/**
 * Create a new comment
 */
export function useCreateComment() {
  return useMutation({
    mutationFn: async (newComment: NewComment) => {
      const request: CommentCreateRequest = {
        content: newComment.content,
        authorId: newComment.authorId,
        postId: newComment.postId,
      };
      const response = await apiPost<CommentResponse>('/api/comments', request);
      return response as Comment;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', 'by-post', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['comments', 'count', variables.postId] });
    },
  });
}

/**
 * Update an existing comment
 */
export function useUpdateComment() {
  return useMutation({
    mutationFn: async ({ id, postId, content }: { id: number; postId: number; content: string }) => {
      const request: CommentUpdateRequest = { content };
      const response = await apiPut<CommentResponse>(`/api/comments/${id}`, request);
      return { comment: response as Comment, postId };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['comments', 'by-post', result.postId] });
      queryClient.invalidateQueries({ queryKey: ['comments', result.comment.id] });
    },
  });
}

/**
 * Delete a comment
 */
export function useDeleteComment() {
  return useMutation({
    mutationFn: async ({ id, postId }: { id: number; postId: number }) => {
      await apiDelete(`/api/comments/${id}`);
      return { postId };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['comments', 'by-post', result.postId] });
      queryClient.invalidateQueries({ queryKey: ['comments', 'count', result.postId] });
    },
  });
}
