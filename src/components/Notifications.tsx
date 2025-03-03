import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';

interface Notification {
    id: string;
    type: 'application_status' | 'new_message' | 'project_update' | 'system';
    title: string;
    message: string;
    link?: string;
    is_read: boolean;
    created_at: string;
}

const Notifications: React.FC = () => {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const loadNotifications = async () => {
            if (session?.user) {
                try {
                    const { data, error } = await supabase
                        .from('notifications')
                        .select('*')
                        .eq('user_id', session.user.id)
                        .order('created_at', { ascending: false })
                        .limit(10);

                    if (error) throw error;
                    setNotifications(data || []);
                    setUnreadCount(data?.filter(n => !n.is_read).length || 0);
                } catch (err) {
                    console.error('Error loading notifications:', err);
                }
            }
        };

        loadNotifications();

        // Gerçek zamanlı bildirim güncellemeleri için subscription
        const subscription = supabase
            .channel(`user_notifications:${session?.user?.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${session?.user?.id}`
            }, (payload) => {
                setNotifications(prev => [payload.new as Notification, ...prev]);
                setUnreadCount(prev => prev + 1);
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [session]);

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.is_read) {
            try {
                const { error } = await supabase
                    .from('notifications')
                    .update({ is_read: true })
                    .eq('id', notification.id);

                if (error) throw error;

                setNotifications(prev =>
                    prev.map(n =>
                        n.id === notification.id
                            ? { ...n, is_read: true }
                            : n
                    )
                );
                setUnreadCount(prev => prev - 1);
            } catch (err) {
                console.error('Error marking notification as read:', err);
            }
        }

        if (notification.link) {
            window.location.href = notification.link;
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'application_status':
                return '📝';
            case 'new_message':
                return '💬';
            case 'project_update':
                return '📊';
            case 'system':
                return '🔔';
            default:
                return '📌';
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
                <span className="sr-only">Bildirimler</span>
                <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Bildirimler
                        </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`w-full px-4 py-3 hover:bg-gray-50 flex items-start space-x-3 ${!notification.is_read ? 'bg-blue-50' : ''
                                        }`}
                                >
                                    <span className="text-xl" role="img" aria-label="notification icon">
                                        {getNotificationIcon(notification.type)}
                                    </span>
                                    <div className="flex-1 text-left">
                                        <p className="font-medium text-gray-900">
                                            {notification.title}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {notification.message}
                                        </p>
                                        <span className="text-xs text-gray-500 mt-1 block">
                                            {new Date(notification.created_at).toLocaleDateString('tr-TR')}
                                        </span>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-center text-gray-500">
                                Bildirim bulunmuyor
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications; 