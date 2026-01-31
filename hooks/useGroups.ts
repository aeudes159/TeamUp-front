import { useQuery, useMutation } from '@tanstack/react-query';
import { apiGet, apiPost, apiPut, apiDelete, buildQueryString } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import type { 
  Group, 
  NewGroup,
  GroupListResponse,
  GroupResponse,
  PaginationParams 
} from '@/types';

/**
 * Fetch all groups with pagination
 */
export function useGroups(params: PaginationParams = { page: 0, size: 20 }) {
  return useQuery({
    queryKey: ['groups', params],
    queryFn: async () => {
      const queryString = buildQueryString({
        page: params.page,
        size: params.size,
      });
      const response = await apiGet<GroupListResponse>(`/api/groups${queryString}`);
      return response.data as Group[];
    },
  });
}

/**
 * Fetch public groups with pagination
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
      return response.data as Group[];
    },
  });
}

/**
 * Fetch a single group by ID
 */
export function useGroup(id: number | string | undefined) {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  
  return useQuery({
    queryKey: ['groups', numericId],
    queryFn: async () => {
      const response = await apiGet<GroupResponse>(`/api/groups/${numericId}`);
      return response as Group;
    },
    enabled: !!numericId && !isNaN(numericId),
  });
}

/**
 * Create a new group
 */
export function useCreateGroup() {
  return useMutation({
    mutationFn: async (newGroup: NewGroup) => {
      const response = await apiPost<GroupResponse>('/api/groups', {
        name: newGroup.name,
        coverPictureUrl: newGroup.coverPictureUrl,
        isPublic: newGroup.isPublic,
      });
      return response as Group;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

/**
 * Update an existing group
 */
export function useUpdateGroup() {
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<NewGroup> }) => {
      const response = await apiPut<GroupResponse>(`/api/groups/${id}`, {
        name: updates.name,
        coverPictureUrl: updates.coverPictureUrl,
        isPublic: updates.isPublic,
      });
      return response as Group;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups', variables.id] });
    },
  });
}

/**
 * Delete a group
 */
export function useDeleteGroup() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiDelete(`/api/groups/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}
