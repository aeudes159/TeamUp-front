/**
 * Location Hooks - Refactored using createCrudHooks factory
 * 
 * This demonstrates the new pattern that reduces hook code by ~80%.
 * The factory handles all the boilerplate for CRUD operations.
 */

import { createCrudHooks, createSearchHook } from '@/lib/createCrudHooks';
import { mockLocations } from '@/mock/data';
import type {
    Location,
    NewLocation,
    LocationListResponse,
    LocationResponse,
    LocationQueryParams,
} from '@/types';

// ============================================
// Response Transformer (handles BigDecimal → number)
// ============================================

/**
 * Parse location response to ensure averagePrice is a number.
 * Backend uses BigDecimal which may serialize as string.
 */
function parseLocationResponse(location: LocationResponse): LocationResponse {
    return {
        ...location,
        averagePrice: location.averagePrice !== null
            ? Number(location.averagePrice)
            : null,
    };
}

// ============================================
// Create CRUD Hooks using Factory
// ============================================

const locationHooks = createCrudHooks<Location, NewLocation, LocationListResponse>({
    resourceName: 'locations',
    endpoint: '/api/locations',
    transformResponse: parseLocationResponse,
});

// ============================================
// Export Individual Hooks
// ============================================

/**
 * Fetch all locations with pagination and optional filters
 * 
 * @param params - Query parameters including pagination and filters
 * @returns Query result with LocationListResponse
 * 
 * @example
 * const { data, isLoading } = useLocations({ page: 0, size: 20, sort: 'NAME' });
 */
export function useLocations(params: LocationQueryParams = { page: 0, size: 20 }) {
    return locationHooks.useList(params);
}

/**
 * Fetch a single location by ID
 * 
 * @param id - Location ID (string or number)
 * @returns Query result with Location
 * 
 * @example
 * const { data: location } = useLocation(123);
 */
export const useLocation = locationHooks.useById;

/**
 * Create a new location
 * 
 * @returns Mutation for creating a location
 * 
 * @example
 * const { mutate: createLocation } = useCreateLocation();
 * createLocation({ name: 'New Place', address: '123 Street' });
 */
export const useCreateLocation = locationHooks.useCreate;

/**
 * Update an existing location
 * 
 * @returns Mutation for updating a location
 * 
 * @example
 * const { mutate: updateLocation } = useUpdateLocation();
 * updateLocation({ id: 1, name: 'Updated Name' });
 */
export const useUpdateLocation = locationHooks.useUpdate;

/**
 * Delete a location
 * 
 * @returns Mutation for deleting a location
 * 
 * @example
 * const { mutate: deleteLocation } = useDeleteLocation();
 * deleteLocation(123);
 */
export const useDeleteLocation = locationHooks.useDelete;

// ============================================
// Search Hook (custom implementation for location search)
// ============================================

/**
 * Search locations by name with debounce support
 *
 * @param query - The search query
 * @param params - Pagination parameters
 * @param enabled - Whether the query should be enabled
 * @returns Query result with LocationListResponse
 * 
 * @example
 * const debouncedQuery = useDebouncedValue(searchQuery, 300);
 * const { data } = useLocationSearch(debouncedQuery);
 */
export const useLocationSearch = createSearchHook<Location, LocationListResponse>({
    resourceName: 'locations',
    endpoint: '/api/locations',
    searchParam: 'name',
    transformResponse: parseLocationResponse,
});

// ============================================
// Utility Exports
// ============================================

/** Get query key for locations (useful for cache invalidation) */
export const getLocationsQueryKey = locationHooks.getQueryKey;

/** Invalidate all location queries */
export const invalidateLocationQueries = locationHooks.invalidateAll;

/** Export mock data for fallback scenarios */
export { mockLocations };
