import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';

// Lazy load expo-notifications to avoid SSR issues
let Notifications: typeof import('expo-notifications') | null = null;
let Device: typeof import('expo-device') | null = null;

// Only load on native platforms
if (Platform.OS !== 'web') {
  Notifications = require('expo-notifications');
  Device = require('expo-device');

  // Configure notification handling
  if (Notifications) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }
}

/**
 * Request notification permissions
 */
export function useNotificationPermission() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function requestPermission() {
      setIsLoading(true);

      // Skip on web
      if (Platform.OS === 'web' || !Notifications || !Device) {
        setIsLoading(false);
        return;
      }

      if (!Device.isDevice) {
        // Notifications don't work on simulator/emulator
        console.log('Notifications require a physical device');
        setIsLoading(false);
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permission not granted');
        setHasPermission(false);
      } else {
        setHasPermission(true);
      }

      // Android requires a notification channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6366f1',
        });
      }

      setIsLoading(false);
    }

    requestPermission();
  }, []);

  return { hasPermission, isLoading };
}

/**
 * Schedule a local notification
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  // Skip on web
  if (Platform.OS === 'web' || !Notifications) {
    console.log('Notification (web):', title, body);
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Show immediately
    });
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
}

/**
 * Hook to listen for notification responses (when user taps notification)
 */
export function useNotificationResponse(
  onNotificationResponse?: (response: { notification: { request: { content: { data: unknown } } } }) => void
) {
  const responseListener = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    // Skip on web
    if (Platform.OS === 'web' || !Notifications) {
      return;
    }

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        onNotificationResponse?.(response);
      }
    );

    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [onNotificationResponse]);
}

/**
 * Hook to listen for incoming notifications (when app is in foreground)
 */
export function useNotificationReceived(
  onNotificationReceived?: (notification: { request: { content: { title: string | null; body: string | null } } }) => void
) {
  const notificationListener = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    // Skip on web
    if (Platform.OS === 'web' || !Notifications) {
      return;
    }

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        onNotificationReceived?.(notification);
      }
    );

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
    };
  }, [onNotificationReceived]);
}

/**
 * Track unread messages per discussion
 */
export function useUnreadMessages() {
  const [unreadCount, setUnreadCount] = useState<Map<number, number>>(new Map());
  const lastSeenRef = useRef<Map<number, number>>(new Map());

  const markAsSeen = useCallback((discussionId: number, lastMessageId: number) => {
    lastSeenRef.current.set(discussionId, lastMessageId);
    setUnreadCount(prev => {
      const next = new Map(prev);
      next.set(discussionId, 0);
      return next;
    });
  }, []);

  const addUnread = useCallback((discussionId: number, count: number = 1) => {
    setUnreadCount(prev => {
      const next = new Map(prev);
      const current = next.get(discussionId) || 0;
      next.set(discussionId, current + count);
      return next;
    });
  }, []);

  const getUnreadCount = useCallback((discussionId: number) => {
    return unreadCount.get(discussionId) || 0;
  }, [unreadCount]);

  const getTotalUnread = useCallback(() => {
    let total = 0;
    unreadCount.forEach(count => {
      total += count;
    });
    return total;
  }, [unreadCount]);

  return {
    unreadCount,
    markAsSeen,
    addUnread,
    getUnreadCount,
    getTotalUnread,
    lastSeenRef,
  };
}

/**
 * Get push notification token (for remote notifications)
 */
export async function getPushToken(): Promise<string | null> {
  // Skip on web
  if (Platform.OS === 'web' || !Notifications || !Device) {
    return null;
  }

  if (!Device.isDevice) {
    return null;
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    });
    return token.data;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
}
