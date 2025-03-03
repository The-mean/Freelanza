import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/dashboard/Sidebar';

interface Message {
    id: number;
    text: string;
    sentAt: string;
    sender: number;
    isRead: boolean;
}

interface Conversation {
    id: number;
    with: {
        id: number;
        name: string;
        profilePic: string;
        lastSeen: string;
    };
    lastMessage: {
        text: string;
        sentAt: string;
        isRead: boolean;
        sender: number;
    };
    unreadCount: number;
}

// Örnek mesaj verileri
const CONVERSATIONS: Conversation[] = [
    {
        id: 1,
        with: {
            id: 2,
            name: 'Ahmet Yılmaz',
            profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
            lastSeen: '14:30'
        },
        lastMessage: {
            text: 'Projenin detaylarını gözden geçirdim, yarın sizinle görüşmek isterim.',
            sentAt: '14:30',
            isRead: true,
            sender: 2
        },
        unreadCount: 0
    },
    {
        id: 2,
        with: {
            id: 3,
            name: 'Ayşe Demir',
            profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
            lastSeen: '12:45'
        },
        lastMessage: {
            text: 'Ödeme sistemi entegrasyonu tamamlandı, test edebilirsiniz.',
            sentAt: '12:45',
            isRead: false,
            sender: 3
        },
        unreadCount: 3
    },
    {
        id: 3,
        with: {
            id: 4,
            name: 'Mehmet Kaya',
            profilePic: 'https://randomuser.me/api/portraits/men/22.jpg',
            lastSeen: 'Çevrimiçi'
        },
        lastMessage: {
            text: 'UI tasarımlarında bazı değişiklikler yapabilir miyiz?',
            sentAt: 'Dün',
            isRead: true,
            sender: 1
        },
        unreadCount: 0
    },
    {
        id: 4,
        with: {
            id: 5,
            name: 'Zeynep Şahin',
            profilePic: 'https://randomuser.me/api/portraits/women/22.jpg',
            lastSeen: '2 saat önce'
        },
        lastMessage: {
            text: 'Yeni projemiz için teklif gönderdim, kontrol edebilir misiniz?',
            sentAt: '2 gün önce',
            isRead: true,
            sender: 5
        },
        unreadCount: 0
    }
];

// Örnek mesaj detayları
const MESSAGE_DETAILS: Record<number, Message[]> = {
    1: [
        {
            id: 101,
            text: 'Merhaba, web sitesi tasarımı hakkında bazı sorularım var.',
            sentAt: '14:20',
            sender: 1,
            isRead: true
        },
        {
            id: 102,
            text: 'Merhaba, tabii ki. Nasıl yardımcı olabilirim?',
            sentAt: '14:22',
            sender: 2,
            isRead: true
        },
        {
            id: 103,
            text: 'Responsive tasarım konusunda önerileriniz neler olur?',
            sentAt: '14:25',
            sender: 1,
            isRead: true
        },
        {
            id: 104,
            text: 'Bootstrap veya Tailwind CSS kullanmanızı öneririm. Ayrıca mobil öncelikli tasarım yaklaşımını benimsemelisiniz.',
            sentAt: '14:28',
            sender: 2,
            isRead: true
        },
        {
            id: 105,
            text: 'Projenin detaylarını gözden geçirdim, yarın sizinle görüşmek isterim.',
            sentAt: '14:30',
            sender: 2,
            isRead: true
        }
    ],
    2: [
        {
            id: 201,
            text: 'Ödeme sistemi entegrasyonu için hangi API\'yi kullanmamı önerirsiniz?',
            sentAt: '12:30',
            sender: 1,
            isRead: true
        },
        {
            id: 202,
            text: 'Stripe veya Iyzico iyi seçenekler olabilir. Türkiye\'de Iyzico daha yaygın kullanılıyor.',
            sentAt: '12:35',
            sender: 3,
            isRead: true
        },
        {
            id: 203,
            text: 'Teşekkürler, Iyzico\'yu tercih edeceğim.',
            sentAt: '12:40',
            sender: 1,
            isRead: true
        },
        {
            id: 204,
            text: 'Ödeme sistemi entegrasyonu tamamlandı, test edebilirsiniz.',
            sentAt: '12:45',
            sender: 3,
            isRead: false
        },
        {
            id: 205,
            text: 'Ayrıca webhook\'ları da yapılandırdım.',
            sentAt: '12:46',
            sender: 3,
            isRead: false
        },
        {
            id: 206,
            text: 'Ve ödeme başarısız olduğunda kullanıcıya otomatik bildirim gönderiliyor.',
            sentAt: '12:47',
            sender: 3,
            isRead: false
        }
    ]
};

