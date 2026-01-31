import { useQuery, useMutation } from '@tanstack/react-query';
import { apiGet, apiPost, apiPut, apiDelete, buildQueryString } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import type { 
  User, 
  NewUser,
  UserListResponse,
  UserResponse,
  PaginationParams 
} from '@/types';

/**
 * Fetch all users with pagination
 */
export function useUsers(params: PaginationParams = { page: 0, size: 20 }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const queryString = buildQueryString({
        page: params.page,
        size: params.size,
      });
      const response = await apiGet<UserListResponse>(`/api/users${queryString}`);
      return response.data as User[];
    },
  });
}

/**
 * Search users by name
 */
export function useSearchUsers(
  name: string,
  params: PaginationParams = { page: 0, size: 20 }
) {
  return useQuery({
    queryKey: ['users', 'search', name, params],
    queryFn: async () => {
      const queryString = buildQueryString({
        name,
        page: params.page,
        size: params.size,
      });
      const response = await apiGet<UserListResponse>(`/api/users/search${queryString}`);
      return response.data as User[];
    },
    enabled: !!name && name.length > 0,
  });
}

/**
 * Fetch a single user by ID
 */
export function useUser(id: number | string | undefined) {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

  return useQuery({
    queryKey: ['users', numericId],
    queryFn: async () => {
      const response = await apiGet<UserResponse>(`/api/users/${numericId}`);
      return response as User;
    },
    enabled: !!numericId && !isNaN(numericId),
  });
}

/**
 * Fetch user by phone number
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

/**
 * Create a new user
 */
export function useCreateUser() {
  return useMutation({
    mutationFn: async (newUser: NewUser) => {
      const response = await apiPost<UserResponse>('/api/users', {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        age: newUser.age,
        phoneNumber: newUser.phoneNumber,
        address: newUser.address,
        profilePictureUrl: newUser.profilePictureUrl,
      });
      return response as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Update an existing user
 */
export function useUpdateUser() {
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<NewUser> }) => {
      const response = await apiPut<UserResponse>(`/api/users/${id}`, {
        firstName: updates.firstName,
        lastName: updates.lastName,
        age: updates.age,
        phoneNumber: updates.phoneNumber,
        address: updates.address,
        profilePictureUrl: updates.profilePictureUrl,
      });
      return response as User;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
  });
}

/**
 * Delete a user
 */
export function useDeleteUser() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiDelete(`/api/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
