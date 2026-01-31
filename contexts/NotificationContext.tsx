import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useNotificationPermission, scheduleLocalNotification, useUnreadMessages } from '@/hooks/useNotifications';
import { apiGet } from '@/lib/api';
import type { Message, MessageListResponse } from '@/types';

// Polling interval for checking new messages (2 seconds)
const NOTIFICATION_POLL_INTERVAL = 2000;

// TODO: Replace with actual authenticated user ID
const CURRENT_USER_ID = 1;

type NotificationContextType = {
  hasPermission: boolean;
  isLoading: boolean;
  unreadCount: Map<number, number>;
  totalUnread: number;
  markDiscussionAsSeen: (discussionId: number) => void;
  startPolling: (discussionId: number) => void;
  stopPolling: (discussionId: number) => void;
  activeDiscussionId: number | null;
  setActiveDiscussionId: (id: number | null) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

type NotificationProviderProps = {
  children: React.ReactNode;
};

export function NotificationProvider({ children }: Readonly<NotificationProviderProps>) {
  const { hasPermission, isLoading } = useNotificationPermission();
  const {
    unreadCount,
    markAsSeen,
    addUnread,
    getTotalUnread,
    lastSeenRef
  } = useUnreadMessages();

  const [activeDiscussionId, setActiveDiscussionId] = useState<number | null>(null);
  const [pollingDiscussions, setPollingDiscussions] = useState<Set<number>>(new Set());
  const lastMessageIdsRef = useRef<Map<number, number>>(new Map());
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start polling for a discussion
  const startPolling = useCallback((discussionId: number) => {
    setPollingDiscussions(prev => {
      const next = new Set(prev);
      next.add(discussionId);
      return next;
    });
  }, []);

  // Stop polling for a discussion
  const stopPolling = useCallback((discussionId: number) => {
    setPollingDiscussions(prev => {
      const next = new Set(prev);
      next.delete(discussionId);
      return next;
    });
  }, []);

  // Mark discussion as seen
  const markDiscussionAsSeen = useCallback((discussionId: number) => {
    const lastMessageId = lastMessageIdsRef.current.get(discussionId);
    if (lastMessageId) {
      markAsSeen(discussionId, lastMessageId);
    }
  }, [markAsSeen]);

  // Poll for new messages
  useEffect(() => {
    if (pollingDiscussions.size === 0) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }

    const checkForNewMessages = async () => {
      for (const discussionId of pollingDiscussions) {
        try {
          const response = await apiGet<MessageListResponse>(
            `/api/messages/by-discussion/${discussionId}?page=0&size=1`
          );

          const messages = response.data as Message[];
          if (messages.length > 0) {
            const latestMessage = messages[0];
            const lastKnownId = lastMessageIdsRef.current.get(discussionId) || 0;

            if (latestMessage.id && latestMessage.id > lastKnownId) {
              // New message detected
              lastMessageIdsRef.current.set(discussionId, latestMessage.id);

              // Only notify if not from current user and not viewing this discussion
              if (
                latestMessage.senderId !== CURRENT_USER_ID &&
                activeDiscussionId !== discussionId &&
                hasPermission
              ) {
                addUnread(discussionId, 1);

                // Show notification
                await scheduleLocalNotification(
                  'New Message',
                  latestMessage.content || 'You have a new message',
                  { discussionId, messageId: latestMessage.id }
                );
              }
            }
          }
        } catch (error) {
          console.error(`Error polling discussion ${discussionId}:`, error);
        }
      }
    };

    // Initial check
    checkForNewMessages();

    // Set up polling interval
    pollIntervalRef.current = setInterval(checkForNewMessages, NOTIFICATION_POLL_INTERVAL);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [pollingDiscussions, activeDiscussionId, hasPermission, addUnread]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const value: NotificationContextType = {
    hasPermission,
    isLoading,
    unreadCount,
    totalUnread: getTotalUnread(),
    markDiscussionAsSeen,
    startPolling,
    stopPolling,
    activeDiscussionId,
    setActiveDiscussionId,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}
