// User types
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'freelancer' | 'client' | 'admin';
    avatar?: string;
    title?: string;
    location?: string;
    about?: string;
    skills?: string[];
    hourlyRate?: number;
    memberSince: string;
    isVerified: boolean;
}

// Auth types
export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    name: string;
    role: 'freelancer' | 'client';
}

// Job types
export interface Job {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    budget: number;
    duration?: string;
    expertise?: 'beginner' | 'intermediate' | 'expert';
    createdAt: string;
    deadline?: string;
    company: string;
    category: string;
    skills: string[];
    location?: string;
    proposals?: number;
    attachments?: Attachment[];
    questions?: Question[];
    status?: 'open' | 'in-progress' | 'completed' | 'cancelled';
}

export interface Attachment {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
}

export interface Question {
    id: string;
    text: string;
}

// Proposal types
export interface Proposal {
    id: string;
    jobId: string;
    freelancerId: string;
    clientId: string;
    coverLetter: string;
    bidAmount: number;
    deliveryTime: number;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    attachments?: Attachment[];
    answers?: Answer[];
}

export interface Answer {
    questionId: string;
    answer: string;
}

// Profile types
export interface Profile extends User {
    completedJobs?: number;
    inProgressJobs?: number;
    rating?: number;
    totalReviews?: number;
    languages?: Language[];
    education?: Education[];
    experience?: Experience[];
    portfolio?: PortfolioItem[];
    reviews?: Review[];
}

export interface Language {
    id: string;
    name: string;
    level: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    from: string;
    to?: string;
    current?: boolean;
    description?: string;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    from: string;
    to?: string;
    current?: boolean;
    description?: string;
}

export interface PortfolioItem {
    id: string;
    title: string;
    description?: string;
    image?: string;
    link?: string;
    createdAt: string;
}

export interface Review {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    text?: string;
    createdAt: string;
    job?: {
        id: string;
        title: string;
    };
}

// Message types
export interface Conversation {
    id: string;
    participants: {
        id: string;
        name: string;
        avatar?: string;
    }[];
    lastMessage: {
        id: string;
        senderId: string;
        text: string;
        createdAt: string;
    };
    unreadCount: number;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    text: string;
    createdAt: string;
    attachments?: Attachment[];
}

// Payment types
export interface Payment {
    id: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    type: 'deposit' | 'withdrawal' | 'payment' | 'refund';
    createdAt: string;
    jobId?: string;
    jobTitle?: string;
    description?: string;
}

export interface PaymentMethod {
    id: string;
    type: 'card' | 'paypal' | 'bank';
    name: string;
    isDefault: boolean;
    details: any;
}

// Notification types
export interface Notification {
    id: string;
    type: 'message' | 'proposal' | 'job' | 'payment' | 'system';
    content: string;
    createdAt: string;
    isRead: boolean;
    link?: string;
}

// API response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Form Error types
export interface FormError {
    field: string;
    message: string;
} 