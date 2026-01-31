import { useQuery, useMutation } from '@tanstack/react-query';
import { apiGet, apiPost, apiPut, apiDelete, buildQueryString } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import type {
  Poll,
  NewPoll,
  NewPollOption,
  NewPollVote,
  PollListResponse,
  PollResponse,
  PollOptionResponse,
  PollVoteResponse,
  PaginationParams,
} from '@/types';

/**
 * Polling interval for poll updates (in milliseconds)
 */
const POLL_POLL_INTERVAL = 5000;

/**
 * Fetch polls for a discussion with optional polling for real-time updates
 *
 * @param discussionId - The discussion ID to fetch polls for
 * @param params - Pagination parameters
 * @param enablePolling - Whether to enable automatic polling (default: true)
 */
export function usePolls(
  discussionId: number | string | undefined,
  params: PaginationParams = { page: 0, size: 20 },
  enablePolling: boolean = true
) {
  const numericId = typeof discussionId === 'string' ? parseInt(discussionId, 10) : discussionId;

  return useQuery({
    queryKey: ['polls', numericId, params],
    queryFn: async () => {
      const queryString = buildQueryString({
        page: params.page,
        size: params.size,
      });
      const response = await apiGet<PollListResponse>(
        `/api/polls/by-discussion/${numericId}${queryString}`
      );
      return response.data as Poll[];
    },
    enabled: !!numericId && !isNaN(numericId),
    refetchInterval: enablePolling ? POLL_POLL_INTERVAL : false,
    refetchOnWindowFocus: true,
  });
}

/**
 * Fetch a single poll by ID with all options and votes
 */
export function usePoll(id: number | string | undefined) {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

  return useQuery({
    queryKey: ['polls', 'single', numericId],
    queryFn: async () => {
      const response = await apiGet<PollResponse>(`/api/polls/${numericId}`);
      return response as Poll;
    },
    enabled: !!numericId && !isNaN(numericId),
  });
}

/**
 * Create a new poll
 */
export function useCreatePoll() {
  return useMutation({
    mutationFn: async (newPoll: NewPoll) => {
      const response = await apiPost<PollResponse>('/api/polls', {
        title: newPoll.title,
        description: newPoll.description,
        discussionId: newPoll.discussionId,
        creatorId: newPoll.creatorId,
      });
      return response as Poll;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['polls', variables.discussionId],
      });
    },
  });
}

/**
 * Update an existing poll
 */
export function useUpdatePoll() {
  return useMutation({
    mutationFn: async ({
      id,
      updates,
      userId,
    }: {
      id: number;
      updates: { title?: string; description?: string; isActive?: boolean };
      userId: number;
    }) => {
      const queryString = buildQueryString({ userId });
      const response = await apiPut<PollResponse>(`/api/polls/${id}${queryString}`, updates);
      return response as Poll;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['polls', 'single', data.id] });
      if (data.discussionId) {
        queryClient.invalidateQueries({ queryKey: ['polls', data.discussionId] });
      }
    },
  });
}

/**
 * Delete a poll
 */
export function useDeletePoll() {
  return useMutation({
    mutationFn: async ({ id, userId, discussionId }: { id: number; userId: number; discussionId?: number }) => {
      const queryString = buildQueryString({ userId });
      await apiDelete(`/api/polls/${id}${queryString}`);
      return { id, discussionId };
    },
    onSuccess: (variables) => {
      if (variables.discussionId) {
        queryClient.invalidateQueries({ queryKey: ['polls', variables.discussionId] });
      }
    },
  });
}

/**
 * Close a poll (prevents further voting)
 */
export function useClosePoll() {
  return useMutation({
    mutationFn: async ({ id, userId }: { id: number; userId: number }) => {
      const queryString = buildQueryString({ userId });
      const response = await apiPost<PollResponse>(`/api/polls/${id}/close${queryString}`);
      return response as Poll;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    },
  });
}

/**
 * Add a location option to a poll
 */
export function useAddPollOption() {
  return useMutation({
    mutationFn: async (newOption: NewPollOption) => {
      const response = await apiPost<PollOptionResponse>('/api/polls/options', {
        pollId: newOption.pollId,
        locationId: newOption.locationId,
        addedByUserId: newOption.addedByUserId,
      });
      return response;
    },
    onSuccess: (data) => {
      if (data.pollId) {
        queryClient.invalidateQueries({ queryKey: ['polls', 'single', data.pollId] });
        // Also invalidate the discussion polls list
        queryClient.invalidateQueries({ queryKey: ['polls'] });
      }
    },
  });
}

/**
 * Remove an option from a poll
 */
export function useRemovePollOption() {
  return useMutation({
    mutationFn: async ({ id, userId, pollId }: { id: number; userId: number; pollId?: number }) => {
      const queryString = buildQueryString({ userId });
      await apiDelete(`/api/polls/options/${id}${queryString}`);
      return { id, pollId };
    },
    onSuccess: (variables) => {
      if (variables.pollId) {
        queryClient.invalidateQueries({ queryKey: ['polls', 'single', variables.pollId] });
      }
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    },
  });
}

/**
 * Vote for a poll option
 */
export function useVote() {
  return useMutation({
    mutationFn: async (newVote: NewPollVote) => {
      const response = await apiPost<PollVoteResponse>('/api/polls/votes', {
        pollOptionId: newVote.pollOptionId,
        userId: newVote.userId,
      });
      return response;
    },
    onSuccess: () => {
      // Invalidate all polls to refresh vote counts
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    },
  });
}

/**
 * Remove a vote from a poll option
 */
export function useRemoveVote() {
  return useMutation({
    mutationFn: async ({ optionId, userId }: { optionId: number; userId: number }) => {
      const queryString = buildQueryString({ optionId, userId });
      await apiDelete(`/api/polls/votes${queryString}`);
      return { optionId, userId };
    },
    onSuccess: () => {
      // Invalidate all polls to refresh vote counts
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    },
  });
}
