import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { supabase, createNotification } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const session = await getSession({ req });
        if (!session) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { applicationId, status } = req.body;

        if (!applicationId || !status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Başvuruyu güncelle
        const { data: application, error: updateError } = await supabase
            .from('job_applications')
            .update({ status })
            .eq('id', applicationId)
            .select(`
                *,
                job:jobs (
                    title,
                    company
                ),
                freelancer:freelancer_profiles (
                    user_id
                )
            `)
            .single();

        if (updateError) throw updateError;

        // Bildirim oluştur
        const statusText = status === 'accepted' ? 'kabul edildi' : 'reddedildi';
        await createNotification({
            user_id: application.freelancer.user_id,
            type: 'application_status',
            title: 'Başvuru Durumu Güncellendi',
            message: `"${application.job.title}" pozisyonu için başvurunuz ${statusText}.`,
            link: `/applications`
        });

        // Başvuru kabul edildiyse, otomatik olarak bir konuşma oluştur
        if (status === 'accepted') {
            const { error: conversationError } = await supabase
                .from('conversations')
                .insert([
                    {
                        user_id: application.freelancer.user_id,
                        other_user_id: session.user.id,
                        job_id: application.job_id,
                        last_message: `"${application.job.title}" pozisyonu için başvurunuz kabul edildi. İletişime geçebilirsiniz.`,
                        last_message_time: new Date().toISOString()
                    },
                    {
                        user_id: session.user.id,
                        other_user_id: application.freelancer.user_id,
                        job_id: application.job_id,
                        last_message: `"${application.job.title}" pozisyonu için başvuruyu kabul ettiniz. İletişime geçebilirsiniz.`,
                        last_message_time: new Date().toISOString()
                    }
                ]);

            if (conversationError) throw conversationError;

            // Yeni mesaj bildirimi gönder
            await createNotification({
                user_id: application.freelancer.user_id,
                type: 'new_message',
                title: 'Yeni Mesaj',
                message: `${application.job.company} firması ile mesajlaşmaya başlayabilirsiniz.`,
                link: '/messages'
            });
        }

        return res.status(200).json({ message: 'Application status updated successfully' });
    } catch (error) {
        console.error('Error updating application status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
} 