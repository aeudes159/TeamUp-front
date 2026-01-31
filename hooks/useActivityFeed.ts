import { useQuery, useMutation } from '@tanstack/react-query';
import { apiGet, apiPost, apiDelete, buildQueryString } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import type { 
  ActivityFeed,
  ActivityFeedListResponse,
  ActivityFeedResponse,
  PaginationParams 
} from '@/types';

/**
 * Fetch all activity feeds with pagination
 */
export function useActivityFeeds(params: PaginationParams = { page: 0, size: 20 }) {
  return useQuery({
    queryKey: ['activityFeeds', params],
    queryFn: async () => {
      const queryString = buildQueryString({
        page: params.page,
        size: params.size,
      });
      const response = await apiGet<ActivityFeedListResponse>(`/api/activity-feeds${queryString}`);
      return response.data as ActivityFeed[];
    },
  });
}

/**
 * Fetch a single activity feed by ID
 */
export function useActivityFeed(id: number | string | undefined) {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

  return useQuery({
    queryKey: ['activityFeeds', numericId],
    queryFn: async () => {
      const response = await apiGet<ActivityFeedResponse>(`/api/activity-feeds/${numericId}`);
      return response as ActivityFeed;
    },
    enabled: !!numericId && !isNaN(numericId),
  });
}

/**
 * Create a new activity feed
 */
export function useCreateActivityFeed() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiPost<ActivityFeedResponse>('/api/activity-feeds', {});
      return response as ActivityFeed;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityFeeds'] });
    },
  });
}

/**
 * Delete an activity feed
 */
export function useDeleteActivityFeed() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiDelete(`/api/activity-feeds/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityFeeds'] });
    },
  });
}
