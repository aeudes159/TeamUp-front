import { useQuery, useMutation } from '@tanstack/react-query';
import { apiGet, apiPost, apiPut, apiDelete, buildQueryString } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import type { 
  Discussion, 
  NewDiscussion,
  DiscussionListResponse,
  DiscussionResponse,
  PaginationParams 
} from '@/types';

/**
 * Fetch all discussions with pagination
 */
export function useDiscussions(params: PaginationParams = { page: 0, size: 20 }) {
  return useQuery({
    queryKey: ['discussions', params],
    queryFn: async () => {
      const queryString = buildQueryString({
        page: params.page,
        size: params.size,
      });
      const response = await apiGet<DiscussionListResponse>(`/api/discussions${queryString}`);
      return response.data as Discussion[];
    },
  });
}

/**
 * Fetch discussions for a specific group
 */
export function useGroupDiscussions(
  groupId: number | string | undefined,
  params: PaginationParams = { page: 0, size: 20 }
) {
  const numericId = typeof groupId === 'string' ? parseInt(groupId, 10) : groupId;

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
      return response.data as Discussion[];
    },
    enabled: !!numericId && !isNaN(numericId),
  });
}

/**
 * Fetch a single discussion by ID
 */
export function useDiscussion(id: number | string | undefined) {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

  return useQuery({
    queryKey: ['discussions', numericId],
    queryFn: async () => {
      const response = await apiGet<DiscussionResponse>(`/api/discussions/${numericId}`);
      return response as Discussion;
    },
    enabled: !!numericId && !isNaN(numericId),
  });
}

/**
 * Create a new discussion
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
