import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// JWT token üretme
const generateToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });
};

// Refresh token üretme
const generateRefreshToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'refresh-secret', {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });
};

// Kullanıcı kaydı
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password, role } = req.body;

        // Email kullanımda mı kontrol et
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ApiError(409, 'Email already in use', false);
        }

        // Şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Kullanıcıyı oluştur
        const user = await prisma.user.create({
            data: {
                email,
                hashedPassword,
                role,
                status: 'PENDING_VERIFICATION',
                emailVerified: false,
                verificationCode: uuidv4(),
            },
        });

        // Doğrulama e-postası gönder (burada asıl entegrasyon implement edilecek)
        logger.info(`Verification email would be sent to: ${email}`);

        // Tokenleri oluştur
        const accessToken = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Refresh token'ı veritabanına kaydet
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(
                    Date.now() +
                    parseInt(process.env.JWT_REFRESH_EXPIRES_IN!.replace('d', '')) * 24 * 60 * 60 * 1000
                ),
            },
        });

        res.status(201).json({
            status: 'success',
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Kullanıcı girişi
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        // Kullanıcıyı kontrol et
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new ApiError(401, 'Invalid credentials', false);
        }

        // Şifre kontrolü
        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatch) {
            throw new ApiError(401, 'Invalid credentials', false);
        }

        // Hesap durumunu kontrol et
        if (user.status === 'SUSPENDED') {
            throw new ApiError(401, 'Your account has been suspended', false);
        }

        if (user.status === 'INACTIVE') {
            throw new ApiError(401, 'Your account is inactive', false);
        }

        // Tokenleri oluştur
        const accessToken = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Refresh token'ı veritabanına kaydet
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(
                    Date.now() +
                    parseInt(process.env.JWT_REFRESH_EXPIRES_IN!.replace('d', '')) * 24 * 60 * 60 * 1000
                ),
            },
        });

        res.status(200).json({
            status: 'success',
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Token yenileme
export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { refreshToken: token } = req.body;

        // Veritabanında refresh token'ı kontrol et
        const refreshTokenDoc = await prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!refreshTokenDoc) {
            throw new ApiError(401, 'Invalid refresh token', false);
        }

        // Token süresi dolmuş mu kontrol et
        if (refreshTokenDoc.expiresAt < new Date()) {
            // Süresi dolmuş tokeni sil
            await prisma.refreshToken.delete({
                where: { id: refreshTokenDoc.id },
            });
            throw new ApiError(401, 'Refresh token expired', false);
        }

        // Yeni token oluştur
        const accessToken = generateToken(refreshTokenDoc.user.id);

        res.status(200).json({
            status: 'success',
            accessToken,
            user: {
                id: refreshTokenDoc.user.id,
                email: refreshTokenDoc.user.email,
                role: refreshTokenDoc.user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Çıkış yapma
export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { refreshToken: token } = req.body;

        // Veritabanından refresh token'ı sil
        await prisma.refreshToken.deleteMany({
            where: { token },
        });

        res.status(200).json({
            status: 'success',
            message: 'Logout successful',
        });
    } catch (error) {
        next(error);
    }
};

// Şifre sıfırlama e-postası gönder
export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req.body;

        // Kullanıcıyı kontrol et
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new ApiError(404, 'No user found with this email', false);
        }

        // Şifre sıfırlama kodu oluştur
        const resetToken = uuidv4();
        const passwordResetExpires = new Date(
            Date.now() + 60 * 60 * 1000  // 1 saat
        );

        // Kullanıcıyı güncelle
        // Not: Gerçek projede passwordResetToken ve passwordResetExpires alanları eklenmeli
        // Bu örnekte verinin nasıl saklanacağını göstermek için böyle bırakıyoruz
        logger.info(`Password reset token: ${resetToken}`);
        logger.info(`Token expires: ${passwordResetExpires}`);

        // E-posta gönder (burada asıl entegrasyon implement edilecek)
        logger.info(`Password reset email would be sent to: ${email}`);

        res.status(200).json({
            status: 'success',
            message: 'Password reset email sent',
        });
    } catch (error) {
        next(error);
    }
};

// Şifre sıfırlama
export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token, password } = req.body;

        // Tokeni ve geçerliliğini kontrol et
        // Gerçek projede token ve süre kontrolü yapılacak
        logger.info(`Reset password request with token: ${token}`);

        // Şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Kullanıcıyı güncelle (burada token ve ID ile kullanıcı bulunacak)
        // Bu örnekte işlem simüle ediyoruz
        logger.info(`Password would be reset with hash: ${hashedPassword}`);

        res.status(200).json({
            status: 'success',
            message: 'Password has been reset',
        });
    } catch (error) {
        next(error);
    }
}; 