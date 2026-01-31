import { useQuery, useMutation } from '@tanstack/react-query';
import { apiGet, apiPost, apiPut, apiDelete, buildQueryString } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import type { 
  Message, 
  NewMessage,
  MessageListResponse,
  MessageResponse,
  PaginationParams 
} from '@/types';

/**
 * Polling interval for realtime-like message updates (in milliseconds)
 * Set to 2 seconds for better responsiveness in group chat
 */
const MESSAGE_POLL_INTERVAL = 2000;

/**
 * Fetch messages for a discussion with polling for realtime updates
 * 
 * @param discussionId - The discussion ID to fetch messages for
 * @param params - Pagination parameters
 * @param enablePolling - Whether to enable automatic polling (default: true)
 */
export function useMessages(
  discussionId: number | string | undefined,
  params: PaginationParams = { page: 0, size: 50 },
  enablePolling: boolean = true
) {
  const numericId = typeof discussionId === 'string' ? parseInt(discussionId, 10) : discussionId;

  return useQuery({
    queryKey: ['messages', numericId, params],
    queryFn: async () => {
      const queryString = buildQueryString({
        page: params.page,
        size: params.size,
      });
      const response = await apiGet<MessageListResponse>(
        `/api/messages/by-discussion/${numericId}${queryString}`
      );
      return response.data as Message[];
    },
    enabled: !!numericId && !isNaN(numericId),
    // Enable polling for realtime-like updates
    refetchInterval: enablePolling ? MESSAGE_POLL_INTERVAL : false,
    // Refetch when window regains focus
    refetchOnWindowFocus: true,
  });
}

/**
 * Fetch all messages with pagination (for admin/debug purposes)
 */
export function useAllMessages(params: PaginationParams = { page: 0, size: 20 }) {
  return useQuery({
    queryKey: ['messages', 'all', params],
    queryFn: async () => {
      const queryString = buildQueryString({
        page: params.page,
        size: params.size,
      });
      const response = await apiGet<MessageListResponse>(`/api/messages${queryString}`);
      return response.data as Message[];
    },
  });
}

/**
 * Fetch a single message by ID
 */
export function useMessage(id: number | string | undefined) {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

  return useQuery({
    queryKey: ['messages', 'single', numericId],
    queryFn: async () => {
      const response = await apiGet<MessageResponse>(`/api/messages/${numericId}`);
      return response as Message;
    },
    enabled: !!numericId && !isNaN(numericId),
  });
}

/**
 * Send a new message
 */
export function useSendMessage() {
  return useMutation({
    mutationFn: async (newMessage: NewMessage) => {
      const response = await apiPost<MessageResponse>('/api/messages', {
        content: newMessage.content,
        imageUrl: newMessage.imageUrl,
        senderId: newMessage.senderId,
        discussionId: newMessage.discussionId,
      });
      return response as Message;
    },
    onSuccess: (_, variables) => {
      // Invalidate messages for this discussion to trigger refetch
      queryClient.invalidateQueries({ 
        queryKey: ['messages', variables.discussionId] 
      });
    },
  });
}

/**
 * Update an existing message
 */
export function useUpdateMessage() {
  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: number; 
      updates: { content?: string; imageUrl?: string };
      discussionId?: number;
    }) => {
      const response = await apiPut<MessageResponse>(`/api/messages/${id}`, updates);
      return response as Message;
    },
    onSuccess: (data) => {
      // Invalidate the specific message
      queryClient.invalidateQueries({ queryKey: ['messages', 'single', data.id] });
      // Invalidate the discussion's messages if we know the discussion ID
      if (data.discussionId) {
        queryClient.invalidateQueries({ queryKey: ['messages', data.discussionId] });
      }
    },
  });
}

/**
 * Delete a message
 */
export function useDeleteMessage() {
  return useMutation({
    mutationFn: async ({ id, discussionId }: { id: number; discussionId?: number }) => {
      await apiDelete(`/api/messages/${id}`);
      return { id, discussionId };
    },
    onSuccess: (variables) => {
      // Invalidate the discussion's messages if we know the discussion ID
      if (variables.discussionId) {
        queryClient.invalidateQueries({ queryKey: ['messages', variables.discussionId] });
      }
      // Also invalidate all messages cache
      queryClient.invalidateQueries({ queryKey: ['messages', 'all'] });
    },
  });
}
