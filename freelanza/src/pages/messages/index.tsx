import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Mesaj tipi tanımı
type Message = {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: string;
    isRead: boolean;
};

// Kullanıcı tipi tanımı
type User = {
    id: number;
    name: string;
    avatar: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount?: number;
    isOnline: boolean;
};

export default function Messages() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');
    const [contacts, setContacts] = useState<User[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentUserId = 1; // Giriş yapmış kullanıcının ID'si (normalde API'den gelir)

    // Kimlik doğrulama kontrolü
    useEffect(() => {
        // Gerçek uygulamada API'den doğrulama yapılır
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login?redirect=/messages');
            return;
        }
        setIsAuthenticated(true);
        setIsLoading(false);
    }, [router]);

    // Örnek kullanıcı verileri (gerçekte API'den gelir)
    useEffect(() => {
        const mockContacts = [
            { id: 2, name: 'Mehmet Demir', avatar: '/images/avatars/avatar-1.jpg', lastMessage: 'Merhaba, projeniz hakkında konuşabilir miyiz?', lastMessageTime: '10:30', unreadCount: 2, isOnline: true },
            { id: 3, name: 'Zeynep Kaya', avatar: '/images/avatars/avatar-2.jpg', lastMessage: 'Teklif için teşekkürler, düşüneceğim.', lastMessageTime: 'Dün', unreadCount: 0, isOnline: false },
            { id: 4, name: 'Emre Yılmaz', avatar: '/images/avatars/avatar-3.jpg', lastMessage: 'Proje tamamlandı, son dosyaları gönderiyorum.', lastMessageTime: 'Pazartesi', unreadCount: 0, isOnline: true },
            { id: 5, name: 'Ayşe Öztürk', avatar: '/images/avatars/avatar-4.jpg', lastMessage: 'Revizyon taleplerinizi aldım, bugün tamamlayacağım.', lastMessageTime: '23/04', unreadCount: 0, isOnline: false },
            { id: 6, name: 'Can Kaya', avatar: '/images/avatars/avatar-5.jpg', lastMessage: 'Fiyat teklifinizi kabul ediyorum.', lastMessageTime: '18/04', unreadCount: 1, isOnline: true },
        ];

        setContacts(mockContacts);
        setFilteredContacts(mockContacts);

        // İlk kişiyi seç
        if (mockContacts.length > 0 && !selectedUserId) {
            setSelectedUserId(mockContacts[0].id);
        }
    }, [selectedUserId]);

    // Kişi arama işlevi
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredContacts(contacts);
        } else {
            const filtered = contacts.filter(contact =>
                contact.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredContacts(filtered);
        }
    }, [searchTerm, contacts]);

    // Seçili kullanıcı değiştiğinde mesajları yükle
    useEffect(() => {
        if (selectedUserId) {
            // Gerçek uygulamada API'den mesajlar alınır
            const mockMessages = [
                { id: 1, senderId: currentUserId, receiverId: selectedUserId, content: 'Merhaba, nasılsınız?', timestamp: '10:20', isRead: true },
                { id: 2, senderId: selectedUserId, receiverId: currentUserId, content: 'İyiyim teşekkürler, siz nasılsınız?', timestamp: '10:22', isRead: true },
                { id: 3, senderId: currentUserId, receiverId: selectedUserId, content: 'Ben de iyiyim. Projeniz hakkında konuşabilir miyiz?', timestamp: '10:25', isRead: true },
                { id: 4, senderId: selectedUserId, receiverId: currentUserId, content: 'Tabii ki, hangi proje hakkında bilgi almak istiyorsunuz?', timestamp: '10:28', isRead: true },
                { id: 5, senderId: currentUserId, receiverId: selectedUserId, content: 'Web sitesi tasarımı için paylaştığınız ilan hakkında detaylı bilgi almak istiyorum.', timestamp: '10:30', isRead: true },
                { id: 6, senderId: selectedUserId, receiverId: currentUserId, content: 'Elbette, site için responsive bir tasarım düşünüyorum. Mobil uyumlu ve modern bir arayüz olacak.', timestamp: '10:32', isRead: false },
            ];

            setMessages(mockMessages);

            // Okunmamış mesajları okundu olarak işaretle
            const updatedContacts = contacts.map(contact => {
                if (contact.id === selectedUserId) {
                    return { ...contact, unreadCount: 0 };
                }
                return contact;
            });

            setContacts(updatedContacts);
            setFilteredContacts(updatedContacts);
        }
    }, [selectedUserId, contacts, currentUserId]);

    // Mesaj gönderme
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (message.trim() === '' || !selectedUserId) return;

        // Yeni mesaj oluştur
        const newMessage: Message = {
            id: messages.length + 1,
            senderId: currentUserId,
            receiverId: selectedUserId,
            content: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false,
        };

        // Mesajları güncelle
        setMessages([...messages, newMessage]);

        // İlgili kişinin son mesajını güncelle
        const updatedContacts = contacts.map(contact => {
            if (contact.id === selectedUserId) {
                return {
                    ...contact,
                    lastMessage: message,
                    lastMessageTime: 'Şimdi',
                };
            }
            return contact;
        });

        setContacts(updatedContacts);
        setFilteredContacts(
            searchTerm.trim() === ''
                ? updatedContacts
                : updatedContacts.filter(contact =>
                    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
        );

        // Mesaj kutusunu temizle
        setMessage('');
    };

    // Mesajlar yüklendiğinde otomatik olarak en altta konumlan
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Yönlendirme yapılıyor, içerik gösterme
    }

    const selectedUser = contacts.find(c => c.id === selectedUserId);

    return (
        <>
            <Head>
                <title>Mesajlar - Freelanza</title>
                <meta name="description" content="Freelanza mesajlaşma sistemi" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            </Head>

            <div className="flex flex-col min-h-screen">
                <Header />

                <main className="flex-grow bg-gray-50 py-6">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="flex flex-col md:flex-row h-[calc(100vh-200px)]">
                                {/* Sol Kısım - Kişi Listesi */}
                                <div className="w-full md:w-1/3 border-r border-gray-200 bg-white">
                                    <div className="p-4 border-b border-gray-200">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <i className="fas fa-search text-gray-400"></i>
                                            </div>
                                            <input
                                                type="text"
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                                                placeholder="Kişi ara..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="overflow-y-auto h-full pb-16">
                                        {filteredContacts.length === 0 ? (
                                            <div className="text-center p-6 text-gray-500">
                                                Kişi bulunamadı
                                            </div>
                                        ) : (
                                            <ul className="divide-y divide-gray-200">
                                                {filteredContacts.map((contact) => (
                                                    <li
                                                        key={contact.id}
                                                        onClick={() => setSelectedUserId(contact.id)}
                                                        className={`cursor-pointer hover:bg-gray-50 ${selectedUserId === contact.id ? 'bg-blue-50' : ''
                                                            }`}
                                                    >
                                                        <div className="px-4 py-3 flex items-center">
                                                            <div className="relative">
                                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                                    {contact.avatar ? (
                                                                        <Image
                                                                            src={contact.avatar}
                                                                            alt={contact.name}
                                                                            width={40}
                                                                            height={40}
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <span className="text-gray-500 text-lg font-semibold">
                                                                            {contact.name.charAt(0)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {contact.isOnline && (
                                                                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                                                                )}
                                                            </div>
                                                            <div className="ml-3 flex-1 min-w-0">
                                                                <div className="flex items-center justify-between">
                                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                                        {contact.name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {contact.lastMessageTime}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center justify-between mt-1">
                                                                    <p className="text-xs text-gray-500 truncate">
                                                                        {contact.lastMessage}
                                                                    </p>
                                                                    {contact.unreadCount && contact.unreadCount > 0 ? (
                                                                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-xs font-medium text-white">
                                                                            {contact.unreadCount}
                                                                        </span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                {/* Sağ Kısım - Mesaj İçeriği */}
                                <div className="w-full md:w-2/3 flex flex-col bg-gray-50">
                                    {selectedUserId ? (
                                        <>
                                            {/* Seçili kullanıcı başlığı */}
                                            <div className="p-3 border-b border-gray-200 bg-white flex items-center">
                                                <div className="relative mr-3">
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                        {selectedUser?.avatar ? (
                                                            <Image
                                                                src={selectedUser.avatar}
                                                                alt={selectedUser.name}
                                                                width={40}
                                                                height={40}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-gray-500 text-lg font-semibold">
                                                                {selectedUser?.name.charAt(0)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {selectedUser?.isOnline && (
                                                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                                                    )}
                                                </div>
                                                <div>
                                                    <h2 className="text-sm font-medium text-gray-900">{selectedUser?.name}</h2>
                                                    <p className="text-xs text-gray-500">
                                                        {selectedUser?.isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
                                                    </p>
                                                </div>
                                                <div className="ml-auto">
                                                    <Link href={`/profile/${selectedUserId}`} className="text-blue-600 hover:text-blue-800 text-sm">
                                                        Profili Görüntüle
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Mesaj içeriği */}
                                            <div className="flex-grow overflow-y-auto p-4">
                                                <div className="space-y-4">
                                                    {messages.map((msg) => (
                                                        <div
                                                            key={msg.id}
                                                            className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'
                                                                }`}
                                                        >
                                                            <div
                                                                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-lg ${msg.senderId === currentUserId
                                                                        ? 'bg-blue-600 text-white'
                                                                        : 'bg-white text-gray-800 border border-gray-200'
                                                                    }`}
                                                            >
                                                                <p className="text-sm">{msg.content}</p>
                                                                <div
                                                                    className={`text-xs mt-1 ${msg.senderId === currentUserId ? 'text-blue-100' : 'text-gray-500'
                                                                        } flex justify-end items-center`}
                                                                >
                                                                    {msg.timestamp}
                                                                    {msg.senderId === currentUserId && (
                                                                        <span className="ml-1">
                                                                            {msg.isRead ? (
                                                                                <i className="fas fa-check-double"></i>
                                                                            ) : (
                                                                                <i className="fas fa-check"></i>
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div ref={messagesEndRef} />
                                                </div>
                                            </div>

                                            {/* Mesaj gönderme formu */}
                                            <div className="p-3 border-t border-gray-200 bg-white">
                                                <form onSubmit={handleSendMessage} className="flex space-x-2">
                                                    <div className="flex-grow">
                                                        <input
                                                            type="text"
                                                            className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                            placeholder="Mesajınızı yazın..."
                                                            value={message}
                                                            onChange={(e) => setMessage(e.target.value)}
                                                        />
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <i className="fas fa-paper-plane mr-1"></i>
                                                        Gönder
                                                    </button>
                                                </form>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-grow flex items-center justify-center">
                                            <div className="text-center p-6">
                                                <div className="text-gray-400 text-5xl mb-4">
                                                    <i className="far fa-comments"></i>
                                                </div>
                                                <h3 className="text-xl font-medium text-gray-700 mb-1">Mesajlarınız</h3>
                                                <p className="text-gray-500">
                                                    Mesajlaşmak için sol taraftan bir kişi seçin veya
                                                    <Link href="/freelancers" className="text-blue-600 hover:text-blue-800 ml-1">
                                                        yeni bir freelancer bulun
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
} 