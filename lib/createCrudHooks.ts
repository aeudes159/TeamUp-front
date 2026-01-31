/**
 * Generic CRUD Hook Factory
 * 
 * Creates a complete set of React Query hooks for a resource.
 * Reduces code duplication by ~80% across hook files.
 * 
 * @example
 * ```typescript
 * // Define hooks for a resource
 * const locationHooks = createCrudHooks<Location, NewLocation, LocationListResponse>({
 *   resourceName: 'locations',
 *   endpoint: '/api/locations',
 * });
 * 
 * // Export individual hooks
 * export const useLocations = locationHooks.useList;
 * export const useLocation = locationHooks.useById;
 * export const useCreateLocation = locationHooks.useCreate;
 * export const useUpdateLocation = locationHooks.useUpdate;
 * export const useDeleteLocation = locationHooks.useDelete;
 * ```
 */

import { useQuery, useMutation, UseQueryOptions } from '@tanstack/react-query';
import { apiGet, apiPost, apiPut, apiDelete, buildQueryString } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { parseId, isValidId } from '@/lib/utils';
import type { PaginatedResponse, PaginationParams } from '@/types';

/**
 * Configuration options for creating CRUD hooks
 */
export type CrudHooksConfig<TEntity, TCreateDto, TListResponse extends PaginatedResponse<TEntity>> = {
    /** Resource name for query keys (e.g., 'locations', 'groups') */
    resourceName: string;
    /** Base API endpoint (e.g., '/api/locations') */
    endpoint: string;
    /** Optional transformer for responses (e.g., parse BigDecimal to number) */
    transformResponse?: (entity: TEntity) => TEntity;
    /** Optional transformer for list responses */
    transformListResponse?: (response: TListResponse) => TListResponse;
    /** Stale time in milliseconds (default: 0) */
    staleTime?: number;
};

/**
 * Extended query parameters that can include filters
 */
export type QueryParams = PaginationParams & Record<string, string | number | boolean | undefined>;

/**
 * Return type of createCrudHooks
 */
export type CrudHooks<TEntity, TCreateDto, TListResponse extends PaginatedResponse<TEntity>> = {
    /** Hook to fetch paginated list of entities */
    useList: (params?: QueryParams, options?: Partial<UseQueryOptions<TListResponse>>) => ReturnType<typeof useQuery<TListResponse>>;
    /** Hook to fetch a single entity by ID */
    useById: (id: number | string | undefined, options?: Partial<UseQueryOptions<TEntity>>) => ReturnType<typeof useQuery<TEntity>>;
    /** Hook to create a new entity */
    useCreate: () => ReturnType<typeof useMutation<TEntity, Error, TCreateDto>>;
    /** Hook to update an existing entity */
    useUpdate: () => ReturnType<typeof useMutation<TEntity, Error, { id: number } & Partial<TCreateDto>>>;
    /** Hook to delete an entity */
    useDelete: () => ReturnType<typeof useMutation<void, Error, number>>;
    /** Get the query key for this resource */
    getQueryKey: (suffix?: string | number | QueryParams) => (string | number | QueryParams)[];
    /** Invalidate all queries for this resource */
    invalidateAll: () => Promise<void>;
};

/**
 * Create a complete set of CRUD hooks for a resource
 */
export function createCrudHooks<
    TEntity extends { id: number | null },
    TCreateDto,
    TListResponse extends PaginatedResponse<TEntity> = PaginatedResponse<TEntity>
