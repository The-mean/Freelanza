import { useState, useEffect, useCallback } from 'react';
import { messageService } from '../services/api';
import { Conversation, Message, PaginatedResponse } from '../types';
import { useQuery } from './useQuery';
import { useMutation } from './useMutation';
import { queryClient } from '../App';

export const useMessages = (initialConversationId?: string) => {
    const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(initialConversationId);
    const [newMessage, setNewMessage] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);

    // Konuşmaları çekme
    const {
        data: conversations,
        isLoading: isConversationsLoading,
        error: conversationsError,
        refetch: refetchConversations
    } = useQuery<Conversation[]>(
        ['conversations'],
        () => messageService.getConversations()
    );

    // Seçili konuşmanın mesajlarını çekme
    const {
        data: messagesData,
        isLoading: isMessagesLoading,
        error: messagesError,
        refetch: refetchMessages
    } = useQuery<PaginatedResponse<Message>>(
        ['messages', selectedConversationId],
        () => messageService.getMessages(selectedConversationId as string),
        {
            enabled: !!selectedConversationId
        }
    );

    // Mesaj gönderme
    const sendMessageMutation = useMutation(
        (data: { conversationId: string; text: string; attachments?: File[] }) =>
            messageService.sendMessage(data.conversationId, data.text, data.attachments),
        {
            onSuccess: () => {
                // Mesaj gönderildikten sonra mesajları ve konuşmaları yenile
                queryClient.invalidateQueries({ queryKey: ['messages', selectedConversationId] });
                queryClient.invalidateQueries({ queryKey: ['conversations'] });
                // Formu temizle
                setNewMessage('');
                setAttachments([]);
            }
        }
    );

    // Konuşma oluşturma
    const createConversationMutation = useMutation(
        (data: { recipientId: string; initialMessage?: string }) =>
            messageService.createConversation(data.recipientId, data.initialMessage),
        {
            onSuccess: (newConversation) => {
                // Yeni konuşma oluşturulduktan sonra konuşmaları yenile ve yeni konuşmayı seç
                queryClient.invalidateQueries({ queryKey: ['conversations'] });
                setSelectedConversationId(newConversation.id);
                // Formu temizle
                setNewMessage('');
                setAttachments([]);
            }
        }
    );

    // Okundu olarak işaretleme
    const markAsReadMutation = useMutation(
        (conversationId: string) => messageService.markAsRead(conversationId),
        {
            onSuccess: () => {
                // Konuşmaları yenile
                queryClient.invalidateQueries({ queryKey: ['conversations'] });
            }
        }
    );

    // Konuşma seçildiğinde okundu olarak işaretle
    useEffect(() => {
        if (selectedConversationId) {
            markAsReadMutation.mutate(selectedConversationId);
        }
    }, [selectedConversationId, markAsReadMutation]);

    // Konuşma seçme
    const selectConversation = useCallback((conversationId: string) => {
        setSelectedConversationId(conversationId);
    }, []);

    // Mesaj gönderme
    const sendMessage = useCallback(async () => {
        if (!selectedConversationId || !newMessage.trim()) return;

        try {
            await sendMessageMutation.mutateAsync({
                conversationId: selectedConversationId,
                text: newMessage,
                attachments: attachments.length > 0 ? attachments : undefined
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }, [selectedConversationId, newMessage, attachments, sendMessageMutation]);

    // Yeni konuşma başlatma
    const startConversation = useCallback(async (recipientId: string, initialMessage?: string) => {
        try {
            await createConversationMutation.mutateAsync({
                recipientId,
                initialMessage
            });
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    }, [createConversationMutation]);

    // Dosya ekleme
    const handleAttachmentChange = useCallback((files: FileList | null) => {
        if (files) {
            setAttachments(prev => [...prev, ...Array.from(files)]);
        }
    }, []);

    // Dosya kaldırma
    const removeAttachment = useCallback((index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    }, []);

    return {
        conversations: conversations || [],
        isConversationsLoading,
        conversationsError,
        refetchConversations,

        messages: messagesData?.items || [],
        totalMessages: messagesData?.total || 0,
        isMessagesLoading,
        messagesError,
        refetchMessages,

        selectedConversationId,
        selectConversation,

        newMessage,
        setNewMessage,
        attachments,
        handleAttachmentChange,
        removeAttachment,

        sendMessage,
        isSending: sendMessageMutation.isPending,
        sendError: sendMessageMutation.error,

        startConversation,
        isCreatingConversation: createConversationMutation.isPending,
        createConversationError: createConversationMutation.error
    };
};

export default useMessages; 