export default function Messages() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState('');
    const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // localStorage'dan token kontrolü
        const token = localStorage.getItem('token');
        const type = localStorage.getItem('userType');

        if (!token) {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
            setUserType(type || '');

            // İlk konuşmayı varsayılan olarak seç
            if (CONVERSATIONS.length > 0) {
                setSelectedConversation(CONVERSATIONS[0].id);
                setMessages(MESSAGE_DETAILS[CONVERSATIONS[0].id] || []);
            }
        }
    }, [router]);

    const handleSelectConversation = (id: number) => {
        setSelectedConversation(id);
        setMessages(MESSAGE_DETAILS[id] || []);

        // Okunmamış mesajları okundu olarak işaretle (gerçek uygulamada API çağrısı yapılır)
        const updatedConversations = CONVERSATIONS.map(conv => {
            if (conv.id === id) {
                return { ...conv, unreadCount: 0 };
            }
            return conv;
        });
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || !selectedConversation) return;

        // Yeni mesaj oluştur (gerçek uygulamada API çağrısı yapılır)
        const newMessageObj: Message = {
            id: Date.now(),
            text: newMessage,
            sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 1, // Kendi ID'miz
            isRead: false
        };

        // Mesajlar listesine ekle
        setMessages([...messages, newMessageObj]);

        // Konuşmada son mesajı güncelle
        const updatedConversations = CONVERSATIONS.map(conv => {
            if (conv.id === selectedConversation) {
                return {
                    ...conv,
                    lastMessage: {
                        text: newMessage,
                        sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        isRead: false,
                        sender: 1
                    }
                };
            }
            return conv;
        });

        // Mesaj input'unu temizle
        setNewMessage('');
    };

    // Konuşmaları filtreleme
    const filteredConversations = CONVERSATIONS.filter(conv =>
        conv.with.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Yükleniyor durumu
    if (!isAuthenticated) {
        return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>Mesajlarım | Freelanza</title>
                <meta name="description" content="Freelanza mesajlaşma platformu" />
            </Head>

            <Header />

            <div className="flex flex-grow">
                <Sidebar userType={userType} />

                <div className="flex-grow">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-2xl font-bold mb-6">Mesajlarım</h1>

                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="flex h-[calc(80vh-120px)]">
                                {/* Konuşmalar Listesi */}
                                <div className="w-1/3 border-r border-gray-200">
                                    <div className="p-4 border-b border-gray-200">
                                        <input
                                            type="text"
                                            placeholder="Konuşma ara..."
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <div className="overflow-y-auto h-[calc(80vh-180px)]">
                                        {filteredConversations.map(conversation => (
                                            <div
                                                key={conversation.id}
                                                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${selectedConversation === conversation.id ? 'bg-blue-50' : ''
                                                    }`}
                                                onClick={() => handleSelectConversation(conversation.id)}
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={conversation.with.profilePic}
                                                        alt={conversation.with.name}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    {conversation.with.lastSeen === 'Çevrimiçi' && (
                                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                                                    )}
                                                </div>

                                                <div className="ml-4 flex-grow">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="font-semibold">{conversation.with.name}</h3>
                                                        <span className="text-xs text-gray-500">{conversation.lastMessage.sentAt}</span>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <p className={`text-sm truncate w-40 ${!conversation.lastMessage.isRead && conversation.lastMessage.sender !== 1
                                                                ? 'font-semibold text-gray-900'
                                                                : 'text-gray-500'
                                                            }`}>
                                                            {conversation.lastMessage.sender === 1 ? 'Siz: ' : ''}
                                                            {conversation.lastMessage.text}
                                                        </p>

                                                        {conversation.unreadCount > 0 && (
                                                            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                                {conversation.unreadCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Mesaj İçeriği */}
                                <div className="w-2/3 flex flex-col">
                                    {selectedConversation ? (
                                        <>
                                            {/* Mesaj Başlığı */}
                                            <div className="p-4 border-b border-gray-200 flex items-center">
                                                {CONVERSATIONS.find(c => c.id === selectedConversation)?.with && (
                                                    <>
                                                        <img
                                                            src={CONVERSATIONS.find(c => c.id === selectedConversation)?.with.profilePic}
                                                            alt={CONVERSATIONS.find(c => c.id === selectedConversation)?.with.name}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                        <div className="ml-3">
                                                            <h3 className="font-semibold">
                                                                {CONVERSATIONS.find(c => c.id === selectedConversation)?.with.name}
                                                            </h3>
                                                            <p className="text-xs text-gray-500">
                                                                {CONVERSATIONS.find(c => c.id === selectedConversation)?.with.lastSeen}
                                                            </p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Mesaj İçeriği */}
                                            <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
                                                <div className="space-y-4">
                                                    {messages.map(message => (
                                                        <div
                                                            key={message.id}
                                                            className={`flex ${message.sender === 1 ? 'justify-end' : 'justify-start'}`}
                                                        >
                                                            <div
                                                                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${message.sender === 1
                                                                        ? 'bg-blue-500 text-white rounded-br-none'
                                                                        : 'bg-white border border-gray-200 rounded-bl-none'
                                                                    }`}
                                                            >
                                                                <p>{message.text}</p>
                                                                <span
                                                                    className={`text-xs block text-right mt-1 ${message.sender === 1 ? 'text-blue-100' : 'text-gray-500'
                                                                        }`}
                                                                >
                                                                    {message.sentAt}
                                                                    {message.sender === 1 && (
                                                                        <span className="ml-1">
                                                                            {message.isRead ? (
                                                                                <i className="fas fa-check-double"></i>
                                                                            ) : (
                                                                                <i className="fas fa-check"></i>
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Mesaj Gönderme Formu */}
                                            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex">
                                                <input
                                                    type="text"
                                                    placeholder="Mesajınızı yazın..."
                                                    className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                />
                                                <button
                                                    type="submit"
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <i className="fas fa-paper-plane"></i>
                                                </button>
                                            </form>
                                        </>
                                    ) : (
                                        <div className="flex-grow flex items-center justify-center">
                                            <div className="text-center text-gray-500">
                                                <i className="fas fa-comments text-5xl mb-4"></i>
                                                <p>Mesajlaşmak için bir konuşma seçin.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}