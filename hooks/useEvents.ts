import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { mockEvents } from '@/mock/data';
import type { Event, NewEvent } from '@/types';

/**
 * TODO: Replace mock data with API calls when /api/events endpoint is available
 * 
 * The backend events endpoint is coming soon. Once available, update this hook to:
 * 
 * import { apiGet, apiPost, apiDelete, buildQueryString } from '@/lib/api';
 * 
 * And change queryFn to:
 *   const response = await apiGet<EventListResponse>(`/api/events${queryString}`);
 *   return response.data as Event[];
 */

/**
 * Fetch all events (currently using mock data)
 */
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      // TODO: Replace with API call when endpoint is available
      // const response = await apiGet<EventListResponse>('/api/events');
      // return response.data as Event[];
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockEvents as Event[];
    },
  });
}

/**
 * Fetch a single event by ID (currently using mock data)
 */
export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      // TODO: Replace with API call when endpoint is available
      // const response = await apiGet<EventResponse>(`/api/events/${id}`);
      // return response as Event;
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      const event = mockEvents.find(e => e.id === id);
      if (!event) {
        throw new Error(`Event with id ${id} not found`);
      }
      return event as Event;
    },
    enabled: !!id,
  });
}

/**
 * Create a new event (currently using mock data)
 */
export function useCreateEvent() {
  return useMutation({
    mutationFn: async (newEvent: NewEvent) => {
      // TODO: Replace with API call when endpoint is available
      // const response = await apiPost<EventResponse>('/api/events', newEvent);
      // return response as Event;
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Create a mock event with generated ID
      const event: Event = {
        ...newEvent,
        id: `mock-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      
      // Note: This won't persist since we're using mock data
      // In a real implementation, the server would store it
      return event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

/**
 * Delete an event (currently using mock data)
 */
export function useDeleteEvent() {
  return useMutation({
    mutationFn: async (id: string) => {
      // TODO: Replace with API call when endpoint is available
      // await apiDelete(`/api/events/${id}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Note: This won't actually delete from mock data
      // In a real implementation, the server would handle deletion
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
