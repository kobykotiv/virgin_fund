// hooks/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import supabase from "@/lib/supabaseClient";

export interface Notification {
  id: string;
  alert_id: string;
  message: string;
  type: string;
  delivery_method: 'in_app' | 'email' | 'webhook';
  read: boolean;
  created_at: string;
}

export function useNotifications() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async (): Promise<Notification[]> => {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to fetch notifications');
      return data.notifications;
    },
    staleTime: 10_000,
  });

  // Supabase realtime subscription for notifications
  useEffect(() => {
    const channel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, () => {
        // Invalidate and refetch notifications when new ones are added
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Provide a markRead mutation on the returned object for backward compatibility
  const markRead = useMarkNotificationAsRead();

  // Also expose create mutation for convenience
  const create = useCreateNotification();

  // Return the query result plus helper mutations expected by UI components
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Object.assign(query, { markRead, create } as any);
}

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationData: {
      alert_id: string;
      message: string;
      type?: string;
      delivery_method?: 'in_app' | 'email' | 'webhook';
    }): Promise<Notification> => {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to create notification');
      return data.notification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<Notification> => {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, read: true }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to update notification');
      return data.notification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async (): Promise<number> => {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to fetch notifications');
      return data.notifications.filter((n: Notification) => !n.read).length;
    },
    staleTime: 10_000,
  });
}
