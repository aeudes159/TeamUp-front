import { useQuery, useMutation } from '@tanstack/react-query';
import { apiGet, apiPost, apiPut, apiDelete, buildQueryString } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { mockLocations } from '@/mock/data';
import {
    Location, LocationListResponse,
    NewLocation,
    PaginationParams,
} from '@/types';
import {LocationQueryParams} from "@/types/api";

/**
 * Fetch all locations with pagination
 */
export function useLocations(params: PaginationParams = { page: 0, size: 20 }) {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: async () => {
      const queryString = buildQueryString(params);
      const response = await apiGet<LocationListResponse>(`/api/locations${queryString}`);
      return response.data as Location[];
    },
  });
}

/**
 * Search locations by name
 *
 * @param query - The search query
 * @param params - Pagination parameters
 * @param enabled - Whether the query should be enabled (default: true if query has content)
 */
export function useLocationSearch(
  query: string,
  params: PaginationParams = { page: 0, size: 20 },
  enabled?: boolean
) {
  const shouldEnable = enabled !== undefined ? enabled : query.trim().length > 0;

  return useQuery({
    queryKey: ['locations', 'search', query, params],
    queryFn: async () => {
      const queryString = buildQueryString({
        name: query,
        page: params.page,
        size: params.size,
      });
      const response = await apiGet<LocationListResponse>(`/api/locations/search${queryString}`);
      return response.data as Location[];
    },
    enabled: shouldEnable,
  });
}

/**
 * Fetch a single location by ID
 */
export function useLocation(id: number | string | undefined) {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    return useQuery({
        queryKey: ['locations', 'single', numericId],
        queryFn: async () => {
            try {
                const response = await apiGet<Location>(`/api/locations/${numericId}`);
                return response as Location;
            } catch (error) {
                console.warn('Failed to fetch location from API, using mock data:', error);
                const location = mockLocations.find(l => l.id === numericId);
                if (!location) {
                    throw new Error(`Location with id ${numericId} not found`);
                }
                return location as Location;
            }
        },
        enabled: !!numericId && !isNaN(numericId),
    });
}

/**
 * Create a new location
 */
export function useCreateLocation() {
    return useMutation({
        mutationFn: async (newLocation: NewLocation) => {
            const response = await apiPost<Location>('/api/locations', newLocation);
            return response as Location;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
        },
    });
}

/**
 * Update an existing location
 */
export function useUpdateLocation() {
    return useMutation({
        mutationFn: async ({
                               id,
                               ...updates
                           }: { id: number } & Partial<NewLocation>) => {
            const response = await apiPut<Location>(
                `/api/locations/${id}`,
                updates
            );
            return response as Location;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
            queryClient.invalidateQueries({ queryKey: ['locations', variables.id] });
        },
    });
}

/**
 * Delete a location
 */
export function useDeleteLocation() {
    return useMutation({
        mutationFn: async (id: number) => {
            await apiDelete(`/api/locations/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
        },
    });
}
