import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Group } from '@/types';

// Fetch tous les groupes
export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Group[];
    },
  });
}

// Fetch les groupes d'un événement
export function useEventGroups(eventId: string) {
  return useQuery({
    queryKey: ['groups', 'event', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('event_id', eventId);

      if (error) throw error;
      return data as Group[];
    },
    enabled: !!eventId,
  });
}

// Fetch un groupe par ID
export function useGroup(id: string) {
  return useQuery({
    queryKey: ['groups', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Group;
    },
    enabled: !!id,
  });
}
