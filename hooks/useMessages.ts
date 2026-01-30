import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import type { Message, NewMessage } from '@/types';

// Fetch messages d'un groupe avec realtime
export function useMessages(groupId: string) {
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);

  // Fetch initial
  const query = useQuery({
    queryKey: ['messages', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!groupId,
  });

  // Realtime subscription
  useEffect(() => {
    if (!groupId) return;

    const channel = supabase
      .channel(`group:${groupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `group_id=eq.${groupId}`,
        },
        (payload) => {
          setRealtimeMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  // Combiner messages initiaux + realtime
  const allMessages = [...(query.data || []), ...realtimeMessages];

  return {
    ...query,
    data: allMessages,
  };
}

// Envoyer un message
export function useSendMessage() {
  return useMutation({
    mutationFn: async (newMessage: NewMessage) => {
      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select()
        .single();

      if (error) throw error;
      return data as Message;
    },
    onSuccess: (_, variables) => {
      // Invalider les messages du groupe
      queryClient.invalidateQueries({ 
        queryKey: ['messages', variables.group_id] 
      });
    },
  });
}
