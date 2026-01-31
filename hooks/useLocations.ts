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
 * Falls back to mock data if API fails
 */
export function useLocations(
    params: LocationQueryParams = { page: 0, size: 20 }
) {
    return useQuery({
        queryKey: ['locations', params],
        queryFn: async () => {
            const queryString = buildQueryString(params);

            const response = await apiGet<LocationListResponse>(
                `/api/locations${queryString}`
            );

            return response;
        },
    });
}

/**
 * Fetch a single location by ID
 */
export function useLocation(id: number | string | undefined) {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    return useQuery({
        queryKey: ['locations', numericId],
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
