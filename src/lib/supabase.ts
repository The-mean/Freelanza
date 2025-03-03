import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const subscribeToNotifications = (userId: string, onNotification: (notification: any) => void) => {
    return supabase
        .channel(`user_notifications:${userId}`)
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`
        }, (payload) => {
            onNotification(payload.new);
        })
        .subscribe();
};

export const subscribeToMessages = (conversationId: string, onMessage: (message: any) => void) => {
    return supabase
        .channel(`conversation:${conversationId}`)
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
        }, (payload) => {
            onMessage(payload.new);
        })
        .subscribe();
};

export const subscribeToApplicationUpdates = (userId: string, onUpdate: (application: any) => void) => {
    return supabase
        .channel(`user_applications:${userId}`)
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'job_applications',
            filter: `freelancer_id=eq.${userId}`
        }, (payload) => {
            onUpdate(payload.new);
        })
        .subscribe();
};

export const createNotification = async (notification: {
    user_id: string;
    type: 'application_status' | 'new_message' | 'project_update' | 'system';
    title: string;
    message: string;
    link?: string;
}) => {
    return await supabase
        .from('notifications')
        .insert([{
            ...notification,
            is_read: false,
            created_at: new Date().toISOString()
        }]);
};

export const markNotificationAsRead = async (notificationId: string) => {
    return await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
};

export const getUnreadNotificationsCount = async (userId: string) => {
    const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

    return count || 0;
}; 