import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

interface Conversation {
    id: string;
    other_user: {
        id: string;
        name: string;
        type: string;
    };
    last_message: string;
    last_message_time: string;
    unread_count: number;
}

interface Message {
    id: string;
    sender_id: string;
    content: string;
    created_at: string;
}

const MessagesPage: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadConversations = async () => {
            if (session?.user) {
                try {
                    const { data, error: queryError } = await supabase
                        .from('conversations')
                        .select(`
                            id,
                            other_user:users!other_user_id (
                                id,
                                name,
                                type
                            ),
                            last_message,
                            last_message_time,
                            unread_count
                        `)
                        .eq('user_id', session.user.id)
                        .order('last_message_time', { ascending: false });

                    if (queryError) throw queryError;
                    setConversations(data || []);
                } catch (err) {
                    setError('Konuşmalar yüklenirken bir hata oluştu.');
                    console.error('Error loading conversations:', err);
                }
            }
            setIsLoading(false);
        };

        loadConversations();
    }, [session]);

    useEffect(() => {
        const loadMessages = async () => {
            if (selectedConversation) {
                try {
                    const { data, error: queryError } = await supabase
                        .from('messages')
                        .select('*')
                        .eq('conversation_id', selectedConversation)
                        .order('created_at', { ascending: true });

                    if (queryError) throw queryError;
                    setMessages(data || []);
                    scrollToBottom();

                    // Okunmamış mesajları okundu olarak işaretle
                    await supabase
                        .from('conversations')
                        .update({ unread_count: 0 })
                        .eq('id', selectedConversation)
                        .eq('user_id', session?.user?.id);
                } catch (err) {
                    setError('Mesajlar yüklenirken bir hata oluştu.');
                    console.error('Error loading messages:', err);
                }
            }
        };

        loadMessages();

        // Gerçek zamanlı mesaj güncellemeleri için subscription
        const subscription = supabase
            .channel(`conversation:${selectedConversation}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${selectedConversation}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new as Message]);
                scrollToBottom();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [selectedConversation, session]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation || !session?.user) return;

        try {
            const { error: insertError } = await supabase
                .from('messages')
                .insert([{
                    conversation_id: selectedConversation,
                    sender_id: session.user.id,
                    content: newMessage.trim()
                }]);

            if (insertError) throw insertError;

            // Konuşmanın son mesajını güncelle
            await supabase
                .from('conversations')
                .update({
                    last_message: newMessage.trim(),
                    last_message_time: new Date().toISOString()
                })
                .eq('id', selectedConversation);

            setNewMessage('');
        } catch (err) {
            setError('Mesaj gönderilirken bir hata oluştu.');
            console.error('Error sending message:', err);
        }
    };

    // Oturum kontrolü
    if (status === 'loading' || isLoading) {
        return <div>Yükleniyor...</div>;
    }

    if (!session) {
        router.push('/auth/login');
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>Mesajlar | Freelanza</title>
                <meta name="description" content="Mesajlarınızı yönetin" />
            </Head>

            <Header />

            <main className="flex-grow bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                            {/* Konuşmalar listesi */}
                            <div className="border-r">
                                <div className="p-4 border-b">
                                    <h1 className="text-xl font-semibold text-gray-900">
                                        Mesajlar
                                    </h1>
                                </div>
                                <div className="divide-y overflow-y-auto" style={{ maxHeight: '600px' }}>
                                    {conversations.map((conversation) => (
                                        <button
                                            key={conversation.id}
                                            onClick={() => setSelectedConversation(conversation.id)}
                                            className={`w-full p-4 text-left hover:bg-gray-50 ${selectedConversation === conversation.id ? 'bg-blue-50' : ''
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">
                                                        {conversation.other_user.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {conversation.last_message}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(conversation.last_message_time).toLocaleDateString('tr-TR')}
                                                    </span>
                                                    {conversation.unread_count > 0 && (
                                                        <span className="mt-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                            {conversation.unread_count}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Mesajlar */}
                            <div className="md:col-span-2">
                                {selectedConversation ? (
                                    <div className="flex flex-col h-full" style={{ height: '600px' }}>
                                        <div className="p-4 border-b">
                                            <h2 className="font-medium text-gray-900">
                                                {conversations.find(c => c.id === selectedConversation)?.other_user.name}
                                            </h2>
                                        </div>

                                        <div className="flex-grow overflow-y-auto p-4 space-y-4">
                                            {messages.map((message) => (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${message.sender_id === session.user.id
                                                            ? 'justify-end'
                                                            : 'justify-start'
                                                        }`}
                                                >
                                                    <div
                                                        className={`max-w-[70%] px-4 py-2 rounded-lg ${message.sender_id === session.user.id
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-100 text-gray-900'
                                                            }`}
                                                    >
                                                        <p>{message.content}</p>
                                                        <span className={`text-xs mt-1 block ${message.sender_id === session.user.id
                                                                ? 'text-blue-100'
                                                                : 'text-gray-500'
                                                            }`}>
                                                            {new Date(message.created_at).toLocaleTimeString('tr-TR')}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={messagesEndRef} />
                                        </div>

                                        <form onSubmit={handleSendMessage} className="p-4 border-t">
                                            <div className="flex space-x-4">
                                                <input
                                                    type="text"
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    placeholder="Mesajınızı yazın..."
                                                    className="flex-grow px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={!newMessage.trim()}
                                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                    Gönder
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-500">
                                        Bir konuşma seçin
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MessagesPage; 