import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { name, email, password, userType } = req.body;

        // Gerekli alanların kontrolü
        if (!name || !email || !password || !userType) {
            return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
        }

        // Email formatı kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Geçersiz email formatı' });
        }

        // Şifre uzunluğu kontrolü
        if (password.length < 6) {
            return res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır' });
        }

        // Email kullanımda mı kontrolü
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ message: 'Bu email adresi zaten kullanımda' });
        }

        // Şifreyi hashle
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Yeni kullanıcı oluştur
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([
                {
                    name,
                    email,
                    password: hashedPassword,
                    type: userType
                }
            ])
            .select()
            .single();

        if (error) {
            throw error;
        }

        // Başarılı yanıt
        return res.status(201).json({
            message: 'Kullanıcı başarıyla oluşturuldu',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                type: newUser.type
            }
        });
    } catch (error) {
        console.error('Kayıt hatası:', error);
        return res.status(500).json({ message: 'Sunucu hatası' });
    }
} 