>(config: CrudHooksConfig<TEntity, TCreateDto, TListResponse>): CrudHooks<TEntity, TCreateDto, TListResponse> {
    const {
        resourceName,
        endpoint,
        transformResponse,
        transformListResponse,
        staleTime = 0,
    } = config;

    // Helper to apply response transformer
    const transform = (entity: TEntity): TEntity => {
        return transformResponse ? transformResponse(entity) : entity;
    };

    // Helper to apply list response transformer
    const transformList = (response: TListResponse): TListResponse => {
        if (transformListResponse) {
            return transformListResponse(response);
        }
        // Default: apply entity transformer to each item
        if (transformResponse) {
            return {
                ...response,
                data: response.data.map(transform),
            } as TListResponse;
        }
        return response;
    };

    // Query key builder
    const getQueryKey = (suffix?: string | number | QueryParams): (string | number | QueryParams)[] => {
        const base: (string | number | QueryParams)[] = [resourceName];
        if (suffix !== undefined) base.push(suffix);
        return base;
    };

    // Invalidate all queries for this resource
    const invalidateAll = async () => {
        await queryClient.invalidateQueries({ queryKey: [resourceName] });
    };

    // Hook to fetch paginated list
    const useList = (
        params: QueryParams = { page: 0, size: 20 },
        options: Partial<UseQueryOptions<TListResponse>> = {}
    ) => {
        return useQuery<TListResponse>({
            queryKey: getQueryKey(params),
            queryFn: async () => {
                const queryString = buildQueryString(params);
                const response = await apiGet<TListResponse>(`${endpoint}${queryString}`);
                return transformList(response);
            },
            staleTime,
            ...options,
        });
    };

    // Hook to fetch a single entity by ID
    const useById = (
        id: number | string | undefined,
        options: Partial<UseQueryOptions<TEntity>> = {}
    ) => {
        const numericId = parseId(id);

        return useQuery<TEntity>({
            queryKey: getQueryKey(numericId),
            queryFn: async () => {
                const response = await apiGet<TEntity>(`${endpoint}/${numericId}`);
                return transform(response);
            },
            enabled: isValidId(numericId),
            staleTime,
            ...options,
        });
    };

    // Hook to create a new entity
    const useCreate = () => {
        return useMutation<TEntity, Error, TCreateDto>({
            mutationFn: async (data: TCreateDto) => {
                const response = await apiPost<TEntity>(endpoint, data);
                return transform(response);
            },
            onSuccess: () => {
                invalidateAll();
            },
        });
    };

    // Hook to update an existing entity
    const useUpdate = () => {
        return useMutation<TEntity, Error, { id: number } & Partial<TCreateDto>>({
            mutationFn: async ({ id, ...updates }) => {
                const response = await apiPut<TEntity>(`${endpoint}/${id}`, updates);
                return transform(response);
            },
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries({ queryKey: getQueryKey() });
                queryClient.invalidateQueries({ queryKey: getQueryKey(variables.id) });
            },
        });
    };

    // Hook to delete an entity
    const useDelete = () => {
        return useMutation<void, Error, number>({
            mutationFn: async (id: number) => {
                await apiDelete(`${endpoint}/${id}`);
            },
            onSuccess: () => {
                invalidateAll();
            },
        });
    };

    return {
        useList,
        useById,
        useCreate,
        useUpdate,
        useDelete,
        getQueryKey,
        invalidateAll,
    };
}

/**
 * Create a simple search hook for a resource
 */
export function createSearchHook<TEntity, TListResponse extends PaginatedResponse<TEntity>>(
    config: {
        resourceName: string;
        endpoint: string;
        searchParam?: string;
        transformResponse?: (entity: TEntity) => TEntity;
    }
) {
    const {
        resourceName,
        endpoint,
        searchParam = 'name',
        transformResponse,
    } = config;

    return function useSearch(
        query: string,
        params: PaginationParams = { page: 0, size: 20 },
        enabled?: boolean
    ) {
        const shouldEnable = enabled !== undefined ? enabled : query.trim().length > 0;

        return useQuery<TListResponse>({
            queryKey: [resourceName, 'search', query, params],
            queryFn: async () => {
                const queryString = buildQueryString({
                    [searchParam]: query,
                    page: params.page,
                    size: params.size,
                });
                const response = await apiGet<TListResponse>(`${endpoint}/search${queryString}`);
                
                if (transformResponse) {
                    return {
                        ...response,
                        data: response.data.map(transformResponse),
                    } as TListResponse;
                }
                return response;
            },
            enabled: shouldEnable,
        });
    };
}
