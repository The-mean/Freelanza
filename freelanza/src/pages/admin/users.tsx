import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/dashboard/Sidebar';

// Kullanıcı arayüzü
interface User {
    id: number;
    name: string;
    email: string;
    type: 'freelancer' | 'employer' | 'admin';
    status: 'active' | 'pending' | 'suspended' | 'deactivated';
    createdAt: string;
    avatar?: string;
    location?: string;
    skills?: string[];
    rating?: number;
    completedJobs?: number;
}

export default function AdminUsers() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    // Örnek kullanıcılar
    const SAMPLE_USERS: User[] = [
        {
            id: 1,
            name: 'Ahmet Yılmaz',
            email: 'ahmet@example.com',
            type: 'freelancer',
            status: 'active',
            createdAt: '2023-02-15',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            location: 'İstanbul, Türkiye',
            skills: ['React', 'Node.js', 'JavaScript'],
            rating: 4.8,
            completedJobs: 24
        },
        {
            id: 2,
            name: 'Ayşe Demir',
            email: 'ayse@example.com',
            type: 'freelancer',
            status: 'active',
            createdAt: '2023-03-10',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            location: 'Ankara, Türkiye',
            skills: ['UI/UX Design', 'Figma', 'Adobe XD'],
            rating: 4.9,
            completedJobs: 18
        },
        {
            id: 3,
            name: 'Mehmet Kaya',
            email: 'mehmet@example.com',
            type: 'employer',
            status: 'active',
            createdAt: '2023-01-05',
            avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
            location: 'İzmir, Türkiye'
        },
        {
            id: 4,
            name: 'Zeynep Şahin',
            email: 'zeynep@example.com',
            type: 'employer',
            status: 'active',
            createdAt: '2023-04-20',
            avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
            location: 'Bursa, Türkiye'
        },
        {
            id: 5,
            name: 'Ali Öztürk',
            email: 'ali@example.com',
            type: 'freelancer',
            status: 'pending',
            createdAt: '2023-05-12',
            avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
            location: 'Antalya, Türkiye',
            skills: ['Mobile Development', 'Flutter', 'React Native'],
            rating: 0,
            completedJobs: 0
        },
        {
            id: 6,
            name: 'Selin Arslan',
            email: 'selin@example.com',
            type: 'freelancer',
            status: 'suspended',
            createdAt: '2023-02-28',
            avatar: 'https://randomuser.me/api/portraits/women/56.jpg',
            location: 'İstanbul, Türkiye',
            skills: ['Content Writing', 'SEO', 'Copywriting'],
            rating: 3.2,
            completedJobs: 7
        },
        {
            id: 7,
            name: 'Can Yıldırım',
            email: 'can@example.com',
            type: 'employer',
            status: 'deactivated',
            createdAt: '2023-01-17',
            avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
            location: 'Eskişehir, Türkiye'
        },
        {
            id: 8,
            name: 'Admin',
            email: 'admin@freelanza.com',
            type: 'admin',
            status: 'active',
            createdAt: '2023-01-01',
            avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
            location: 'İstanbul, Türkiye'
        }
    ];

    useEffect(() => {
        // Admin tokenı kontrolü
        const adminToken = localStorage.getItem('adminToken');

        if (!adminToken) {
            router.push('/admin/login');
        } else {
            setIsAuthenticated(true);

            // Örnek verilerle kullanıcı listesini doldur
            setUsers(SAMPLE_USERS);
            setTotalPages(Math.ceil(SAMPLE_USERS.length / 10)); // 10 kullanıcı per sayfa
            setLoading(false);
        }
    }, [router]);

    // Kullanıcı filtreleme fonksiyonu
    const filteredUsers = users.filter(user => {
        // Arama terimini kontrol et
        const searchMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtre durumunu kontrol et
        let filterMatch = true;
        if (filter !== 'all') {
            if (filter === 'freelancer' || filter === 'employer' || filter === 'admin') {
                filterMatch = user.type === filter;
            } else {
                filterMatch = user.status === filter;
            }
        }

        return searchMatch && filterMatch;
    });

    // Sayfalandırılmış kullanıcılar
    const paginatedUsers = filteredUsers.slice((page - 1) * 10, page * 10);

    // Kullanıcı detaylarını göster
    const handleViewUser = (user: User) => {
        setSelectedUser(user);
        setIsUserModalOpen(true);
    };

    // Kullanıcı durumunu güncelle
    const handleUpdateStatus = (userId: number, newStatus: User['status']) => {
        // Gerçek uygulamada burada API çağrısı yapılır
        const updatedUsers = users.map(user => {
            if (user.id === userId) {
                return { ...user, status: newStatus };
            }
            return user;
        });

        setUsers(updatedUsers);

        // Eğer kullanıcı modalı açıksa, seçili kullanıcıyı da güncelle
        if (selectedUser && selectedUser.id === userId) {
            setSelectedUser({ ...selectedUser, status: newStatus });
        }
    };

    // Kullanıcı silme
    const handleDeleteUser = (userId: number) => {
        // Kullanıcıyı silmeden önce onay iste
        if (window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
            // Gerçek uygulamada burada API çağrısı yapılır
            const updatedUsers = users.filter(user => user.id !== userId);
            setUsers(updatedUsers);

            // Eğer silinen kullanıcı modalda gösteriliyorsa, modalı kapat
            if (selectedUser && selectedUser.id === userId) {
                setIsUserModalOpen(false);
                setSelectedUser(null);
            }
        }
    };

    // Yükleniyor durumu
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>Kullanıcı Yönetimi | Freelanza Admin</title>
                <meta name="description" content="Freelanza kullanıcı yönetim paneli" />
            </Head>

            <Header />

            <div className="flex flex-grow">
                <Sidebar userType="admin" />

                <div className="flex-grow bg-gray-50">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">Kullanıcı Yönetimi</h1>

                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
                                onClick={() => alert('Yeni kullanıcı ekleme özelliği eklenecek')}
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Kullanıcı Ekle
                            </button>
                        </div>

                        {/* Arama ve Filtreleme */}
                        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                                <div className="flex-grow md:mr-4">
                                    <input
                                        type="text"
                                        placeholder="İsim, email veya ID ile ara..."
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                    <select
                                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                    >
                                        <option value="all">Tüm Kullanıcılar</option>
                                        <option value="freelancer">Freelancer</option>
                                        <option value="employer">İşveren</option>
                                        <option value="admin">Admin</option>
                                        <option value="active">Aktif</option>
                                        <option value="pending">Onay Bekleyen</option>
                                        <option value="suspended">Askıya Alınmış</option>
                                        <option value="deactivated">Devre Dışı</option>
                                    </select>

                                    <button
                                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 focus:outline-none"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilter('all');
                                        }}
                                    >
                                        <i className="fas fa-sync-alt mr-2"></i>
                                        Filtreleri Sıfırla
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Kullanıcı Tablosu */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Kullanıcı
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tür
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Durum
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Kayıt Tarihi
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                İşlemler
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {paginatedUsers.length > 0 ? (
                                            paginatedUsers.map(user => (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <img
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                    src={user.avatar || 'https://via.placeholder.com/150'}
                                                                    alt={user.name}
                                                                />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                                <div className="text-sm text-gray-500">{user.email}</div>
                                                                {user.location && (
                                                                    <div className="text-xs text-gray-400">{user.location}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.type === 'freelancer'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : user.type === 'employer'
                                                                    ? 'bg-purple-100 text-purple-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {user.type === 'freelancer'
                                                                ? 'Freelancer'
                                                                : user.type === 'employer'
                                                                    ? 'İşveren'
                                                                    : 'Admin'}
                                                        </span>
                                                        {user.type === 'freelancer' && user.rating !== undefined && (
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                <span className="text-yellow-500 mr-1">
                                                                    <i className="fas fa-star"></i>
                                                                </span>
                                                                {user.rating} • {user.completedJobs} iş
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'active'
                                                                ? 'bg-green-100 text-green-800'
                                                                : user.status === 'pending'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : user.status === 'suspended'
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {user.status === 'active'
                                                                ? 'Aktif'
                                                                : user.status === 'pending'
                                                                    ? 'Onay Bekliyor'
                                                                    : user.status === 'suspended'
                                                                        ? 'Askıya Alındı'
                                                                        : 'Devre Dışı'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => handleViewUser(user)}
                                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </button>

                                                        <button
                                                            onClick={() => alert(`${user.name} kullanıcısı için düzenleme formu eklenecek`)}
                                                            className="text-yellow-600 hover:text-yellow-900 mr-3"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>

                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                                    Kriterlere uygun kullanıcı bulunamadı.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Sayfalama */}
                        {filteredUsers.length > 10 && (
                            <div className="flex justify-center">
                                <nav className="flex items-center">
                                    <button
                                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                                        disabled={page === 1}
                                        className={`px-3 py-1 rounded-md mr-2 ${page === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>

                                    <div className="text-sm text-gray-700">
                                        Sayfa {page} / {Math.ceil(filteredUsers.length / 10)}
                                    </div>

                                    <button
                                        onClick={() => setPage(p => Math.min(p + 1, Math.ceil(filteredUsers.length / 10)))}
                                        disabled={page === Math.ceil(filteredUsers.length / 10)}
                                        className={`px-3 py-1 rounded-md ml-2 ${page === Math.ceil(filteredUsers.length / 10)
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Kullanıcı Detay Modalı */}
            {isUserModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold">Kullanıcı Detayları</h2>
                            <button
                                onClick={() => setIsUserModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
                                <img
                                    src={selectedUser.avatar || 'https://via.placeholder.com/150'}
                                    alt={selectedUser.name}
                                    className="w-20 h-20 rounded-full object-cover mb-4 sm:mb-0 sm:mr-6"
                                />

                                <div>
                                    <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                                    <p className="text-gray-600">{selectedUser.email}</p>
                                    {selectedUser.location && (
                                        <p className="text-gray-500 text-sm mt-1">
                                            <i className="fas fa-map-marker-alt mr-1"></i>
                                            {selectedUser.location}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Genel Bilgiler</h4>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="mb-3">
                                            <span className="text-gray-500 text-sm">ID:</span>
                                            <p>{selectedUser.id}</p>
                                        </div>
                                        <div className="mb-3">
                                            <span className="text-gray-500 text-sm">Kullanıcı Türü:</span>
                                            <p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedUser.type === 'freelancer'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : selectedUser.type === 'employer'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {selectedUser.type === 'freelancer'
                                                        ? 'Freelancer'
                                                        : selectedUser.type === 'employer'
                                                            ? 'İşveren'
                                                            : 'Admin'}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="mb-3">
                                            <span className="text-gray-500 text-sm">Durum:</span>
                                            <p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedUser.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : selectedUser.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : selectedUser.status === 'suspended'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {selectedUser.status === 'active'
                                                        ? 'Aktif'
                                                        : selectedUser.status === 'pending'
                                                            ? 'Onay Bekliyor'
                                                            : selectedUser.status === 'suspended'
                                                                ? 'Askıya Alındı'
                                                                : 'Devre Dışı'}
                                                </span>
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-sm">Kayıt Tarihi:</span>
                                            <p>{new Date(selectedUser.createdAt).toLocaleDateString('tr-TR')}</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedUser.type === 'freelancer' && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Freelancer Bilgileri</h4>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="mb-3">
                                                <span className="text-gray-500 text-sm">Değerlendirme:</span>
                                                <p className="flex items-center">
                                                    <span className="text-yellow-500 mr-1">
                                                        <i className="fas fa-star"></i>
                                                    </span>
                                                    {selectedUser.rating} / 5
                                                </p>
                                            </div>
                                            <div className="mb-3">
                                                <span className="text-gray-500 text-sm">Tamamlanan İşler:</span>
                                                <p>{selectedUser.completedJobs}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 text-sm">Yetenekler:</span>
                                                <div className="flex flex-wrap mt-1">
                                                    {selectedUser.skills?.map((skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-2"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-6">
                                <h4 className="text-sm font-medium text-gray-500 uppercase mb-4">İşlemler</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedUser.status !== 'active' && (
                                        <button
                                            onClick={() => handleUpdateStatus(selectedUser.id, 'active')}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                        >
                                            <i className="fas fa-check mr-2"></i>
                                            Aktif Et
                                        </button>
                                    )}

                                    {selectedUser.status !== 'suspended' && (
                                        <button
                                            onClick={() => handleUpdateStatus(selectedUser.id, 'suspended')}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                        >
                                            <i className="fas fa-ban mr-2"></i>
                                            Askıya Al
                                        </button>
                                    )}

                                    {selectedUser.status !== 'deactivated' && (
                                        <button
                                            onClick={() => handleUpdateStatus(selectedUser.id, 'deactivated')}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                        >
                                            <i className="fas fa-times-circle mr-2"></i>
                                            Devre Dışı Bırak
                                        </button>
                                    )}

                                    <button
                                        onClick={() => alert(`${selectedUser.name} kullanıcısı için düzenleme formu eklenecek`)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    >
                                        <i className="fas fa-edit mr-2"></i>
                                        Düzenle
                                    </button>

                                    <button
                                        onClick={() => {
                                            handleDeleteUser(selectedUser.id);
                                        }}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                    >
                                        <i className="fas fa-trash-alt mr-2"></i>
                                        Sil
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
} 