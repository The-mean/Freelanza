import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useAuthContext } from '../context/AuthContext';

// Örnek mesaj verileri
const MOCK_CONVERSATIONS = [
    {
        id: 1,
        recipient: {
            id: 2,
            name: 'Mehmet Öz',
            avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
            title: 'Proje Yöneticisi',
            isOnline: true,
        },
        lastMessage: {
            text: 'Projemiz için teklifinizi inceledim, detayları konuşabilir miyiz?',
            timestamp: '10:30',
            isRead: true,
            isOwn: false,
        },
        unreadCount: 0,
    },
    {
        id: 2,
        recipient: {
            id: 3,
            name: 'Ayşe Kaya',
            avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
            title: 'İçerik Yöneticisi',
            isOnline: false,
        },
        lastMessage: {
            text: 'Son gönderdiğiniz revizeler harika olmuş, teşekkürler!',
            timestamp: 'Dün',
            isRead: false,
            isOwn: false,
        },
        unreadCount: 2,
    },
    {
        id: 3,
        recipient: {
            id: 4,
            name: 'Ali Demir',
            avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
            title: 'UI/UX Tasarımcı',
            isOnline: true,
        },
        lastMessage: {
            text: 'Tasarım dosyalarını ekledim, bir göz atabilir misiniz?',
            timestamp: 'Pazartesi',
            isRead: true,
            isOwn: true,
        },
        unreadCount: 0,
    },
    {
        id: 4,
        recipient: {
            id: 5,
            name: 'Zeynep Yıldız',
            avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
            title: 'Mobil Uygulama Geliştiricisi',
            isOnline: false,
        },
        lastMessage: {
            text: 'API entegrasyonu için bir toplantı ayarlayabilir miyiz?',
            timestamp: '23/05',
            isRead: true,
            isOwn: false,
        },
        unreadCount: 0,
    },
    {
        id: 5,
        recipient: {
            id: 6,
            name: 'Burak Kaya',
            avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
            title: 'Backend Geliştirici',
            isOnline: false,
        },
        lastMessage: {
            text: 'Veritabanı şemasını güncelledim, backend ile uyumlu mu kontrol eder misiniz?',
            timestamp: '20/05',
            isRead: true,
            isOwn: false,
        },
        unreadCount: 0,
    },
];

// Örnek mesaj geçmişi
const MOCK_MESSAGE_HISTORY = {
    1: [
        {
            id: 1,
            senderId: 2,
            text: 'Merhaba, web sitemiz için bir yenileme çalışması düşünüyoruz.',
            timestamp: '10:15, 15 Mayıs',
            attachments: [],
        },
        {
            id: 2,
            senderId: 1,
            text: 'Merhaba, size nasıl yardımcı olabilirim? Portföyümü incelediniz mi?',
            timestamp: '10:20, 15 Mayıs',
            attachments: [],
        },
        {
            id: 3,
            senderId: 2,
            text: 'Evet, inceledim ve çalışmalarınızı beğendim. Projemiz için bir teklif sunmanızı istiyoruz.',
            timestamp: '10:25, 15 Mayıs',
            attachments: [],
        },
        {
            id: 4,
            senderId: 2,
            text: 'Projemiz için teklifinizi inceledim, detayları konuşabilir miyiz?',
            timestamp: '10:30, 15 Mayıs',
            attachments: [],
        },
    ],
    2: [
        {
            id: 1,
            senderId: 3,
            text: 'Selamlar, blog içerikleri için revizeler hazır mı?',
            timestamp: '14:05, Dün',
            attachments: [],
        },
        {
            id: 2,
            senderId: 1,
            text: 'Merhaba, evet tüm revizeleri bugün tamamladım.',
            timestamp: '14:30, Dün',
            attachments: [
                {
                    id: 1,
                    name: 'revisions-v2.docx',
                    size: '2.3 MB',
                    type: 'document',
                },
            ],
        },
        {
            id: 3,
            senderId: 3,
            text: 'Bir göz atayım hemen.',
            timestamp: '15:15, Dün',
            attachments: [],
        },
        {
            id: 4,
            senderId: 3,
            text: 'Son gönderdiğiniz revizeler harika olmuş, teşekkürler!',
            timestamp: '17:40, Dün',
            attachments: [],
        },
        {
            id: 5,
            senderId: 3,
            text: 'Ayrıca bir konuda daha yardımınıza ihtiyacımız var, yeni bir sayfa için içerik stratejisi oluşturabilir misiniz?',
            timestamp: '17:42, Dün',
            attachments: [],
        },
    ],
};

const Messages: React.FC = () => {
    const { isAuthenticated } = useAuthContext();
    const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
    const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Gerçek uygulamada API'dan konuşmaları çeker
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setConversations(MOCK_CONVERSATIONS);
            setLoading(false);
            // İlk konuşmayı varsayılan olarak seç
            if (MOCK_CONVERSATIONS.length > 0 && !selectedConversation) {
                setSelectedConversation(MOCK_CONVERSATIONS[0].id);
            }
        }, 500);
    }, []);

    // Seçilen konuşma değiştiğinde mesajları günceller
    useEffect(() => {
        if (selectedConversation) {
            // Gerçek uygulamada API'dan mesajları çeker
            setMessages(MOCK_MESSAGE_HISTORY[selectedConversation as keyof typeof MOCK_MESSAGE_HISTORY] || []);

            // Okunmadı işaretlerini temizle
            setConversations(
                conversations.map(conv =>
                    conv.id === selectedConversation ? { ...conv, unreadCount: 0 } : conv
                )
            );
        }
    }, [selectedConversation]);

    // Mesajlar yüklendiğinde veya yeni mesaj eklendiğinde en alta kaydırır
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!isAuthenticated) {
        return (
            <Layout>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-neutral-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h2 className="mt-2 text-2xl font-bold text-neutral-900">Bu sayfayı görüntülemek için giriş yapmalısınız</h2>
                    <p className="mt-1 text-lg text-neutral-500">Mesajlarınızı görmek için lütfen giriş yapın veya kaydolun.</p>
                    <div className="mt-6">
                        <Link to="/login">
                            <Button variant="primary">Giriş Yap</Button>
                        </Link>
                        <Link to="/register" className="ml-4">
                            <Button variant="outline">Kayıt Ol</Button>
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const newMessageObj = {
            id: messages.length + 1,
            senderId: 1, // Kendi ID'miz
            text: newMessage,
            timestamp: `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}, Bugün`,
            attachments: [],
        };

        // Mesajları güncelle
        setMessages([...messages, newMessageObj]);

        // Son mesajı güncelle
        setConversations(
            conversations.map(conv =>
                conv.id === selectedConversation
                    ? {
                        ...conv,
                        lastMessage: {
                            text: newMessage,
                            timestamp: 'Şimdi',
                            isRead: true,
                            isOwn: true,
                        }
                    }
                    : conv
            )
        );

        // Mesaj input'unu temizle
        setNewMessage('');

        // Gerçek uygulamada burada API çağrısı yapılır
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Gerçek uygulamada dosya yükleme mantığı burada olur
        console.log('File upload:', e.target.files);
    };

    // Konuşma araması
    const filteredConversations = conversations.filter(conv =>
        conv.recipient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="flex h-[calc(80vh)]">
                        {/* Konuşma Listesi */}
                        <div className="w-1/3 border-r border-neutral-200 flex flex-col">
                            <div className="p-4 border-b border-neutral-200">
                                <h1 className="text-xl font-bold text-neutral-900">Mesajlar</h1>
                                <div className="mt-2 relative">
                                    <input
                                        type="text"
                                        placeholder="Konuşma ara..."
                                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <svg
                                        className="absolute right-3 top-2.5 h-5 w-5 text-neutral-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {loading ? (
                                    <div className="p-4 space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="animate-pulse flex p-2">
                                                <div className="rounded-full bg-neutral-200 h-12 w-12 mr-4"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                                                    <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : filteredConversations.length === 0 ? (
                                    <div className="p-4 text-center text-neutral-500">
                                        Aramaya uygun konuşma bulunamadı.
                                    </div>
                                ) : (
                                    filteredConversations.map((conversation) => (
                                        <button
                                            key={conversation.id}
                                            className={`w-full text-left p-4 hover:bg-neutral-50 focus:outline-none transition duration-150 ${selectedConversation === conversation.id ? 'bg-neutral-100' : ''
                                                }`}
                                            onClick={() => setSelectedConversation(conversation.id)}
                                        >
                                            <div className="flex items-start">
                                                <div className="relative flex-shrink-0">
                                                    <img
                                                        className="h-12 w-12 rounded-full object-cover"
                                                        src={conversation.recipient.avatar}
                                                        alt={conversation.recipient.name}
                                                    />
                                                    {conversation.recipient.isOnline && (
                                                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                                                    )}
                                                </div>
                                                <div className="ml-3 flex-1 overflow-hidden">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-sm font-medium text-neutral-900 truncate">
                                                            {conversation.recipient.name}
                                                        </h3>
                                                        <span className="text-xs text-neutral-500">
                                                            {conversation.lastMessage.timestamp}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-neutral-500 truncate">
                                                        {conversation.recipient.title}
                                                    </p>
                                                    <p className={`mt-1 text-sm truncate ${conversation.unreadCount > 0 ? 'font-semibold text-neutral-900' : 'text-neutral-600'
                                                        }`}>
                                                        {conversation.lastMessage.isOwn ? 'Sen: ' : ''}{conversation.lastMessage.text}
                                                    </p>
                                                </div>
                                                {conversation.unreadCount > 0 && (
                                                    <div className="ml-2 mt-1.5 flex-shrink-0 bg-primary-500 rounded-full h-5 w-5 flex items-center justify-center">
                                                        <span className="text-xs font-medium text-white">{conversation.unreadCount}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Mesaj Alanı */}
                        <div className="w-2/3 flex flex-col">
                            {selectedConversation ? (
                                <>
                                    {/* Mesaj Başlığı */}
                                    <div className="p-4 border-b border-neutral-200 flex items-center">
                                        {conversations.find(c => c.id === selectedConversation)?.recipient && (
                                            <>
                                                <div className="relative">
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        src={conversations.find(c => c.id === selectedConversation)?.recipient.avatar}
                                                        alt={conversations.find(c => c.id === selectedConversation)?.recipient.name}
                                                    />
                                                    {conversations.find(c => c.id === selectedConversation)?.recipient.isOnline && (
                                                        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></div>
                                                    )}
                                                </div>
                                                <div className="ml-3">
                                                    <h2 className="text-base font-medium text-neutral-900">
                                                        {conversations.find(c => c.id === selectedConversation)?.recipient.name}
                                                    </h2>
                                                    <p className="text-xs text-neutral-500">
                                                        {conversations.find(c => c.id === selectedConversation)?.recipient.isOnline ? 'Çevrimiçi' : 'Son görülme: Bugün 11:45'}
                                                    </p>
                                                </div>
                                                <div className="ml-auto flex items-center space-x-2">
                                                    <Link to={`/profile/${conversations.find(c => c.id === selectedConversation)?.recipient.id}`}>
                                                        <button className="p-2 text-neutral-500 hover:text-neutral-700 rounded-full hover:bg-neutral-100">
                                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </Link>
                                                    <button className="p-2 text-neutral-500 hover:text-neutral-700 rounded-full hover:bg-neutral-100">
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Mesaj İçeriği */}
                                    <div className="flex-1 p-4 overflow-y-auto bg-neutral-50">
                                        <div className="space-y-4">
                                            {messages.map((message) => {
                                                const isOwn = message.senderId === 1; // Kendi ID'miz 1
                                                return (
                                                    <div
                                                        key={message.id}
                                                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div className="flex items-end">
                                                            {!isOwn && (
                                                                <img
                                                                    className="h-8 w-8 rounded-full object-cover mr-2"
                                                                    src={conversations.find(c => c.id === selectedConversation)?.recipient.avatar}
                                                                    alt={conversations.find(c => c.id === selectedConversation)?.recipient.name}
                                                                />
                                                            )}
                                                            <div
                                                                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${isOwn
                                                                        ? 'bg-primary-500 text-white rounded-br-none'
                                                                        : 'bg-white border border-neutral-200 rounded-bl-none'
                                                                    }`}
                                                            >
                                                                <p className={`text-sm ${isOwn ? 'text-white' : 'text-neutral-800'}`}>
                                                                    {message.text}
                                                                </p>
                                                                {message.attachments && message.attachments.length > 0 && (
                                                                    <div className="mt-2">
                                                                        {message.attachments.map((attachment: any) => (
                                                                            <div
                                                                                key={attachment.id}
                                                                                className={`flex items-center p-2 rounded mt-1 ${isOwn ? 'bg-primary-600' : 'bg-neutral-100'
                                                                                    }`}
                                                                            >
                                                                                <svg
                                                                                    className={`h-5 w-5 mr-2 ${isOwn ? 'text-white' : 'text-neutral-500'}`}
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    stroke="currentColor"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        strokeWidth={2}
                                                                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                                                    />
                                                                                </svg>
                                                                                <div className={`flex flex-col ${isOwn ? 'text-white' : 'text-neutral-800'}`}>
                                                                                    <span className="text-xs font-medium">{attachment.name}</span>
                                                                                    <span className="text-xs">{attachment.size}</span>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                <div
                                                                    className={`text-xs mt-1 ${isOwn ? 'text-primary-200' : 'text-neutral-500'
                                                                        }`}
                                                                >
                                                                    {message.timestamp}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div ref={messageEndRef} />
                                        </div>
                                    </div>

                                    {/* Mesaj Giriş Alanı */}
                                    <div className="p-4 border-t border-neutral-200">
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }}
                                            className="flex items-end"
                                        >
                                            <div className="relative flex-1">
                                                <textarea
                                                    placeholder="Mesajınızı yazın..."
                                                    className="w-full p-3 pr-12 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                                    rows={2}
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleSendMessage();
                                                        }
                                                    }}
                                                />
                                                <div className="absolute bottom-3 right-3 flex space-x-1">
                                                    <label className="p-1 text-neutral-500 hover:text-neutral-700 cursor-pointer">
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                            />
                                                        </svg>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            onChange={handleFileUpload}
                                                            multiple
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                className="ml-2 p-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                                disabled={!newMessage.trim()}
                                            >
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                                    />
                                                </svg>
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <svg
                                        className="h-16 w-16 text-neutral-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-lg font-medium text-neutral-900">Mesajlarınız</h3>
                                    <p className="mt-1 text-neutral-500">
                                        Mesajlaşmaya başlamak için sol taraftan bir konuşma seçin.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Messages; 